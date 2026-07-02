const express = require("express");
const router = express.Router();

// Importar el servicio encargado de la lógica de evaluación
const { analizarPassword } = require("../services/passwordService");

// Endpoint POST que procesa la contraseña
router.post("/evaluar", (req, res) => {
    const { password } = req.body;

    const resultado = analizarPassword(password);

    res.json(resultado);
});

module.exports = router;