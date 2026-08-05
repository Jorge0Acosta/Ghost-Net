const { pool } = require("../configuracion/db");

async function obtenerEstadisticasBD() {

    // CONTRASEÑAS
    const [contrasenas] = await pool.query(`
        SELECT resultado, COUNT(*) cantidad
        FROM verificaciones_contrasenas
        GROUP BY resultado
    `);

    const [totalContrasenas] = await pool.query(`
        SELECT COUNT(*) total
        FROM verificaciones_contrasenas
    `);

    // CORREOS
    const [correos] = await pool.query(`
        SELECT resultado, COUNT(*) cantidad
        FROM verificaciones_correos
        GROUP BY resultado
    `);

    const [totalCorreos] = await pool.query(`
        SELECT COUNT(*) total
        FROM verificaciones_correos
    `);

    return {

        contrasenas: {

            total: totalContrasenas[0].total,

            resultados: contrasenas

        },

        correos: {

            total: totalCorreos[0].total,

            resultados: correos

        }

    };

}

module.exports = {

    obtenerEstadisticasBD

};