const express = require("express");

const router = express.Router();

const correoController = require("../controladores/controlcorreo");
// Verificar correo
router.post("/verificar", correoController.verificarCorreo);

// Comparar correos
router.post("/comparar", correoController.compararCorreos);

// Generar correo seguro
router.post("/generar", correoController.generarCorreoSeguro);

module.exports = router;