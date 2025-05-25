// serviceWorker.js
const NOMBRE_CACHE = 'nequi-clon-cache-v1.1'; // Incrementa la versión al cambiar archivos
const RECURSOS_A_CACHE = [
    '/',
    '/index.html',
    '/manifiesto.json',
    '/iconos/icono-app-192x192.png',
    '/iconos/icono-app-512x512.png',
    '/iconos/nequi_logo_carga.png',
    // Los iconos de la barra de navegación también podrían ir aquí si son cruciales
    // '/iconos/casa.svg',
    // '/iconos/bolsillos.svg',
    // '/fuente/estilos/estilo.css', // Vite lo manejará con hash en build, esto es más para dev
    // '/fuente/principal.js'      // Vite lo manejará con hash en build
];

self.addEventListener('install', evento => {
    console.log('[SW] Evento: install');
    evento.waitUntil(
        caches.open(NOMBRE_CACHE)
            .then(cache => {
                console.log('[SW] Cacheando app shell inicial:', RECURSOS_A_CACHE);
                return cache.addAll(RECURSOS_A_CACHE);
            })
            .catch(err => console.error('[SW] Falló cache.addAll:', err))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', evento => {
    console.log('[SW] Evento: activate');
    evento.waitUntil(
        caches.keys().then(nombresDeCache => {
            return Promise.all(
                nombresDeCache.map(cache => {
                    if (cache !== NOMBRE_CACHE) {
                        console.log('[SW] Borrando cache antigua:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', evento => {
    if (evento.request.url.includes('supabase.co')) { // No cachear API de Supabase
        evento.respondWith(fetch(evento.request));
        return;
    }

    // Estrategia: Cache primero, luego red para recursos de la app shell.
    // Para archivos con hash de Vite, la red será necesaria la primera vez o tras un cambio.
    evento.respondWith(
        caches.match(evento.request)
            .then(respuestaCache => {
                return respuestaCache || fetch(evento.request).then(respuestaRed => {
                    // Opcional: Cachear dinámicamente si es un recurso GET importante
                    // if (evento.request.method === 'GET' && !evento.request.url.startsWith('chrome-extension://')) {
                    //    return caches.open(NOMBRE_CACHE).then(cache => {
                    //        console.log('[SW] Cacheando nuevo recurso de red:', evento.request.url);
                    //        cache.put(evento.request, respuestaRed.clone());
                    //        return respuestaRed;
                    //    });
                    // }
                    return respuestaRed;
                });
            })
            .catch(error => {
                console.warn('[SW] Fetch fallido, no hay cache ni red para:', evento.request.url, error);
                // Aquí podrías devolver una página offline genérica si la tienes cacheada
                // if (evento.request.mode === 'navigate') {
                //     return caches.match('/offline.html');
                // }
            })
    );
});