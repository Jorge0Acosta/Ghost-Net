const express = require("express");

const router = express.Router();

const {
    obtenerEstadisticas
} = require("../controladores/ControladorEstadisticas");

router.get("/", obtenerEstadisticas);

module.exports = router;