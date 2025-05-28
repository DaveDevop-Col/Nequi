// Nequi/fuente/vistas/vistaEnviarDinero.js
import { enviarDineroANequi, enviarDineroABancolombia } from '../controladores/controladorTransferencias.js';

const cabeceraApp = document.getElementById('cabecera-app');

export function renderizarEnviarDinero(contenedorHTML, navegarHacia) {
    console.log("Renderizando vistaEnviarDinero...");
    cabeceraApp.innerHTML = `<button class="btn-atras" data-ruta="/principal">←</button><h2>Enviar Plata</h2>`;
    cabeceraApp.classList.remove('oculto');
    document.querySelector('#cabecera-app .btn-atras').addEventListener('click', (e) => navegarHacia(e.target.dataset.ruta));

    contenedorHTML.innerHTML = `
        <div class="seleccion-tipo-envio">
            <p class="instruccion">¿A dónde quieres enviar tu plata?</p>
            <div class="opciones-envio">
                <button id="btn-opcion-nequi" class="btn-opcion-envio">
                    <img src="publico/iconos/logo.jpg" alt="Nequi">
                    <span>A Nequi</span>
                </button>
                <button id="btn-opcion-bancolombia" class="btn-opcion-envio">
                    <img src="publico/iconos/bancolombia.jpg" alt="Bancolombia">
                    <span>A Bancolombia</span>
                </button>
            </div>
        </div>
        <div id="formulario-envio-dinamico" class="formulario-nequi oculto">
            <!-- El contenido del formulario se cargará aquí -->
        </div>
        <div id="mensaje-resultado-envio" class="mensaje-confirmacion oculto" style="margin-top:15px; text-align:center; padding:10px; border-radius:var(--radio-borde-medio);"></div>
    `;

    const divFormularioDinamico = document.getElementById('formulario-envio-dinamico');
    const mensajeResultadoDiv = document.getElementById('mensaje-resultado-envio');

    const mostrarFormulario = (tipo) => {
        mensajeResultadoDiv.classList.add('oculto');
        mensajeResultadoDiv.textContent = '';
        divFormularioDinamico.classList.remove('oculto');
        let formHTML = '';

        if (tipo === 'nequi') {
            formHTML = `
                <h3>Enviar a Nequi</h3>
                <input type="tel" id="celular-nequi" placeholder="Celu Nequi (10 dígitos)" inputmode="numeric" required>
                <input type="number" id="monto-nequi" placeholder="¿Cuánto?" inputmode="numeric" step="any" required>
                <textarea id="mensaje-nequi" placeholder="Mensaje (opcional)"></textarea>
                <button type="submit" id="btn-submit-nequi" class="btn-primario btn-grande">Enviar a Nequi</button>
            `;
        } else if (tipo === 'bancolombia') {
            formHTML = `
                <h3>Enviar a Bancolombia</h3>
                <select id="tipo-cuenta-bancolombia" required>
                    <option value="">Selecciona tipo de cuenta</option>
                    <option value="ahorros">Ahorros</option>
                    <option value="corriente">Corriente</option>
                </select>
                <input type="text" id="numero-cuenta-bancolombia" placeholder="Número de cuenta" inputmode="numeric" required>
                <input type="number" id="monto-bancolombia" placeholder="¿Cuánto?" inputmode="numeric" step="any" required>
                <input type="text" id="nombre-titular-bancolombia" placeholder="Nombre del titular" required>
                <button type="submit" id="btn-submit-bancolombia" class="btn-primario btn-grande">Enviar a Bancolombia</button>
            `;
        }
        divFormularioDinamico.innerHTML = formHTML;
        adjuntarListenersFormulario(tipo);
    };

    const adjuntarListenersFormulario = (tipo) => {
        if (tipo === 'nequi') {
            const btnSubmitNequi = document.getElementById('btn-submit-nequi');
            btnSubmitNequi.addEventListener('click', async () => {
                const celular = document.getElementById('celular-nequi').value.trim();
                const montoStr = document.getElementById('monto-nequi').value;
                const mensaje = document.getElementById('mensaje-nequi').value.trim();

                if (!celular || !montoStr) { alert("Celu y monto son obligatorios."); return; }
                const monto = parseFloat(montoStr);
                if (isNaN(monto) || monto <= 0) { alert("Monto inválido."); return; }

                btnSubmitNequi.disabled = true; btnSubmitNequi.textContent = 'Enviando...';
                const resultado = await enviarDineroANequi(celular, monto, mensaje);
                mostrarResultado(resultado, btnSubmitNequi, 'Enviar a Nequi');
                if(resultado.exito) divFormularioDinamico.classList.add('oculto');
            });
        } else if (tipo === 'bancolombia') {
            const btnSubmitBancolombia = document.getElementById('btn-submit-bancolombia');
            btnSubmitBancolombia.addEventListener('click', async () => {
                const tipoCuenta = document.getElementById('tipo-cuenta-bancolombia').value;
                const numeroCuenta = document.getElementById('numero-cuenta-bancolombia').value.trim();
                const montoStr = document.getElementById('monto-bancolombia').value;
                const nombreTitular = document.getElementById('nombre-titular-bancolombia').value.trim();

                if (!tipoCuenta || !numeroCuenta || !montoStr || !nombreTitular) { alert("Todos los campos son obligatorios."); return; }
                const monto = parseFloat(montoStr);
                if (isNaN(monto) || monto <= 0) { alert("Monto inválido."); return; }
                
                btnSubmitBancolombia.disabled = true; btnSubmitBancolombia.textContent = 'Enviando...';
                const resultado = await enviarDineroABancolombia(tipoCuenta, numeroCuenta, monto, nombreTitular);
                mostrarResultado(resultado, btnSubmitBancolombia, 'Enviar a Bancolombia');
                 if(resultado.exito) divFormularioDinamico.classList.add('oculto');
            });
        }
    };
    
    const mostrarResultado = (resultado, boton, textoOriginalBoton) => {
        mensajeResultadoDiv.textContent = resultado.mensaje;
        mensajeResultadoDiv.classList.remove('oculto');
        mensajeResultadoDiv.style.backgroundColor = resultado.exito ? 'var(--nequi-lila-suave)' : 'var(--nequi-rosa-claro)';
        mensajeResultadoDiv.style.color = resultado.exito ? 'var(--nequi-morado-principal)' : 'var(--nequi-naranja-alerta)';
        boton.disabled = false;
        boton.textContent = textoOriginalBoton;
    };

    document.getElementById('btn-opcion-nequi').addEventListener('click', () => mostrarFormulario('nequi'));
    document.getElementById('btn-opcion-bancolombia').addEventListener('click', () => mostrarFormulario('bancolombia'));
}