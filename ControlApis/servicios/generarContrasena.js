function generarContrasena(longitud = 16) {

    if (!longitud || longitud < 8) {

        longitud = 8;

    }

    const mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const minusculas = "abcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";
    const simbolos = "!@#$%^&*()_-+=<>?";

    const todos = mayusculas + minusculas + numeros + simbolos;

    let contrasena = "";

    // Garantizar al menos un carácter de cada tipo
    contrasena += mayusculas[Math.floor(Math.random() * mayusculas.length)];
    contrasena += minusculas[Math.floor(Math.random() * minusculas.length)];
    contrasena += numeros[Math.floor(Math.random() * numeros.length)];
    contrasena += simbolos[Math.floor(Math.random() * simbolos.length)];

    // Completar el resto
    while (contrasena.length < longitud) {

        contrasena += todos[Math.floor(Math.random() * todos.length)];

    }

    // Mezclar caracteres
    contrasena = contrasena
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");

    return {

        contrasena,

        longitud,

        mensaje: "Contraseña generada correctamente."

    };

}

module.exports = generarContrasena;