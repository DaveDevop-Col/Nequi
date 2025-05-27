// Nequi/fuente/vistas/vistaPedirDinero.js
import { crearNuevaSolicitudDinero } from '../controladores/controladorSolicitudes.js';

const cabeceraApp = document.getElementById('cabecera-app');

export function renderizarPedirDinero(contenedorHTML, navegarHacia) {
    console.log("Renderizando vistaPedirDinero...");
    cabeceraApp.innerHTML = `<button class="btn-atras" data-ruta="/principal">←</button><h2>Pedir Plata</h2>`;
    cabeceraApp.classList.remove('oculto');
    document.querySelector('#cabecera-app .btn-atras').addEventListener('click', (e) => navegarHacia(e.target.dataset.ruta));

    contenedorHTML.innerHTML = `
        <div class="formulario-nequi seccion-pedir-dinero">
            <p class="instruccion">¿A quién le vas a pedir y cuánto?</p>
            <input type="tel" id="telefono-solicitado-form" placeholder="Celu Nequi de tu amigo(a)" inputmode="numeric" required>
            <input type="number" id="monto-solicitado-form" placeholder="Cuánto necesitas ($)" inputmode="numeric" step="any" required>
            <textarea id="mensaje-solicitud-form" placeholder="Mensaje (opcional, ej: Pa' las onces)"></textarea>
            <button id="btn-enviar-peticion" class="btn-primario btn-grande">Pedir Plata</button>
        </div>
    `;

    const btnEnviar = document.getElementById('btn-enviar-peticion');
    btnEnviar.addEventListener('click', async () => {
        const telefono = document.getElementById('telefono-solicitado-form').value.trim();
        const montoStr = document.getElementById('monto-solicitado-form').value;
        const mensaje = document.getElementById('mensaje-solicitud-form').value.trim();

        if (!telefono || !montoStr) {
            alert("El celu y el monto son obligatorios, ¡no te hagas!");
            return;
        }
        const monto = parseFloat(montoStr);
        if (isNaN(monto) || monto <= 0) {
            alert("El monto no es válido, revisa porfa.");
            return;
        }

        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando Petición...';

        const resultado = await crearNuevaSolicitudDinero(telefono, monto, mensaje); // Llama al controlador
        alert(resultado.mensaje);

        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Pedir Plata';

        if (resultado.exito) {
            document.getElementById('telefono-solicitado-form').value = '';
            document.getElementById('monto-solicitado-form').value = '';
            document.getElementById('mensaje-solicitud-form').value = '';
            // Opcional: navegar a otra vista o mostrar un mensaje de éxito más persistente
            // navegarHacia('/principal');
        }
    });
}