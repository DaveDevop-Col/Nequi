// Nequi/fuente/principal.js

import './estilos/estilo.css';
import { supabase } from './clienteSupabase.js'; // Usará la simulación de clienteSupabase.js

const divApp = document.getElementById('app');
const navPrincipal = document.getElementById('navegacion-principal');
const cabeceraApp = document.getElementById('cabecera-app');

let perfilUsuarioActual = null;

// --- BLOQUE DE PRUEBA DE IMPORTACIÓN INICIAL ---
// (Esto es para depuración temprana, puedes comentarlo o quitarlo después)
import('./controladores/controladorAuth.js')
    .then(AuthModule => {
        console.log("PRUEBA INICIAL IMPORTACIÓN AuthModule:", AuthModule);
        if (AuthModule && typeof AuthModule.obtenerMiPerfil === 'function') {
            console.log("PRUEBA INICIAL: obtenerMiPerfil SÍ es una función.");
        } else {
            console.error("PRUEBA INICIAL: obtenerMiPerfil NO es una función o AuthModule es undefined.");
        }
    })
    .catch(err => console.error("PRUEBA INICIAL: Error importando controladorAuth.js:", err));
// --- FIN BLOQUE DE PRUEBA INICIAL ---


async function navegarHacia(ruta) {
    console.log(`[Principal.js] Navegando a: ${ruta}`);
    if (!divApp) {
        console.error("Elemento #app no encontrado. Verifica index.html.");
        return;
    }
    divApp.innerHTML = '<div class="mensaje-carga"><p>Cargando...</p></div>';
    if (cabeceraApp) cabeceraApp.classList.add('oculto');
    if (navPrincipal) navPrincipal.classList.add('oculto');

    const controladorAuth = await import('./controladores/controladorAuth.js');
    const sesion = await controladorAuth.verificarSesionActual();

    if (ruta === '/login' && !sesion) {
        const { renderizarLogin } = await import('./vistas/vistaLogin.js');
        renderizarLogin(divApp, controladorAuth, navegarHacia);
        return;
    }
    if (ruta === '/registro' && !sesion) {
        const { renderizarRegistro } = await import('./vistas/vistaRegistro.js');
        renderizarRegistro(divApp, controladorAuth, navegarHacia);
        return;
    }

    if (!sesion) {
        console.log("[Principal.js] No hay sesión, redirigiendo a /login");
        navegarHacia('/login');
        return;
    }

    if (!perfilUsuarioActual) { // Intentar cargar perfil si aún no está
        perfilUsuarioActual = await controladorAuth.obtenerMiPerfil();
    }

    if (!perfilUsuarioActual && ruta !== '/login' && ruta !== '/registro') {
         console.error("[Principal.js] Sesión activa pero no se pudo cargar el perfil. Cerrando sesión simulada.");
         await controladorAuth.cerrarSesion(); // Esto debería disparar onAuthStateChange para ir a login
         return;
    }
    
    if (navPrincipal) navPrincipal.classList.remove('oculto');

    switch (ruta) {
        case '/':
        case '/principal':
            const { renderizarPrincipalNequi } = await import('./vistas/vistaPrincipal.js');
            if (perfilUsuarioActual) {
                renderizarPrincipalNequi(divApp, perfilUsuarioActual, navegarHacia);
            } else {
                console.error("[Principal.js] Intentando renderizar vista principal sin perfil.");
                navegarHacia('/login'); // Fallback si el perfil no se cargó
            }
            break;
        case '/bolsillos':
            const { renderizarBolsillos } = await import('./vistas/vistaBolsillos.js');
            await renderizarBolsillos(divApp, navegarHacia);
            break;
        case '/pedir-dinero':
            const { renderizarPedirDinero } = await import('./vistas/vistaPedirDinero.js');
            renderizarPedirDinero(divApp, navegarHacia);
            break;
        case '/solicitudes':
            const { renderizarGestionSolicitudes } = await import('./vistas/vistaGestionSolicitudes.js');
            await renderizarGestionSolicitudes(divApp, navegarHacia);
            break;
        case '/enviar-dinero':
            // Asegúrate de que el archivo exista, aunque sea un esqueleto
            try {
                const { renderizarEnviarDinero } = await import('./vistas/vistaEnviarDinero.js');
                renderizarEnviarDinero(divApp, navegarHacia);
            } catch(e) {
                console.error("Error cargando vistaEnviarDinero.js:", e);
                divApp.innerHTML = "<p class='mensaje-error'>Módulo de Enviar Dinero no disponible aún.</p>";
            }
            break;
        default:
            console.warn(`[Principal.js] Ruta desconocida: ${ruta}.`);
            if (sesion) navegarHacia('/principal'); else navegarHacia('/login');
    }
}
window.navegarHacia = navegarHacia; // Exponer globalmente para la consola y botones


function configurarNavegacionInferior() {
    if (!navPrincipal) return;
    navPrincipal.innerHTML = `
        <button data-ruta="/principal" title="Inicio"><img src="/iconos/casa.svg" alt="Inicio"> Inicio</button>
        <button data-ruta="/bolsillos" title="Bolsillos"><img src="/iconos/bolsillos.svg" alt="Bolsillos"> Bolsillos</button>
        <button data-ruta="/pedir-dinero" title="Pedir Dinero"><img src="/iconos/pedir.svg" alt="Pedir"> Pedir</button>
        <button data-ruta="/enviar-dinero" title="Enviar Dinero"><img src="/iconos/enviar.svg" alt="Enviar"> Enviar</button>
        <button data-ruta="/solicitudes" title="Notificaciones"><img src="/iconos/notificaciones.svg" alt="Campana"> Campana</button>
    `;
    navPrincipal.querySelectorAll('button[data-ruta]').forEach(btn => {
        btn.addEventListener('click', () => {
            navPrincipal.querySelectorAll('button[data-ruta]').forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            navegarHacia(btn.dataset.ruta);
        });
    });
}

// Manejo del estado de autenticación (usando la simulación de clienteSupabase.js)
if (supabase && supabase.auth && typeof supabase.auth.onAuthStateChange === 'function') {
    supabase.auth.onAuthStateChange(async (evento, sesion) => {
        console.log('[Principal.js] Evento Auth Supabase:', evento, sesion);
        const controladorAuth = await import('./controladores/controladorAuth.js');

        if (evento === 'SIGNED_IN' || (evento === 'INITIAL_SESSION' && sesion)) {
            perfilUsuarioActual = await controladorAuth.obtenerMiPerfil();
            if (perfilUsuarioActual) {
                console.log("[Principal.js] Perfil cargado:", perfilUsuarioActual);
                configurarNavegacionInferior();
                const rutaActual = window.location.hash.substring(1) || '/'; // Para routing basado en hash si lo usaras
                const esRutaAuth = rutaActual === '/login' || rutaActual === '/registro';
                const rutaDestino = esRutaAuth ? '/' : rutaActual;
                navegarHacia(rutaDestino);
                const btnActivo = navPrincipal.querySelector(`button[data-ruta="${rutaDestino}"]`);
                if (btnActivo) btnActivo.classList.add('activo');
            } else {
                console.error("[Principal.js] SIGNED_IN pero no se pudo cargar perfil. Cerrando sesión.");
                await controladorAuth.cerrarSesion();
            }
        } else if (evento === 'SIGNED_OUT' || (evento === 'INITIAL_SESSION' && !sesion)) {
            console.log("[Principal.js] SIGNED_OUT o no hay sesión inicial.");
            perfilUsuarioActual = null;
            if (navPrincipal) {
                navPrincipal.classList.add('oculto');
                navPrincipal.innerHTML = '';
            }
            navegarHacia('/login');
        }
    });
} else {
    console.error("CRÍTICO: supabase.auth.onAuthStateChange no está disponible. Verifica clienteSupabase.js.");
    if (divApp) divApp.innerHTML = "<p class='mensaje-error'>Error crítico de inicialización.</p>";
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("[Principal.js] DOM completamente cargado y parseado.");
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceWorker.js')
            .then(reg => console.log('[SW Registrado]', reg.scope))
            .catch(err => console.log('[SW Error Registro]', err));
    }
    // La simulación de onAuthStateChange en clienteSupabase.js debería disparar el evento
    // INITIAL_SESSION poco después de la carga, lo que iniciará la navegación.
});

console.log("[Principal.js] Archivo cargado.");