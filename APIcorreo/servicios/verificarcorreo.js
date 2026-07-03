function verificarCorreo(correo) {

    let puntaje = 100;

    const fortalezas = [];
    const debilidades = [];
    const recomendaciones = [];

    if (!correo || correo.trim() === "") {
        return {
            correo,
            puntaje: 0,
            nivel: "Inválido",
            fortalezas: [],
            debilidades: ["No se ingresó ningún correo."],
            recomendaciones: ["Escribe una dirección de correo."]
        };
    }

    correo = correo.toLowerCase().trim();

    // Validar formato
    const formato = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;

    if (!formato.test(correo)) {

        return {
            correo,
            puntaje: 0,
            nivel: "Inválido",
            fortalezas: [],
            debilidades: ["El formato del correo no es válido."],
            recomendaciones: ["Verifica que el correo tenga un formato correcto."]
        };

    }

    const partes = correo.split("@");

    const usuario = partes[0];

    const dominio = partes[1];

    // -------------------------
    // LONGITUD
    // -------------------------

    if (usuario.length >= 12) {

        fortalezas.push("Tiene una longitud adecuada.");

    } else {

        puntaje -= 15;

        debilidades.push("El nombre del correo es corto.");

        recomendaciones.push("Utiliza al menos 12 caracteres.");

    }

    // -------------------------
    // NÚMEROS
    // -------------------------

    if (/\d/.test(usuario)) {

        fortalezas.push("Contiene números.");

    } else {

        puntaje -= 10;

        debilidades.push("No contiene números.");

        recomendaciones.push("Agrega uno o más números.");

    }

    // -------------------------
    // PUNTO
    // -------------------------

    if (usuario.includes(".")) {

        fortalezas.push("Utiliza punto.");

    } else {

        puntaje -= 5;

        debilidades.push("No utiliza punto.");

        recomendaciones.push("Agregar un punto mejora la complejidad.");

    }

    // -------------------------
    // GUION BAJO
    // -------------------------

    if (usuario.includes("_")) {

        fortalezas.push("Utiliza guion bajo.");

    } else {

        puntaje -= 5;

        debilidades.push("No utiliza guion bajo.");

        recomendaciones.push("Puedes utilizar un guion bajo.");

    }

    // -------------------------
    // GUION
    // -------------------------

    if (usuario.includes("-")) {

        fortalezas.push("Utiliza guion.");

    }

    // -------------------------
    // MAYÚSCULAS
    // -------------------------

    if (/[A-Z]/.test(correo)) {

        fortalezas.push("Contiene letras mayúsculas.");

    }

    // -------------------------
    // DOMINIOS CONOCIDOS
    // -------------------------

    const dominios = [

        "gmail.com",

        "hotmail.com",

        "outlook.com",

        "live.com",

        "icloud.com",

        "yahoo.com"

    ];

    if (dominios.includes(dominio)) {

        fortalezas.push("Utiliza un proveedor de correo reconocido.");

    } else {

        puntaje -= 10;

        debilidades.push("El dominio es poco conocido.");

    }

    // -------------------------
    // NOMBRES COMUNES
    // -------------------------

    const nombres = [

        "juan",

        "pedro",

        "maria",

        "jorge",

        "jose",

        "luis",

        "carlos",

        "ana",

        "fernando",

        "miguel"

    ];

    for (let nombre of nombres) {

        if (usuario.includes(nombre)) {

            puntaje -= 15;

            debilidades.push("Contiene un nombre común.");

            recomendaciones.push("Evita utilizar tu nombre.");

            break;

        }

    }

    // -------------------------
    // AÑOS
    // -------------------------

    if (/(19|20)\d{2}/.test(usuario)) {

        puntaje -= 10;

        debilidades.push("Parece contener un año.");

        recomendaciones.push("Evita utilizar años de nacimiento.");

    }

    // -------------------------
    // MUCHOS CARACTERES REPETIDOS
    // -------------------------

    if (/(.)\1\1/.test(usuario)) {

        puntaje -= 10;

        debilidades.push("Tiene caracteres repetidos.");

        recomendaciones.push("Evita repetir varias veces el mismo carácter.");

    }

    // -------------------------
    // SOLO LETRAS
    // -------------------------

    if (/^[a-zA-Z]+$/.test(usuario)) {

        puntaje -= 10;

        debilidades.push("Solo contiene letras.");

        recomendaciones.push("Combina letras con números.");

    }

    // -------------------------
    // NOMBRE MUY SIMPLE
    // -------------------------

    if (usuario.length <= 5) {

        puntaje -= 15;

        debilidades.push("El identificador es demasiado corto.");

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

        nivel = "Muy inseguro";

    }

    else if (puntaje <= 40) {

        nivel = "Inseguro";

    }

    else if (puntaje <= 60) {

        nivel = "Regular";

    }

    else if (puntaje <= 80) {

        nivel = "Seguro";

    }

    else {

        nivel = "Excelente";

    }

    return {

        correo,

        puntaje,

        nivel,

        barra: puntaje,

        fortalezas,

        debilidades,

        recomendaciones

    };

}

module.exports = verificarCorreo;