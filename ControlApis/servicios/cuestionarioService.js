const { pool } = require("../configuracion/db");

async function obtenerCuestionario() {
    const [preguntas] = await pool.query("SELECT * FROM preguntas");
    const [opciones] = await pool.query("SELECT * FROM opciones");

    return preguntas.map((p) => ({
        ...p,
        opciones: opciones.filter((o) => o.id_pregunta === p.id_pregunta)
    }));
}

module.exports = { obtenerCuestionario };
