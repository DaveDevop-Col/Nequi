// Nequi/fuente/vistas/vistaLogin.js
import { iniciarSesionConEmail } from '../controladores/controladorAuth.js';
import { supabase } from '../supabaseClient.js';

export function renderizarLogin(contenedorHTML, _controladorAuth, navegarHacia) { // _controladorAuth no se usa directamente aquí si pasamos la función
    console.log("Renderizando vistaLogin...");
    contenedorHTML.innerHTML = `
        <div class="contenedor-centrado">
            <img src="/iconos/nequi_logo_login.png" alt="Nequi Login" class="logo-login">
            <form id="formulario-login-nequi" class="formulario-nequi">
                <h2>¡Hola!</h2>
                <p class="instruccion">Ingresa tus datos para entrar a Nequi.</p>
                
                <div id="mensaje-error-login" class="mensaje-error oculto"></div>

                <input type="email" id="email-login" name="email" placeholder="Tu correo electrónico" required autocomplete="email">
                <input type="password" id="password-login" name="password" placeholder="Tu clave" required autocomplete="current-password">
                
                <button type="submit" id="btn-entrar-login" class="btn-primario btn-grande">Entrar</button>
                
                <p class="texto-ayuda-form">¿No tienes cuenta?</p>
                <button type="button" id="btn-ir-a-registro" class="btn-enlace">Regístrate aquí</button>
            </form>
        </div>
    `;

    const formLogin = document.getElementById('formulario-login-nequi');
    const btnIrARegistro = document.getElementById('btn-ir-a-registro');
    const mensajeErrorDiv = document.getElementById('mensaje-error-login');

    formLogin.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        mensajeErrorDiv.classList.add('oculto');
        mensajeErrorDiv.textContent = '';

        const email = document.getElementById('email-login').value.trim();
        const password = document.getElementById('password-login').value.trim();
        const btnEntrar = document.getElementById('btn-entrar-login');

        if (!email || !password) {
            mensajeErrorDiv.textContent = "Por favor, completa todos los campos.";
            mensajeErrorDiv.classList.remove('oculto');
            return;
        }

        btnEntrar.disabled = true;
        btnEntrar.textContent = 'Entrando...';

        // La función iniciarSesionConEmail ya la tienes en tu controladorAuth.js
        const resultadoLogin = await iniciarSesionConEmail(email, password);

        if (resultadoLogin.exito) {
            console.log("Login exitoso (simulado), principal.js se encargará de navegar.");
            // No es necesario llamar a navegarHacia aquí,
            // el onAuthStateChange en principal.js debería manejar la redirección.
        } else {
            mensajeErrorDiv.textContent = resultadoLogin.mensaje || "Error al iniciar sesión. Intenta de nuevo.";
            mensajeErrorDiv.classList.remove('oculto');
            btnEntrar.disabled = false;
            btnEntrar.textContent = 'Entrar';
        }
    });

    btnIrARegistro.addEventListener('click', () => {
        navegarHacia('/registro');
    });
}
