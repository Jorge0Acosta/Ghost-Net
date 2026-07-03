const verificarCorreo = require("../servicios/verificarcorreo");
const compararCorreo = require("../servicios/compararcorreos");
const generarCorreo = require("../servicios/generarcorreo");

// =========================
// VERIFICAR CORREO
// =========================
exports.verificarCorreo = (req, res) => {
    try {
        const { correo } = req.body;

        const resultado = verificarCorreo(correo);

        res.json({
            ok: true,
            resultado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error al verificar correo",
            error: error.message
        });
    }
};

// =========================
// COMPARAR CORREOS
// =========================
exports.compararCorreos = (req, res) => {
    try {
        const { correo1, correo2 } = req.body;

        const resultado = compararCorreo(correo1, correo2);

        res.json({
            ok: true,
            resultado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error al comparar correos",
            error: error.message
        });
    }
};

// =========================
// GENERAR CORREO
// =========================
exports.generarCorreoSeguro = (req, res) => {
    try {
        const { nombre, dominio } = req.body;

        const resultado = generarCorreo(nombre, dominio);

        res.json({
            ok: true,
            resultado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: "Error al generar correo",
            error: error.message
        });
    }
};