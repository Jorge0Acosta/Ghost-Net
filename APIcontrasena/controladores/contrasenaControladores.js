// controladores/contrasenaControladores.js
const { analizarPassword } = require("../services/passwordService");
const cuestionarioService = require("../services/cuestionarioService");
const evaluacionService = require("../services/evaluacionService");

// POST /api/evaluar -> evalúa la fortaleza de una contraseña (no toca la BD)
function evaluarPassword(req, res) {
    const { password } = req.body;
    const resultado = analizarPassword(password);
    res.json(resultado);
}

// GET /api/cuestionario -> preguntas del perfil de riesgo con sus opciones
async function obtenerCuestionario(req, res) {
    try {
        const preguntas = await cuestionarioService.obtenerCuestionario();
        res.json(preguntas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// POST /api/evaluaciones -> guarda las respuestas del cuestionario y calcula el resultado
// body: { id_usuario: 1, respuestas: [{ id_pregunta: 1, id_opcion: 3 }, ...] }
async function crearEvaluacion(req, res) {
    try {
        const { id_usuario, respuestas } = req.body;
        if (!id_usuario || !Array.isArray(respuestas) || respuestas.length === 0) {
            return res.status(400).json({ mensaje: "id_usuario y respuestas (array) son obligatorios" });
        }
        const resultado = await evaluacionService.crearEvaluacion(id_usuario, respuestas);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// GET /api/evaluaciones/usuario/:id_usuario -> historial para Estadisticas/PerfilRiesgo
async function historialPorUsuario(req, res) {
    try {
        const historial = await evaluacionService.obtenerHistorialPorUsuario(req.params.id_usuario);
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { evaluarPassword, obtenerCuestionario, crearEvaluacion, historialPorUsuario };
