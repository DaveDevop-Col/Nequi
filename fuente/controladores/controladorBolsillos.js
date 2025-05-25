// Nequi/fuente/controladores/controladorBolsillos.js

// Datos simulados en memoria (se perderán al recargar la página)
let bolsillosSimulados = [
    { id: 1, nombre: "Ahorro Viaje ✈️", saldo: 50000, meta_ahorro: 200000 },
    { id: 2, nombre: "Regalo Mamá 🎁", saldo: 15000, meta_ahorro: 80000 },
];
let proximoIdBolsillo = 3;
let saldoPrincipalSimulado = 100000; // Saldo principal de ejemplo

console.log("[ControladorBolsillos] Inicializado con datos simulados.");

export async function crearNuevoBolsillo(nombre, metaAhorro = null) {
    console.log(`[ControladorBolsillos] Intentando crear bolsillo: Nombre=${nombre}, Meta=${metaAhorro}`);
    if (!nombre || nombre.trim() === "") {
        const mensaje = "El nombre del bolsillo no puede estar vacío.";
        console.warn(`[ControladorBolsillos] Falló creación: ${mensaje}`);
        return { exito: false, mensaje };
    }
    const nuevoBolsillo = {
        id: proximoIdBolsillo++,
        nombre: nombre.trim(),
        saldo: 0,
        meta_ahorro: metaAhorro ? parseFloat(metaAhorro) : null
    };
    bolsillosSimulados.push(nuevoBolsillo);
    const mensaje = `¡Bolsillo "${nuevoBolsillo.nombre}" creado (simulado)!`;
    console.log(`[ControladorBolsillos] Éxito: ${mensaje}`, nuevoBolsillo);
    return { exito: true, bolsillo: nuevoBolsillo, mensaje };
}

export async function obtenerMisBolsillos() {
    console.log("[ControladorBolsillos] Obteniendo mis bolsillos (simulados)...", bolsillosSimulados);
    return [...bolsillosSimulados];
}

export async function obtenerSaldoPrincipalSimulado() {
   console.log("[ControladorBolsillos] Obteniendo saldo principal (simulado)...", saldoPrincipalSimulado);
   return saldoPrincipalSimulado;
}

export async function abonarABolsillo(idBolsillo, montoAAbonar) {
    console.log(`[ControladorBolsillos] Intentando abonar $${montoAAbonar} al bolsillo ID: ${idBolsillo}`);
    montoAAbonar = parseFloat(montoAAbonar);
    const bolsillo = bolsillosSimulados.find(b => b.id === parseInt(idBolsillo));

    if (!bolsillo) {
        const mensaje = "Bolsillo no encontrado para abonar.";
        console.warn(`[ControladorBolsillos] Falló abono: ${mensaje}`);
        return { exito: false, mensaje };
    }
    if (isNaN(montoAAbonar) || montoAAbonar <= 0) {
        const mensaje = "El monto a abonar es inválido.";
        console.warn(`[ControladorBolsillos] Falló abono: ${mensaje}`);
        return { exito: false, mensaje };
    }
    if (saldoPrincipalSimulado < montoAAbonar) {
       const mensaje = "No tienes suficiente saldo principal (simulado).";
       console.warn(`[ControladorBolsillos] Falló abono: ${mensaje}`);
       return { exito: false, mensaje };
    }

    saldoPrincipalSimulado -= montoAAbonar;
    bolsillo.saldo += montoAAbonar;
    const mensaje = `¡$${montoAAbonar.toLocaleString('es-CO')} abonados a "${bolsillo.nombre}" (simulado)! Saldo principal ahora: $${saldoPrincipalSimulado.toLocaleString('es-CO')}`;
    console.log(`[ControladorBolsillos] Éxito abono: ${mensaje}`, bolsillo);
    return { exito: true, mensaje };
}

export async function retirarDeBolsillo(idBolsillo, montoARetirar) {
    console.log(`[ControladorBolsillos] Intentando retirar $${montoARetirar} del bolsillo ID: ${idBolsillo}`);
    montoARetirar = parseFloat(montoARetirar);
    const bolsillo = bolsillosSimulados.find(b => b.id === parseInt(idBolsillo));

    if (!bolsillo) {
        const mensaje = "Bolsillo no encontrado para retirar.";
        console.warn(`[ControladorBolsillos] Falló retiro: ${mensaje}`);
        return { exito: false, mensaje };
    }
    if (isNaN(montoARetirar) || montoARetirar <= 0) {
       const mensaje = "Monto a retirar inválido.";
       console.warn(`[ControladorBolsillos] Falló retiro: ${mensaje}`);
       return { exito: false, mensaje };
   }
    if (bolsillo.saldo < montoARetirar) {
        const mensaje = "Saldo insuficiente en el bolsillo (simulado).";
        console.warn(`[ControladorBolsillos] Falló retiro: ${mensaje}`);
        return { exito: false, mensaje };
    }

    bolsillo.saldo -= montoARetirar;
    saldoPrincipalSimulado += montoARetirar;
    const mensaje = `¡$${montoARetirar.toLocaleString('es-CO')} retirados de "${bolsillo.nombre}"! Saldo principal ahora: $${saldoPrincipalSimulado.toLocaleString('es-CO')}`;
    console.log(`[ControladorBolsillos] Éxito retiro: ${mensaje}`, bolsillo);
    return { exito: true, mensaje };
}