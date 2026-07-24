const verificarContrasena = require("./verificarContrasena");

function compararContrasenas(contrasena1, contrasena2) {
    if (!contrasena1 || !contrasena2) {
        return {
            ok: false,
            mensaje: "Debes ingresar ambas contraseñas."
        };
    }

    const resultado1 = verificarContrasena(contrasena1);
    const resultado2 = verificarContrasena(contrasena2);

    let ganador = "";
    const diferencias = [];

    if (resultado1.puntaje > resultado2.puntaje) {
        ganador = "Contraseña 1";
    } else if (resultado2.puntaje > resultado1.puntaje) {
        ganador = "Contraseña 2";
    } else {
        ganador = "Empate";
    }

    if (contrasena1.length > contrasena2.length) {
        diferencias.push("La primera contraseña es más larga.");
    } else if (contrasena2.length > contrasena1.length) {
        diferencias.push("La segunda contraseña es más larga.");
    }

    const num1 = /\d/.test(contrasena1);
    const num2 = /\d/.test(contrasena2);
    if (num1 && !num2) diferencias.push("La primera contraseña incluye números.");
    if (!num1 && num2) diferencias.push("La segunda contraseña incluye números.");

    const mayus1 = /[A-Z]/.test(contrasena1);
    const mayus2 = /[A-Z]/.test(contrasena2);
    if (mayus1 && !mayus2) diferencias.push("La primera contraseña incluye mayúsculas.");
    if (!mayus1 && mayus2) diferencias.push("La segunda contraseña incluye mayúsculas.");

    if (resultado1.nivel !== resultado2.nivel) {
        diferencias.push(`Niveles diferentes: Contraseña 1 es "${resultado1.nivel}" y Contraseña 2 es "${resultado2.nivel}".`);
    }

    return {
        ok: true,
        resultado: {
            ganador: ganador,
            p1: resultado1,
            p2: resultado2,
            diferencias: diferencias
        }
    };
}

module.exports = compararContrasenas;