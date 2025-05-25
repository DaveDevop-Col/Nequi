// Nequi/fuente/controladores/controladorSolicitudes.js

let solicitudesSimuladas = [
    { id: 101, id_solicitante_nombre: "Ana V.", id_solicitado_nombre: "Yo Mismo", monto: 20000, mensaje: "Pa'l almuerzo 🍔", estado: "PENDIENTE", fecha_creacion: new Date(Date.now() - 86400000).toISOString(), tipo: "recibida" },
    { id: 102, id_solicitante_nombre: "Yo Mismo", id_solicitado_nombre: "Carlos P.", monto: 50000, mensaje: "Cuota del paseo", estado: "ACEPTADA", fecha_creacion: new Date(Date.now() - 172800000).toISOString(), tipo: "enviada" },
    { id: 103, id_solicitante_nombre: "Luisa G.", id_solicitado_nombre: "Yo Mismo", monto: 10000, mensaje: "", estado: "PENDIENTE", fecha_creacion: new Date().toISOString(), tipo: "recibida" },
];
let proximoIdSolicitud = 104;

console.log("[ControladorSolicitudes] Inicializado con datos simulados.");

export async function crearNuevaSolicitudDinero(telefonoDestinatario, monto, mensaje = '') {
    console.log(`[ControladorSolicitudes] Intentando crear solicitud: A=${telefonoDestinatario}, Monto=${monto}, Mensaje=${mensaje}`);
    monto = parseFloat(monto);
    if (!telefonoDestinatario?.trim() || isNaN(monto) || monto <= 0) {
        const msg = "Datos de solicitud inválidos (simulación).";
        console.warn(`[ControladorSolicitudes] Falló creación: ${msg}`);
        return { exito: false, mensaje: msg };
    }

    const nombreDestinatarioSimulado = `Usuario ${telefonoDestinatario.slice(-4)}`;
    const nuevaSolicitud = {
        id: proximoIdSolicitud++,
        id_solicitante_nombre: "Yo Mismo (Simulado)",
        id_solicitado_nombre: nombreDestinatarioSimulado,
        monto,
        mensaje,
        estado: 'PENDIENTE',
        fecha_creacion: new Date().toISOString(),
        tipo: "enviada"
    };
    solicitudesSimuladas.push(nuevaSolicitud);
    const msg = `¡Solicitud de $${monto.toLocaleString('es-CO')} enviada a ${nombreDestinatarioSimulado} (simulado)!`;
    console.log(`[ControladorSolicitudes] Éxito creación: ${msg}`, nuevaSolicitud);
    return { exito: true, solicitud: nuevaSolicitud, mensaje: msg };
}

export async function obtenerSolicitudesRecibidas() {
    const recibidas = solicitudesSimuladas.filter(s => s.tipo === "recibida" && s.estado === "PENDIENTE");
    console.log("[ControladorSolicitudes] Obteniendo solicitudes recibidas PENDIENTES (simuladas)...", recibidas);
    // Simular un pequeño delay
    // await new Promise(resolve => setTimeout(resolve, 250));
    return [...recibidas];
}

export async function obtenerSolicitudesEnviadas() {
    const enviadas = solicitudesSimuladas.filter(s => s.tipo === "enviada");
    console.log("[ControladorSolicitudes] Obteniendo solicitudes enviadas (simuladas)...", enviadas);
    // await new Promise(resolve => setTimeout(resolve, 250));
    return [...enviadas];
}

export async function aceptarSolicitud(idSolicitud) {
    console.log(`[ControladorSolicitudes] Intentando aceptar solicitud ID: ${idSolicitud}`);
    const solicitud = solicitudesSimuladas.find(s => s.id === parseInt(idSolicitud) && s.tipo === "recibida");

    if (!solicitud) {
        const msg = "Solicitud no encontrada o no es para ti (simulación).";
        console.warn(`[ControladorSolicitudes] Falló aceptación: ${msg}`);
        return { exito: false, mensaje: msg };
    }
    if (solicitud.estado !== 'PENDIENTE') {
        const msg = "Esta solicitud ya se procesó (simulación).";
        console.warn(`[ControladorSolicitudes] Falló aceptación: ${msg}`);
        return { exito: false, mensaje: msg };
    }
    // En una versión real, aquí se descontaría del saldo principal.
    // Y se sumaría al saldo del solicitante.
    // const { obtenerSaldoPrincipalSimulado, /* funcionParaActualizarSaldoPrincipal */ } = await import('./controladorBolsillos.js'); // Ejemplo si necesitaras el saldo
    // const saldoActual = await obtenerSaldoPrincipalSimulado();
    // if (saldoActual < solicitud.monto) { /* ...manejar error... */ }
    
    solicitud.estado = 'ACEPTADA';
    solicitud.fecha_resolucion = new Date().toISOString();
    const msg = `¡Pagaste la solicitud de ${solicitud.id_solicitante_nombre} por $${solicitud.monto.toLocaleString('es-CO')} (simulado)!`;
    console.log(`[ControladorSolicitudes] Éxito aceptación: ${msg}`, solicitud);
    alert("SIMULACIÓN: Dinero enviado y saldo principal (simulado) actualizado. Revisa la consola.");
    return { exito: true, mensaje: msg };
}

export async function rechazarSolicitud(idSolicitud) {
    console.log(`[ControladorSolicitudes] Intentando rechazar solicitud ID: ${idSolicitud}`);
    const solicitud = solicitudesSimuladas.find(s => s.id === parseInt(idSolicitud) && s.tipo === "recibida");

    if (!solicitud) {
        const msg = "Solicitud no encontrada (simulación).";
        console.warn(`[ControladorSolicitudes] Falló rechazo: ${msg}`);
        return { exito: false, mensaje: msg };
    }
    if (solicitud.estado !== 'PENDIENTE') {
       const msg = "Esta solicitud ya se procesó (simulación).";
       console.warn(`[ControladorSolicitudes] Falló rechazo: ${msg}`);
       return { exito: false, mensaje: msg };
   }

    solicitud.estado = 'RECHAZADA';
    solicitud.fecha_resolucion = new Date().toISOString();
    const msg = "Solicitud rechazada (simulado).";
    console.log(`[ControladorSolicitudes] Éxito rechazo: ${msg}`, solicitud);
    return { exito: true, mensaje: msg };
}