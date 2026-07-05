const express = require("express");
const router = express.Router();
const riesgoControladores = require("../controladores/riesgoControladores");

router.get("/cuestionario", riesgoControladores.obtenerCuestionario);
router.post("/evaluaciones", riesgoControladores.crearEvaluacion);
router.get("/evaluaciones/usuario/:id_usuario", riesgoControladores.historialPorUsuario);

module.exports = router;
