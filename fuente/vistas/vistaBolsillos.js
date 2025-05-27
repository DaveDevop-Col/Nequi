// Nequi/fuente/vistas/vistaBolsillos.js
import { crearNuevoBolsillo, obtenerMisBolsillos, abonarABolsillo, retirarDeBolsillo } from '../controladores/controladorBolsillos.js';

const cabeceraApp = document.getElementById('cabecera-app');

function mostrarFormularioCrearBolsilloModal(contenedorHTML, navegarHacia) {
    const modalId = 'modal-crear-bolsillo-nequi';
    if (document.getElementById(modalId)) { // Evitar duplicar si ya está abierto
        document.getElementById(modalId).classList.add('visible');
        return;
    }

    const modalHtml = `
        <div class="modal-nequi-superposicion visible" id="${modalId}">
            <div class="modal-nequi-contenido">
                <h3>Crear Bolsillo</h3>
                <input type="text" id="nombre-nuevo-bolsillo-modal" placeholder="Dale un nombre (Ej: Viaje)" required>
                <input type="number" id="meta-nuevo-bolsillo-modal" placeholder="Meta de ahorro (opcional)" inputmode="numeric" step="1000">
                <div class="modal-acciones">
                    <button id="btn-guardar-bolsillo-modal" class="btn-primario">Guardar</button>
                    <button id="btn-cancelar-bolsillo-modal" class="btn-secundario">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modalElement = document.getElementById(modalId);
    const guardarBtn = modalElement.querySelector('#btn-guardar-bolsillo-modal');
    const cancelarBtn = modalElement.querySelector('#btn-cancelar-bolsillo-modal');

    const cerrarModal = () => modalElement.remove();

    guardarBtn.addEventListener('click', async () => {
        const nombre = modalElement.querySelector('#nombre-nuevo-bolsillo-modal').value.trim();
        const metaStr = modalElement.querySelector('#meta-nuevo-bolsillo-modal').value;
        const meta = metaStr ? parseFloat(metaStr) : null;

        if (!nombre) {
            alert("El nombre es obligatorio para tu bolsillo.");
            return;
        }
        guardarBtn.disabled = true;
        guardarBtn.textContent = 'Guardando...';

        const resultado = await crearNuevoBolsillo(nombre, meta);
        alert(resultado.mensaje);

        guardarBtn.disabled = false;
        guardarBtn.textContent = 'Guardar';
        if (resultado.exito) {
            cerrarModal();
            navegarHacia('/bolsillos');
        }
    });
    cancelarBtn.addEventListener('click', cerrarModal);
    modalElement.addEventListener('click', (e) => { // Cerrar al hacer clic fuera del contenido
        if (e.target.id === modalId) cerrarModal();
    });
}

export async function renderizarBolsillos(contenedorHTML, navegarHacia) {
    console.log("Renderizando vistaBolsillos...");
    cabeceraApp.innerHTML = `<button class="btn-atras" title="Volver">←</button><h2>Mis Bolsillos</h2><button id="btn-abrir-modal-crear-bolsillo" class="btn-accion-cabecera" title="Crear nuevo bolsillo">+</button>`;
    cabeceraApp.classList.remove('oculto');
    document.querySelector('#cabecera-app .btn-atras').onclick = () => navegarHacia('/principal'); // Más directo
    document.getElementById('btn-abrir-modal-crear-bolsillo').onclick = () => mostrarFormularioCrearBolsilloModal(contenedorHTML, navegarHacia);

    contenedorHTML.innerHTML = `<div id="lista-bolsillos-render" class="lista-items-nequi"><p class="mensaje-carga">Cargando tus bolsillos...</p></div>`;
    const listaBolsillosDiv = document.getElementById('lista-bolsillos-render');

    try {
        const bolsillos = await obtenerMisBolsillos();
        if (bolsillos.length === 0) {
            listaBolsillosDiv.innerHTML = '<p class="mensaje-vacio">¡Aún no tienes bolsillos! Crea uno para empezar a ahorrar.</p>';
        } else {
            listaBolsillosDiv.innerHTML = bolsillos.map(b => `
                <div class="tarjeta-bolsillo" data-id-bolsillo="${b.id}">
                    <div class="tarjeta-bolsillo-icono">🐖</div>
                    <div class="tarjeta-bolsillo-info">
                        <h3>${b.nombre}</h3>
                        <p class="saldo">Disponible: <strong>$${parseFloat(b.saldo || 0).toLocaleString('es-CO', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</strong></p>
                        ${b.meta_ahorro ? `<p class="meta">Meta: $${parseFloat(b.meta_ahorro).toLocaleString('es-CO', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>` : ''}
                    </div>
                    <div class="tarjeta-bolsillo-acciones">
                        <button class="btn-accion-bolsillo btn-abonar" title="Abonar a ${b.nombre}">Meter Plata</button>
                        <button class="btn-accion-bolsillo btn-retirar" title="Sacar plata de ${b.nombre}">Sacar Plata</button>
                    </div>
                </div>
            `).join('');

            listaBolsillosDiv.querySelectorAll('.tarjeta-bolsillo .btn-abonar').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const idBolsillo = e.target.closest('.tarjeta-bolsillo').dataset.idBolsillo;
                    const nombreBolsillo = e.target.closest('.tarjeta-bolsillo').querySelector('h3').textContent;
                    const montoStr = prompt(`¿Cuánta plata quieres meterle a "${nombreBolsillo}"?`);
                    if (montoStr) {
                        const monto = parseFloat(montoStr);
                        if (!isNaN(monto) && monto > 0) {
                            const resultado = await abonarABolsillo(idBolsillo, monto);
                            alert(resultado.mensaje);
                            if (resultado.exito) navegarHacia('/bolsillos');
                        } else { alert("Escribe un monto válido, porfa."); }
                    }
                });
            });
            listaBolsillosDiv.querySelectorAll('.tarjeta-bolsillo .btn-retirar').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const idBolsillo = e.target.closest('.tarjeta-bolsillo').dataset.idBolsillo;
                    const nombreBolsillo = e.target.closest('.tarjeta-bolsillo').querySelector('h3').textContent;
                    const montoStr = prompt(`¿Cuánta plata quieres sacar de "${nombreBolsillo}" pa' tu disponible?`);
                     if (montoStr) {
                        const monto = parseFloat(montoStr);
                        if (!isNaN(monto) && monto > 0) {
                            const resultado = await retirarDeBolsillo(idBolsillo, monto);
                            alert(resultado.mensaje);
                            if (resultado.exito) navegarHacia('/bolsillos');
                        } else { alert("Escribe un monto válido, porfa."); }
                    }
                });
            });
        }
    } catch (error) {
        console.error("Error renderizando bolsillos:", error);
        listaBolsillosDiv.innerHTML = '<p class="mensaje-error">¡Ups! No pudimos cargar tus bolsillos. Intenta de nuevo.</p>';
    }
}