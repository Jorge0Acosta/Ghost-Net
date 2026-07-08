// routers/contrasenaRouter.js
const express = require("express");
const router = express.Router();
const contrasenaControladores = require("../controladores/contrasenaControladores");

// Evaluar fortaleza de una contraseña (tu endpoint original, sin cambios de comportamiento)
router.post("/evaluar", contrasenaControladores.evaluarPassword);

module.exports = router;