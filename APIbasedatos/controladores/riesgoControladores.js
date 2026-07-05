const cuestionarioService = require("../services/cuestionarioService");
const evaluacionService = require("../services/evaluacionService");

async function obtenerCuestionario(req, res) {
    try {
        const preguntas = await cuestionarioService.obtenerCuestionario();
        res.json(preguntas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

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

async function historialPorUsuario(req, res) {
    try {
        const historial = await evaluacionService.obtenerHistorialPorUsuario(req.params.id_usuario);
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { obtenerCuestionario, crearEvaluacion, historialPorUsuario };
