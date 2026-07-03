// services/evaluacionService.js
const { pool } = require("../config/db");

// AJUSTA estos rangos según cómo definas Bajo/Medio/Alto en tu proyecto.
// Se compara contra el puntaje_total sumado de las 10 respuestas.
function calcularNivelRiesgo(puntajeTotal) {
    if (puntajeTotal <= 10) return "Alto";
    if (puntajeTotal <= 20) return "Medio";
    return "Bajo";
}

// Crea una evaluación completa: guarda las respuestas y calcula el resultado
// respuestas = [{ id_pregunta: 1, id_opcion: 3 }, ...]
async function crearEvaluacion(id_usuario, respuestas) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [evalResult] = await connection.query(
            "INSERT INTO evaluaciones (id_usuario) VALUES (?)",
            [id_usuario]
        );
        const id_evaluacion = evalResult.insertId;

        let puntajeTotal = 0;
        for (const r of respuestas) {
            const [opcionRows] = await connection.query(
                "SELECT puntaje FROM opciones WHERE id_opcion = ? AND id_pregunta = ?",
                [r.id_opcion, r.id_pregunta]
            );
            if (opcionRows.length === 0) {
                throw new Error(`Opción ${r.id_opcion} no válida para la pregunta ${r.id_pregunta}`);
            }
            puntajeTotal += opcionRows[0].puntaje;

            await connection.query(
                "INSERT INTO respuestas (id_evaluacion, id_pregunta, id_opcion) VALUES (?, ?, ?)",
                [id_evaluacion, r.id_pregunta, r.id_opcion]
            );
        }

        const nivel_riesgo = calcularNivelRiesgo(puntajeTotal);
        await connection.query(
            "INSERT INTO resultados (id_evaluacion, puntaje_total, nivel_riesgo) VALUES (?, ?, ?)",
            [id_evaluacion, puntajeTotal, nivel_riesgo]
        );

        await connection.commit();
        return { id_evaluacion, puntaje_total: puntajeTotal, nivel_riesgo };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Historial de evaluaciones de un usuario (para Estadisticas.html / PerfilRiesgo.html)
async function obtenerHistorialPorUsuario(id_usuario) {
    const [rows] = await pool.query(
        `SELECT e.id_evaluacion, e.fecha, r.puntaje_total, r.nivel_riesgo
         FROM evaluaciones e
         LEFT JOIN resultados r ON r.id_evaluacion = e.id_evaluacion
         WHERE e.id_usuario = ?
         ORDER BY e.fecha DESC`,
        [id_usuario]
    );
    return rows;
}

module.exports = { crearEvaluacion, obtenerHistorialPorUsuario };
