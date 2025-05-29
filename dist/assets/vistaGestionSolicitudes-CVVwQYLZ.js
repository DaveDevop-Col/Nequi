import{o as p,a as b,r as m,b as v}from"./controladorSolicitudes-C0hB-ihv.js";const d=document.getElementById("cabecera-app");async function f(c,u){console.log("Renderizando vistaGestionSolicitudes..."),d.innerHTML='<button class="btn-atras" data-ruta="/principal">←</button><h2>Campana (Tus Pedidos)</h2>',d.classList.remove("oculto"),document.querySelector("#cabecera-app .btn-atras").addEventListener("click",i=>u(i.target.dataset.ruta)),c.innerHTML=`
       <div class="tabs-solicitudes">
           <button class="tab-btn activo" data-tipo="recibidas">Me Pidieron</button>
           <button class="tab-btn" data-tipo="enviadas">Yo Pedí</button>
       </div>
       <div id="contenido-solicitudes" class="lista-items-nequi">
           <p class="mensaje-carga">Cargando campanazos...</p>
       </div>
    `;const e=document.getElementById("contenido-solicitudes"),r=c.querySelectorAll(".tabs-solicitudes .tab-btn");async function o(i){if(e.innerHTML='<p class="mensaje-carga">Actualizando...</p>',r.forEach(t=>t.classList.remove("activo")),c.querySelector(`.tab-btn[data-tipo="${i}"]`).classList.add("activo"),i==="recibidas"){const t=await p();t.length===0?e.innerHTML='<p class="mensaje-vacio">¡Relax! Nadie te ha pedido plata por ahora.</p>':(e.innerHTML=t.map(a=>`
                    <div class="tarjeta-solicitud recibida" data-id-solicitud="${a.id}">
                        <div class="info-principal">
                            <span class="quien">De: <strong>${a.id_solicitante_nombre}</strong></span>
                            <span class="monto-solicitud"><strong>$${parseFloat(a.monto).toLocaleString("es-CO")}</strong></span>
                        </div>
                        ${a.mensaje?`<p class="mensaje">"${a.mensaje}"</p>`:""}
                        <small class="fecha-solicitud">Recibido: ${new Date(a.fecha_creacion).toLocaleDateString()}</small>
                        <div class="acciones">
                            <button class="btn-accion btn-pagar">Pagarle</button>
                            <button class="btn-accion btn-rechazar">Ahora no</button>
                        </div>
                    </div>
                `).join(""),e.querySelectorAll(".btn-pagar").forEach(a=>{a.addEventListener("click",async n=>{const l=n.target.closest(".tarjeta-solicitud").dataset.idSolicitud;if(confirm("¿Seguro quieres pagar esta solicitud? (Esto es una simulación)")){const s=await b(l);alert(s.mensaje),s.exito&&o("recibidas")}})}),e.querySelectorAll(".btn-rechazar").forEach(a=>{a.addEventListener("click",async n=>{const l=n.target.closest(".tarjeta-solicitud").dataset.idSolicitud;if(confirm("¿Seguro quieres rechazar esta solicitud?")){const s=await m(l);alert(s.mensaje),s.exito&&o("recibidas")}})}))}else if(i==="enviadas"){const t=await v();t.length===0?e.innerHTML='<p class="mensaje-vacio">No has pedido plata todavía. ¡Anímate!</p>':e.innerHTML=t.map(a=>`
                    <div class="tarjeta-solicitud enviada estado-${a.estado.toLowerCase()}">
                        <div class="info-principal">
                            <span class="quien">A: <strong>${a.id_solicitado_nombre}</strong></span>
                            <span class="monto-solicitud">Pediste: <strong>$${parseFloat(a.monto).toLocaleString("es-CO")}</strong></span>
                        </div>
                        <p class="estado">Estado: ${a.estado}</p>
                        ${a.mensaje?`<p class="mensaje">"${a.mensaje}"</p>`:""}
                        <small class="fecha-solicitud">Enviado: ${new Date(a.fecha_creacion).toLocaleDateString()}</small>
                        ${a.fecha_resolucion?`<small class="fecha-resolucion">Resuelta: ${new Date(a.fecha_resolucion).toLocaleDateString()}</small>`:""}
                    </div>
                `).join("")}}r.forEach(i=>{i.addEventListener("click",t=>o(t.target.dataset.tipo))}),o("recibidas")}export{f as renderizarGestionSolicitudes};
