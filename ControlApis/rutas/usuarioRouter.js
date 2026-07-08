const express = require("express");
const router = express.Router();
const usuarioControladores = require("../controladores/usuarioControladores");

router.post("/registro", usuarioControladores.registrar);
router.post("/login", usuarioControladores.login);

module.exports = router;
