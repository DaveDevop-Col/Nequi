// Nequi/fuente/vistas/vistaGestionSolicitudes.js
import { obtenerSolicitudesRecibidas, obtenerSolicitudesEnviadas, aceptarSolicitud, rechazarSolicitud } from '../controladores/controladorSolicitudes.js';

const cabeceraApp = document.getElementById('cabecera-app');

export async function renderizarGestionSolicitudes(contenedorHTML, navegarHacia) {
    console.log("Renderizando vistaGestionSolicitudes...");
    cabeceraApp.innerHTML = `<button class="btn-atras" data-ruta="/principal">←</button><h2>Campana (Tus Pedidos)</h2>`;
    cabeceraApp.classList.remove('oculto');
    document.querySelector('#cabecera-app .btn-atras').addEventListener('click', (e) => navegarHacia(e.target.dataset.ruta));

    contenedorHTML.innerHTML = `
       <div class="tabs-solicitudes">
           <button class="tab-btn activo" data-tipo="recibidas">Me Pidieron</button>
           <button class="tab-btn" data-tipo="enviadas">Yo Pedí</button>
       </div>
       <div id="contenido-solicitudes" class="lista-items-nequi">
           <p class="mensaje-carga">Cargando campanazos...</p>
       </div>
    `;

    const contenidoDiv = document.getElementById('contenido-solicitudes');
    const btnsTabs = contenedorHTML.querySelectorAll('.tabs-solicitudes .tab-btn');

    async function cargarSolicitudesUI(tipo) {
        contenidoDiv.innerHTML = `<p class="mensaje-carga">Actualizando...</p>`;
        btnsTabs.forEach(b => b.classList.remove('activo'));
        contenedorHTML.querySelector(`.tab-btn[data-tipo="${tipo}"]`).classList.add('activo');

        if (tipo === 'recibidas') {
            const solicitudes = await obtenerSolicitudesRecibidas(); // Llama al controlador
            if (solicitudes.length === 0) {
                contenidoDiv.innerHTML = '<p class="mensaje-vacio">¡Relax! Nadie te ha pedido plata por ahora.</p>';
            } else {
                contenidoDiv.innerHTML = solicitudes.map(s => `
                    <div class="tarjeta-solicitud recibida" data-id-solicitud="${s.id}">
                        <div class="info-principal">
                            <span class="quien">De: <strong>${s.id_solicitante_nombre}</strong></span>
                            <span class="monto-solicitud"><strong>$${parseFloat(s.monto).toLocaleString('es-CO')}</strong></span>
                        </div>
                        ${s.mensaje ? `<p class="mensaje">"${s.mensaje}"</p>` : ''}
                        <small class="fecha-solicitud">Recibido: ${new Date(s.fecha_creacion).toLocaleDateString()}</small>
                        <div class="acciones">
                            <button class="btn-accion btn-pagar">Pagarle</button>
                            <button class="btn-accion btn-rechazar">Ahora no</button>
                        </div>
                    </div>
                `).join('');

                contenidoDiv.querySelectorAll('.btn-pagar').forEach(btnP => {
                    btnP.addEventListener('click', async e => {
                        const id = e.target.closest('.tarjeta-solicitud').dataset.idSolicitud;
                        if (confirm("¿Seguro quieres pagar esta solicitud? (Esto es una simulación)")) {
                            const r = await aceptarSolicitud(id); // Llama al controlador
                            alert(r.mensaje);
                            if(r.exito) cargarSolicitudesUI('recibidas'); // Recargar pestaña actual
                        }
                    });
                });
                contenidoDiv.querySelectorAll('.btn-rechazar').forEach(btnR => {
                   btnR.addEventListener('click', async e => {
                       const id = e.target.closest('.tarjeta-solicitud').dataset.idSolicitud;
                       if (confirm("¿Seguro quieres rechazar esta solicitud?")) {
                           const r = await rechazarSolicitud(id); // Llama al controlador
                           alert(r.mensaje);
                           if(r.exito) cargarSolicitudesUI('recibidas');
                       }
                   });
               });
            }
        } else if (tipo === 'enviadas') {
            const solicitudes = await obtenerSolicitudesEnviadas(); // Llama al controlador
            if (solicitudes.length === 0) {
                contenidoDiv.innerHTML = '<p class="mensaje-vacio">No has pedido plata todavía. ¡Anímate!</p>';
            } else {
                contenidoDiv.innerHTML = solicitudes.map(s => `
                    <div class="tarjeta-solicitud enviada estado-${s.estado.toLowerCase()}">
                        <div class="info-principal">
                            <span class="quien">A: <strong>${s.id_solicitado_nombre}</strong></span>
                            <span class="monto-solicitud">Pediste: <strong>$${parseFloat(s.monto).toLocaleString('es-CO')}</strong></span>
                        </div>
                        <p class="estado">Estado: ${s.estado}</p>
                        ${s.mensaje ? `<p class="mensaje">"${s.mensaje}"</p>` : ''}
                        <small class="fecha-solicitud">Enviado: ${new Date(s.fecha_creacion).toLocaleDateString()}</small>
                        ${s.fecha_resolucion ? `<small class="fecha-resolucion">Resuelta: ${new Date(s.fecha_resolucion).toLocaleDateString()}</small>` : ''}
                    </div>
                `).join('');
            }
        }
    }

    btnsTabs.forEach(btn => {
        btn.addEventListener('click', (e) => cargarSolicitudesUI(e.target.dataset.tipo));
    });

    cargarSolicitudesUI('recibidas'); // Cargar la primera pestaña por defecto
}