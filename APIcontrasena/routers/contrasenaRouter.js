// routers/contrasenaRouter.js
const express = require("express");
const router = express.Router();
const contrasenaControladores = require("../controladores/contrasenaControladores");

// Evaluar fortaleza de una contraseña (tu endpoint original, sin cambios de comportamiento)
router.post("/evaluar", contrasenaControladores.evaluarPassword);

// Cuestionario de perfil de riesgo
router.get("/cuestionario", contrasenaControladores.obtenerCuestionario);

// Crear una evaluación de perfil de riesgo (guarda respuestas + calcula resultado)
router.post("/evaluaciones", contrasenaControladores.crearEvaluacion);

// Historial de evaluaciones de un usuario
router.get("/evaluaciones/usuario/:id_usuario", contrasenaControladores.historialPorUsuario);

module.exports = router;
