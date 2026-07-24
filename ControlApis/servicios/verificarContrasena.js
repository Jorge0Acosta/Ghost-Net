const contrasenasComunes = require("./contrasenasComunes");
const secuenciasComunes = require("./secuenciasComunes");

function verificarContrasena(contrasena) {

    let puntaje = 100;

    const fortalezas = [];
    const debilidades = [];
    const recomendaciones = [];

    // -------------------------
    // CONTRASEÑA VACÍA
    // -------------------------

    if (!contrasena || contrasena.trim() === "") {

        return {
            contrasena,
            puntaje: 0,
            nivel: "Inválida",
            fortalezas: [],
            debilidades: ["No se ingresó ninguna contraseña."],
            recomendaciones: ["Escribe una contraseña."]
        };

    }

    // -------------------------
    // LONGITUD
    // -------------------------

    if (contrasena.length >= 12) {

        fortalezas.push("Tiene una longitud adecuada.");

    } else {

        puntaje -= 20;

        debilidades.push("La contraseña es demasiado corta.");

        recomendaciones.push("Utiliza al menos 12 caracteres.");

    }

    // -------------------------
    // MAYÚSCULAS
    // -------------------------

    if (/[A-Z]/.test(contrasena)) {

        fortalezas.push("Contiene letras mayúsculas.");

    } else {

        puntaje -= 15;

        debilidades.push("No contiene letras mayúsculas.");

        recomendaciones.push("Agrega al menos una letra mayúscula.");

    }

    // -------------------------
    // MINÚSCULAS
    // -------------------------

    if (/[a-z]/.test(contrasena)) {

        fortalezas.push("Contiene letras minúsculas.");

    } else {

        puntaje -= 15;

        debilidades.push("No contiene letras minúsculas.");

        recomendaciones.push("Agrega al menos una letra minúscula.");

    }

    // -------------------------
    // NÚMEROS
    // -------------------------

    if (/\d/.test(contrasena)) {

        fortalezas.push("Contiene números.");

    } else {

        puntaje -= 15;

        debilidades.push("No contiene números.");

        recomendaciones.push("Agrega al menos un número.");

    }

    // -------------------------
    // CARACTERES ESPECIALES
    // -------------------------

    if (/[^A-Za-z0-9]/.test(contrasena)) {

        fortalezas.push("Contiene caracteres especiales.");

    } else {

        puntaje -= 15;

        debilidades.push("No contiene caracteres especiales.");

        recomendaciones.push("Agrega al menos un carácter especial.");

    }

    // -------------------------
    // CONTRASEÑAS COMUNES
    // -------------------------

    if (contrasenasComunes.includes(contrasena.toLowerCase())) {

        puntaje -= 40;

        debilidades.push("Es una contraseña muy común.");

        recomendaciones.push("Utiliza una contraseña única y difícil de adivinar.");

    } else {

        fortalezas.push("No pertenece a la lista de contraseñas comunes.");

    }

    // -------------------------
    // SECUENCIAS COMUNES
    // -------------------------

   for (let secuencia of secuenciasComunes) {

        if (contrasena.toLowerCase().includes(secuencia)) {

            puntaje -= 20;

            debilidades.push("Contiene una secuencia fácil de adivinar.");

            recomendaciones.push("Evita secuencias consecutivas como 1234, abcd o qwerty.");

            break;

        }
    }

    // -------------------------
    // CARACTERES REPETIDOS
    // -------------------------

    if (/(.)\1\1/.test(contrasena)) {

        puntaje -= 15;

        debilidades.push("Tiene caracteres repetidos.");

        recomendaciones.push("Evita repetir varias veces el mismo carácter.");

    }

    // -------------------------
    // SOLO LETRAS
    // -------------------------

    if (/^[A-Za-z]+$/.test(contrasena)) {

        puntaje -= 20;

        debilidades.push("Solo contiene letras.");

        recomendaciones.push("Combina letras con números y símbolos.");

    }

    // -------------------------
    // SOLO NÚMEROS
    // -------------------------

    if (/^\d+$/.test(contrasena)) {

        puntaje -= 20;

        debilidades.push("Solo contiene números.");

        recomendaciones.push("Combina números con letras y símbolos.");

    }

    // -------------------------
    // ESPACIOS
    // -------------------------

    if (/\s/.test(contrasena)) {

        puntaje -= 10;

        debilidades.push("Contiene espacios.");

        recomendaciones.push("Evita utilizar espacios en la contraseña.");

    }

    // -------------------------
    // LONGITUD EXCELENTE
    // -------------------------

    if (contrasena.length >= 16) {

        fortalezas.push("Tiene una longitud excelente.");

    }

    // -------------------------
    // LÍMITES
    // -------------------------

    if (puntaje < 0) {

        puntaje = 0;

    }

    if (puntaje > 100) {

        puntaje = 100;

    }

    // -------------------------
    // NIVEL
    // -------------------------

    let nivel = "";

    if (puntaje <= 20) {

        nivel = "Muy insegura";

    }

    else if (puntaje <= 40) {

        nivel = "Insegura";

    }

    else if (puntaje <= 60) {

        nivel = "Regular";

    }

    else if (puntaje <= 80) {

        nivel = "Segura";

    }

    else {

        nivel = "Excelente";

    }

    return {

        contrasena,

        puntaje,

        nivel,

        barra: puntaje,

        fortalezas,

        debilidades,

        recomendaciones

    };

}

module.exports = verificarContrasena;