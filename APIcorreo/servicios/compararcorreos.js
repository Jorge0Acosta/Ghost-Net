const verificarCorreo = require("./verificarcorreo");

function compararCorreo(correo1, correo2) {

    const resultado1 = verificarCorreo(correo1);
    const resultado2 = verificarCorreo(correo2);

    let ganador = "";
    const diferencias = [];

    if (resultado1.puntaje > resultado2.puntaje) {

        ganador = "correo1";

    } else if (resultado2.puntaje > resultado1.puntaje) {

        ganador = "correo2";

    } else {

        ganador = "Empate";

    }

    // Comparación de longitud
    const usuario1 = correo1.split("@")[0];
    const usuario2 = correo2.split("@")[0];

    if (usuario1.length > usuario2.length) {

        diferencias.push("El primer correo tiene un identificador más largo.");

    } else if (usuario2.length > usuario1.length) {

        diferencias.push("El segundo correo tiene un identificador más largo.");

    }

    // Comparación de números
    const numeros1 = /\d/.test(usuario1);
    const numeros2 = /\d/.test(usuario2);

    if (numeros1 && !numeros2) {

        diferencias.push("El primer correo contiene números.");

    } else if (!numeros1 && numeros2) {

        diferencias.push("El segundo correo contiene números.");

    }

    // Comparación de punto
    const punto1 = usuario1.includes(".");
    const punto2 = usuario2.includes(".");

    if (punto1 && !punto2) {

        diferencias.push("El primer correo utiliza punto.");

    } else if (!punto1 && punto2) {

        diferencias.push("El segundo correo utiliza punto.");

    }

    // Comparación de guion bajo
    const guion1 = usuario1.includes("_");
    const guion2 = usuario2.includes("_");

    if (guion1 && !guion2) {

        diferencias.push("El primer correo utiliza guion bajo.");

    } else if (!guion1 && guion2) {

        diferencias.push("El segundo correo utiliza guion bajo.");

    }

    // Comparación de nivel
    if (resultado1.nivel !== resultado2.nivel) {

        diferencias.push(
            `El primer correo tiene un nivel "${resultado1.nivel}" y el segundo "${resultado2.nivel}".`
        );

    }

    // Comparación de fortalezas
    if (resultado1.fortalezas.length > resultado2.fortalezas.length) {

        diferencias.push("El primer correo cumple más criterios de seguridad.");

    } else if (resultado2.fortalezas.length > resultado1.fortalezas.length) {

        diferencias.push("El segundo correo cumple más criterios de seguridad.");

    }

    // Comparación de debilidades
    if (resultado1.debilidades.length > resultado2.debilidades.length) {

        diferencias.push("El primer correo presenta más debilidades.");

    } else if (resultado2.debilidades.length > resultado1.debilidades.length) {

        diferencias.push("El segundo correo presenta más debilidades.");

    }

    return {

        ganador,

        correo1: resultado1,

        correo2: resultado2,

        diferencias

    };

}

module.exports = compararCorreo;