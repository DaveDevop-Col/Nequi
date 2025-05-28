// Nequi/fuente/controladores/controladorTransferencias.js
// Simulación de la lógica de transferencias

// Necesitaremos acceso al saldo principal simulado.
// Podríamos importarlo de controladorBolsillos o manejar una copia aquí.
// Por simplicidad inicial, vamos a asumir que tenemos una función para obtenerlo y actualizarlo.
// En una implementación real, esto sería más complejo y seguro.

import { obtenerSaldoPrincipalSimulado, actualizarSaldoPrincipalSimulado } from './controladorBolsillos.js'; // Asumiendo que estas funciones existen y se exportan

console.log("[ControladorTransferencias] SIMULADO: Inicializado.");

export async function enviarDineroANequi(celularDestino, monto, mensaje = '') {
    console.log(`[CT SIM] Enviar a Nequi: Cel=${celularDestino}, Monto=${monto}, Msg=${mensaje}`);
    monto = parseFloat(monto);

    if (!celularDestino?.trim() || !/^\d{10}$/.test(celularDestino)) {
        return { exito: false, mensaje: "Número de celu Nequi inválido (sim)." };
    }
    if (isNaN(monto) || monto <= 0) {
        return { exito: false, mensaje: "Monto a enviar inválido (sim)." };
    }

    let saldoActual = await obtenerSaldoPrincipalSimulado();
    if (saldoActual < monto) {
        return { exito: false, mensaje: "¡Uy! No te alcanza la plata en tu disponible (sim)." };
    }

    // Simular descuento
    await actualizarSaldoPrincipalSimulado(saldoActual - monto); // Esta función debe existir en controladorBolsillos o implementarse

    const msg = `¡Plata enviada a Nequi ${celularDestino} por $${monto.toLocaleString('es-CO')} (sim)!`;
    console.log(`[CT SIM] ${msg}`);
    return { exito: true, mensaje: msg };
}

export async function enviarDineroABancolombia(tipoCuenta, numeroCuenta, monto, nombreTitular) {
    console.log(`[CT SIM] Enviar a Bancolombia: TC=${tipoCuenta}, NC=${numeroCuenta}, Monto=${monto}, Titular=${nombreTitular}`);
    monto = parseFloat(monto);

    if (!tipoCuenta?.trim() || !numeroCuenta?.trim() || !nombreTitular?.trim()) {
        return { exito: false, mensaje: "Faltan datos para la transferencia a Bancolombia (sim)." };
    }
    if (isNaN(monto) || monto <= 0) {
        return { exito: false, mensaje: "Monto a enviar inválido (sim)." };
    }
     if (!/^\d+$/.test(numeroCuenta)) {
        return { exito: false, mensaje: "Número de cuenta Bancolombia inválido (sim)." };
    }

    let saldoActual = await obtenerSaldoPrincipalSimulado();
    if (saldoActual < monto) {
        return { exito: false, mensaje: "¡Uy! No te alcanza la plata en tu disponible (sim)." };
    }

    // Simular descuento
    await actualizarSaldoPrincipalSimulado(saldoActual - monto);

    const msg = `¡Plata enviada a cuenta Bancolombia ${numeroCuenta} por $${monto.toLocaleString('es-CO')} (sim)!`;
    console.log(`[CT SIM] ${msg}`);
    return { exito: true, mensaje: msg };
}