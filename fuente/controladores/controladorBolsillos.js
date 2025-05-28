// Nequi/fuente/controladores/controladorBolsillos.js

let bolsillosSimulados = [
    { id: 1, nombre: "Ahorro Viaje ✈️", saldo: 50000, meta_ahorro: 200000 },
    { id: 2, nombre: "Regalo Mamá 🎁", saldo: 15000, meta_ahorro: 80000 },
];
let proximoIdBolsillo = 3;
let saldoPrincipalSimulado = 100000; // Saldo principal de ejemplo

console.log("[ControladorBolsillos] SIMULADO: Inicializado con datos.");

export async function crearNuevoBolsillo(nombre, metaAhorro = null) {
    console.log(`[CB SIM] Crear: ${nombre}, Meta: ${metaAhorro}`);
    if (!nombre || nombre.trim() === "") {
        const m = "Nombre de bolsillo vacío."; console.warn(`[CB SIM] ${m}`);
        return { exito: false, mensaje: m };
    }
    const nuevo = { id: proximoIdBolsillo++, nombre: nombre.trim(), saldo: 0, meta_ahorro: metaAhorro ? parseFloat(metaAhorro) : null };
    bolsillosSimulados.push(nuevo);
    const m = `¡Bolsillo "${nuevo.nombre}" creado (sim)!`; console.log(`[CB SIM] ${m}`, nuevo);
    return { exito: true, bolsillo: nuevo, mensaje: m };
}

export async function obtenerMisBolsillos() {
    console.log("[CB SIM] Obteniendo bolsillos...", bolsillosSimulados);
    // await new Promise(resolve => setTimeout(resolve, 150)); // Simular delay
    return [...bolsillosSimulados];
}

export async function obtenerSaldoPrincipalSimulado() { // La vista de bolsillos podría necesitar esto
   console.log("[CB SIM] Obteniendo saldo principal...", saldoPrincipalSimulado);
   return saldoPrincipalSimulado;
}

export async function actualizarSaldoPrincipalSimulado(nuevoSaldo) {
    console.log(`[CB SIM] Actualizando saldo principal a: ${nuevoSaldo}`);
    saldoPrincipalSimulado = nuevoSaldo;

    return true; 
}
export async function abonarABolsillo(idBolsillo, montoAAbonar) {
    console.log(`[CB SIM] Abonar $${montoAAbonar} a bolsillo ID: ${idBolsillo}`);
    montoAAbonar = parseFloat(montoAAbonar);
    const idx = bolsillosSimulados.findIndex(b => b.id === parseInt(idBolsillo));

    if (idx === -1) { const m = "Bolsillo no encontrado."; console.warn(`[CB SIM] ${m}`); return { exito: false, mensaje: m };}
    if (isNaN(montoAAbonar) || montoAAbonar <= 0) { const m = "Monto a abonar inválido."; console.warn(`[CB SIM] ${m}`); return { exito: false, mensaje: m };}
    if (saldoPrincipalSimulado < montoAAbonar) { const m = "Saldo principal simulado insuficiente."; console.warn(`[CB SIM] ${m}`); return { exito: false, mensaje: m };}

    saldoPrincipalSimulado -= montoAAbonar;
    bolsillosSimulados[idx].saldo += montoAAbonar;
    const m = `¡$${montoAAbonar.toLocaleString('es-CO')} abonados a "${bolsillosSimulados[idx].nombre}" (sim)! Saldo principal: $${saldoPrincipalSimulado.toLocaleString('es-CO')}`;
    console.log(`[CB SIM] ${m}`, bolsillosSimulados[idx]);
    return { exito: true, mensaje: m };
}

export async function retirarDeBolsillo(idBolsillo, montoARetirar) {
    console.log(`[CB SIM] Retirar $${montoARetirar} de bolsillo ID: ${idBolsillo}`);
    montoARetirar = parseFloat(montoARetirar);
    const idx = bolsillosSimulados.findIndex(b => b.id === parseInt(idBolsillo));

    if (idx === -1) { const m = "Bolsillo no encontrado."; console.warn(`[CB SIM] ${m}`); return { exito: false, mensaje: m };}
    if (isNaN(montoARetirar) || montoARetirar <= 0) { const m = "Monto a retirar inválido."; console.warn(`[CB SIM] ${m}`); return { exito: false, mensaje: m };}
    if (bolsillosSimulados[idx].saldo < montoARetirar) { const m = "Saldo insuficiente en bolsillo (sim)."; console.warn(`[CB SIM] ${m}`); return { exito: false, mensaje: m };}

    bolsillosSimulados[idx].saldo -= montoARetirar;
    saldoPrincipalSimulado += montoARetirar;
    const m = `¡$${montoARetirar.toLocaleString('es-CO')} retirados de "${bolsillosSimulados[idx].nombre}" (sim)! Saldo principal: $${saldoPrincipalSimulado.toLocaleString('es-CO')}`;
    console.log(`[CB SIM] ${m}`, bolsillosSimulados[idx]);
    return { exito: true, mensaje: m };
}