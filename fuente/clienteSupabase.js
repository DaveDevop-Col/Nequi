// fuente/clienteSupabase.js
// import { createClient } from '@supabase/supabase-js'; // Descomentar cuando se conecte a Supabase

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseClaveAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl === "URL_SUPABASE_PLACEHOLDER" || supabaseClaveAnon === "ANON_KEY_SUPABASE_PLACEHOLDER") {
    console.warn(" clienteSupabase.js: Usando URLs y Keys de Supabase de placeholder. La conexión real está pendiente.");
}

// Para que la app funcione sin errores de importación, pero sin conexión real aún:
export const supabase = {
    auth: {
        getSession: async () => {
            console.warn("Supabase simulado: getSession llamado");
            const storedSimulatedSession = localStorage.getItem('simulated_nequi_session');
            if (storedSimulatedSession) {
                try {
                    const parsed = JSON.parse(storedSimulatedSession);
                    if (parsed.user && parsed.expires_at > Date.now()) {
                         return { data: { session: parsed }, error: null };
                    }
                } catch (e) { localStorage.removeItem('simulated_nequi_session'); }
            }
            return { data: { session: null }, error: null };
        },
        signInWithPassword: async ({ email, password }) => {
            console.warn("Supabase simulado: signInWithPassword llamado para", email);
            if (email === "test@nequi.com" && password === "123") {
                const simulatedUser = { id: 'user-test-123', email: 'test@nequi.com', app_metadata: {}, user_metadata: {nombre_completo: "Usuario Test"} };
                const simulatedSession = { access_token: 'simulated-token', token_type: 'bearer', user: simulatedUser, expires_at: Date.now() + 3600000 };
                localStorage.setItem('simulated_nequi_session', JSON.stringify(simulatedSession));
                return { data: { user: simulatedUser, session: simulatedSession }, error: null };
            }
            return { data: { user: null, session: null }, error: { message: "Credenciales inválidas (simulación)" } };
        },
        signUp: async ({ email, password, options }) => {
            console.warn("Supabase simulado: signUp llamado para", email, options);
            // Simular creación de usuario y perfil básico
            const simulatedUser = { id: `user-sim-${Date.now()}`, email, app_metadata: {}, user_metadata: options?.data || {} };
             const simulatedSession = { access_token: 'simulated-token-signup', token_type: 'bearer', user: simulatedUser, expires_at: Date.now() + 3600000 };
            // No guardamos sesión en localStorage para forzar el login tras registro simulado
            // o podrías guardarla si quieres que entre directo.
            console.log("Usuario simulado creado (no guardado en localStorage por defecto tras signUp):", simulatedUser);
            return { data: { user: simulatedUser, session: null }, error: null }; // Supabase signUp devuelve sesión null si requiere confirmación
        },
        signOut: async () => {
            console.warn("Supabase simulado: signOut llamado");
            localStorage.removeItem('simulated_nequi_session');
            return { error: null };
        },
        onAuthStateChange: (callback) => {
            console.warn("Supabase simulado: onAuthStateChange suscrito");
            // Simular el evento INITIAL_SESSION al cargar
            setTimeout(async () => {
                const { data: { session } } = await supabase.auth.getSession(); // Llama a nuestra propia simulación
                if (session) {
                    callback('SIGNED_IN', session); // O INITIAL_SESSION si es la primera vez
                } else {
                    callback('SIGNED_OUT', null); // O INITIAL_SESSION con sesión null
                }
            }, 100);

            // Para simular cambios (ej. después de login/logout simulado)
            window.addEventListener('simulated_auth_change', (event) => {
                callback(event.detail.evento, event.detail.sesion);
            });
            return { data: { subscription: { unsubscribe: () => console.log("Suscripción simulada de auth cancelada") } }};
        }
    }
    // from: (tableName) => ({ ... }) // Podrías simular .from().select() etc. si es necesario para otros módulos
};

// Cuando se conecte realmente:
// export const supabase = createClient(supabaseUrl, supabaseClaveAnon);