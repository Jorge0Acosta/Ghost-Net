// ============================================
// Rutas: Filtraciones (brechas de seguridad)
// Montado en servidor.js como:
//   app.use("/api/filtraciones", filtracionesRouter);
// ============================================

const express = require("express");
const router = express.Router();

const { verificarFiltracionesController } = require("../controladores/filtracionesControlador");

// GET /api/filtraciones/verificar?email=correo@ejemplo.com
router.get("/verificar", verificarFiltracionesController);

module.exports = router;
