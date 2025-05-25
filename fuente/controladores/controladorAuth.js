// Nequi/fuente/controladores/controladorAuth.js
// ESQUELETO SIMULADO BÁSICO PARA QUE OTRAS PARTES DE LA APP PUEDAN FUNCIONAR
// Este archivo será reemplazado por la implementación real del encargado de Auth.

import { supabase } from '../clienteSupabase.js'; // Usará la simulación de clienteSupabase.js

export async function verificarSesionActual() {
    // console.log("[AUTH SIM CTRL] Verificando sesión actual...");
    const { data: { session } } = await supabase.auth.getSession(); // Llama a la simulación en clienteSupabase.js
    // if (session) console.log("[AUTH SIM CTRL] Sesión actual encontrada (simulada):", session);
    // else console.log("[AUTH SIM CTRL] No hay sesión actual (simulada).");
    return session; // Devuelve el objeto sesión completo o null
}

export async function obtenerMiPerfil() {
    console.log("[AUTH SIM CTRL] Obteniendo mi perfil...");
    const sesion = await verificarSesionActual();
    if (sesion?.user) {
        console.log("[AUTH SIM CTRL] Devolviendo perfil simulado para:", sesion.user.email);
        // Perfil simulado básico
        return {
            id: sesion.user.id || 'simulado-id-perfil-123',
            email: sesion.user.email,
            nombre_completo: sesion.user.user_metadata?.nombre_completo || "Nequi Usuario Sim",
            telefono: sesion.user.phone || "3009876543",
            saldo_principal: 123456.78,
            // ...cualquier otro campo que las vistas esperen del perfil
            // Asegúrate de incluir cualquier campo que user_metadata normalmente contendría
            ...sesion.user.user_metadata
        };
    }
    console.warn("[AUTH SIM CTRL] No se pudo obtener perfil (sin sesión o sin usuario en sesión).");
    return null;
}

export async function iniciarSesionConEmail(email, password) {
    console.log("[AUTH SIM CTRL] Intentando iniciarSesionConEmail:", email);
    // Llama a la simulación que está en clienteSupabase.js
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("[AUTH SIM CTRL] Error en login simulado devuelto por clienteSupabase.js:", error.message);
        return { exito: false, mensaje: error.message, error };
    }

    if (data && data.session) { // Asegurarse que la simulación de clienteSupabase devuelva la sesión aquí
        console.log("[AUTH SIM CTRL] Login simulado exitoso, sesión de clienteSupabase.js:", data.session);
        // Disparar evento para que onAuthStateChange en principal.js reaccione
        // Esto es crucial si onAuthStateChange en principal.js no se basa solo en la llamada a supabase.auth.onAuthStateChange
        window.dispatchEvent(new CustomEvent('simulated_auth_change', { detail: { evento: 'SIGNED_IN', sesion: data.session }}));
        return { exito: true, sesion: data.session };
    } else {
        // Esto no debería ocurrir si la simulación de clienteSupabase.signInWithPassword funciona
        console.error("[AUTH SIM CTRL] Login simulado no devolvió sesión esperada.");
        return { exito: false, mensaje: "Error interno en simulación de login." };
    }
}

export async function cerrarSesion() {
    console.log("[AUTH SIM CTRL] Intentando cerrarSesion");
    const { error } = await supabase.auth.signOut(); // Llama a la simulación en clienteSupabase.js
    if (error) {
        console.error("[AUTH SIM CTRL] Error en signOut simulado:", error.message);
    }
    // Disparar evento para que onAuthStateChange en principal.js reaccione
    window.dispatchEvent(new CustomEvent('simulated_auth_change', { detail: { evento: 'SIGNED_OUT', sesion: null }}));
    console.log("[AUTH SIM CTRL] Sesión cerrada simuladamente.");
    return { exito: !error };
}

export async function registrarNuevoUsuario(email, password, datosAdicionales = {}) {
    console.log("[AUTH SIM CTRL] Intentando registrar (simulado):", email, datosAdicionales);
    const opcionesSignUp = {
        data: datosAdicionales // Supabase espera 'data' para user_metadata
    };
    // Si el número de teléfono es un campo separado en el formulario de registro,
    // y quieres que se pase a Supabase Auth para el trigger de 'perfiles'
    if (datosAdicionales.telefono) {
        opcionesSignUp.phone = datosAdicionales.telefono;
    }

    // Llama a la simulación en clienteSupabase.js
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: opcionesSignUp
    });

    if (error) {
        console.error("[AUTH SIM CTRL] Error en registro simulado:", error.message);
        return { exito: false, mensaje: error.message, error };
    }
    console.log("[AUTH SIM CTRL] Registro simulado exitoso, usuario:", data.user);
    // En una app real, aquí podría haber confirmación de email.
    // Para la simulación, podríamos asumir que el usuario debe loguearse después.
    alert("Simulación: ¡Registro exitoso! Por favor, inicia sesión para continuar. (El flujo real será implementado por el encargado de Auth).");
    return { exito: true, usuario: data.user };
}

// Log para confirmar que el archivo se cargó y las exportaciones están listas.
console.log("[ControladorAuth SIMULADO] Archivo cargado y todas las funciones deberían estar exportadas.");