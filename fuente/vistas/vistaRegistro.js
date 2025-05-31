// Nequi/fuente/vistas/vistaRegistro.js
import { supabase } from '../supabaseClient.js';
import { registrarNuevoUsuario } from '../controladores/controladorAuth.js';

export function renderizarRegistro(contenedorHTML, _controladorAuth, navegarHacia) {
    console.log("Renderizando vistaRegistro...");
    contenedorHTML.innerHTML = `
        <div class="contenedor-centrado">
            <img src="/iconos/nequi_logo_login.png" alt="Nequi Registro" class="logo-login"> 
            <form id="formulario-registro-nequi" class="formulario-nequi">
                <h2>Crea tu cuenta Nequi</h2>
                <p class="instruccion">Es rápido y fácil. ¡Vamos a ello!</p>

                <div id="mensaje-error-registro" class="mensaje-error oculto"></div>

                <input type="text" id="nombre-registro" name="nombre" placeholder="Tu nombre completo" required autocomplete="name">
                <input type="email" id="email-registro" name="email" placeholder="Tu correo electrónico" required autocomplete="email">
                <input type="tel" id="telefono-registro" name="telefono" placeholder="Tu número de celu Nequi" required autocomplete="tel" inputmode="numeric">
                <input type="date" id="fecha-nacimiento-registro" name="fechaNacimiento" placeholder="Fecha de nacimiento" required autocomplete="bday">
                <input type="password" id="password-registro" name="password" placeholder="Crea una clave" required autocomplete="new-password">
                <input type="password" id="confirmar-password-registro" name="confirmarPassword" placeholder="Confirma tu clave" required autocomplete="new-password">
                
                <button type="submit" id="btn-crear-cuenta-registro" class="btn-primario btn-grande">Crear Cuenta</button>
                
                <p class="texto-ayuda-form">¿Ya tienes cuenta?</p>
                <button type="button" id="btn-ir-a-login" class="btn-enlace">Inicia sesión aquí</button>
            </form>
        </div>
    `;

    const formRegistro = document.getElementById('formulario-registro-nequi');
    const btnIrALogin = document.getElementById('btn-ir-a-login');
    const mensajeErrorDiv = document.getElementById('mensaje-error-registro');

    formRegistro.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        mensajeErrorDiv.classList.add('oculto');
        mensajeErrorDiv.textContent = '';

        const nombre = document.getElementById('nombre-registro').value.trim();
        const email = document.getElementById('email-registro').value.trim();
        const telefono = document.getElementById('telefono-registro').value.trim();
        const fechaNacimiento = document.getElementById('fecha-nacimiento-registro').value;
        const password = document.getElementById('password-registro').value;
        const confirmarPassword = document.getElementById('confirmar-password-registro').value;
        
        const btnCrearCuenta = document.getElementById('btn-crear-cuenta-registro');

        if (!nombre || !email || !telefono || !fechaNacimiento || !password || !confirmarPassword) {
            mensajeErrorDiv.textContent = "Todos los campos son obligatorios.";
            mensajeErrorDiv.classList.remove('oculto');
            return;
        }

        if (password !== confirmarPassword) {
            mensajeErrorDiv.textContent = "Las claves no coinciden. ¡Revisa porfa!";
            mensajeErrorDiv.classList.remove('oculto');
            return;
        }

        // Validación simple de teléfono (ej. 10 dígitos numéricos)
        if (!/^\d{10}$/.test(telefono)) {
            mensajeErrorDiv.textContent = "El número de celu debe tener 10 dígitos.";
            mensajeErrorDiv.classList.remove('oculto');
            return;
        }
        
        btnCrearCuenta.disabled = true;
        btnCrearCuenta.textContent = 'Creando cuenta...';

        const datosAdicionales = {
            nombre_completo: nombre, // Supabase/controladorAuth espera 'nombre_completo'
            telefono: telefono,
            fecha_nacimiento: fechaNacimiento,
            roll: 'usuario' // Rol por defecto al registrarse
        };

        // La función registrarNuevoUsuario ya la tienes en tu controladorAuth.js
        const resultadoRegistro = await registrarNuevoUsuario(email, password, datosAdicionales);

        if (resultadoRegistro.exito) {
            // El alert de "Registro exitoso" ya está en controladorAuth.js
            // En la simulación, dijimos que no se loguea automáticamente.
            navegarHacia('/login'); 
        } else {
            mensajeErrorDiv.textContent = resultadoRegistro.mensaje || "Error al registrar la cuenta. Intenta de nuevo.";
            mensajeErrorDiv.classList.remove('oculto');
            btnCrearCuenta.disabled = false;
            btnCrearCuenta.textContent = 'Crear Cuenta';
        }
    });

    btnIrALogin.addEventListener('click', () => {
        navegarHacia('/login');
    });
}