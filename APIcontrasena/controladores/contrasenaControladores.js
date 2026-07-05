// controladores/contrasenaControladores.js
const { analizarPassword } = require("../services/passwordService");

// POST /api/evaluar -> evalúa la fortaleza de una contraseña (no toca ninguna BD)
function evaluarPassword(req, res) {
    const { password } = req.body;
    const resultado = analizarPassword(password);
    res.json(resultado);
}

module.exports = { evaluarPassword };