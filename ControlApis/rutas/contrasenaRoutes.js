const express = require("express");

const router = express.Router();


const {

    verificarContrasena,

    compararContrasenas,

    generarContrasena


} = require("../controladores/contrasenaControladores");



// Evaluar contraseña

router.post(
"/verificar",
verificarContrasena
);



// Comparar seguridad

router.post(
"/comparar",
compararContrasenas
);



// Generar contraseña

router.post(
"/generar",
generarContrasena
);



module.exports = router;