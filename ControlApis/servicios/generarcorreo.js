const verificarCorreo = require("../../ControlApis/servicios/verificarcorreo");

function generarCorreo(nombre, dominio) {

    if (!nombre || nombre.trim() === "") {

        return {

            correoGenerado: "",

            puntaje: 0,

            nivel: "Inválido",

            mensaje: "Debes escribir un nombre."

        };

    }

    nombre = nombre
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "");

    dominio = dominio || "gmail.com";

    const caracteres = "abcdefghijklmnopqrstuvwxyz";

    let mejorCorreo = "";
    let mejorResultado = null;

    for (let i = 0; i < 20; i++) {

        const letra1 = caracteres[Math.floor(Math.random() * caracteres.length)];
        const letra2 = caracteres[Math.floor(Math.random() * caracteres.length)];

        const numero1 = Math.floor(Math.random() * 900 + 100);

        const numero2 = Math.floor(Math.random() * 90 + 10);

        const opciones = [

            `${letra1}.${nombre}_${numero1}${numero2}@${dominio}`,

            `${nombre}_${numero1}.${letra2}${numero2}@${dominio}`,

            `${letra1}${numero2}_${nombre}.${numero1}@${dominio}`,

            `${nombre}.${letra1}_${numero2}${letra2}${numero1}@${dominio}`

        ];

        for (const correo of opciones) {

            const resultado = verificarCorreo(correo);

            if (
                !mejorResultado ||
                resultado.puntaje > mejorResultado.puntaje
            ) {

                mejorResultado = resultado;
                mejorCorreo = correo;

            }

        }

    }

    return {

        correoGenerado: mejorCorreo,

        puntaje: mejorResultado.puntaje,

        nivel: mejorResultado.nivel,

        fortalezas: mejorResultado.fortalezas,

        debilidades: mejorResultado.debilidades,

        recomendaciones: mejorResultado.recomendaciones

    };

}

module.exports = generarCorreo;