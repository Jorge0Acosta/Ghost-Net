const verificarContrasena = require("../servicios/verificarContrasena");
const compararContrasenas = require("../servicios/compararContrasenas");
const generarContrasena = require("../servicios/generarContrasena");

// =================================================
// VERIFICAR CONTRASEÑA
// =================================================
exports.verificarContrasena = (req, res) => {
    try {
        const { contrasena } = req.body;

        const resultado = verificarContrasena(contrasena);

        res.json({
            ok: true,
            resultado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: error.message
        });
    }
};

// =================================================
// COMPARAR CONTRASEÑAS (CORREGIDO)
// =================================================
exports.compararContrasenas = (req, res) => {
    try {
        const { contrasena1, contrasena2 } = req.body;

        // Obtenemos el objeto que ya viene armado desde el servicio
        const respuestaServicio = compararContrasenas(contrasena1, contrasena2);

        // Si el servicio detecta un fallo (ej. campos vacíos) devolvemos error 400
        if (!respuestaServicio.ok) {
            return res.status(400).json(respuestaServicio);
        }

        // CORRECCIÓN: Enviamos directamente el objeto para evitar la doble envoltura
        res.json(respuestaServicio);
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: error.message
        });
    }
};

// =================================================
// GENERAR CONTRASEÑA
// =================================================
exports.generarContrasena = (req, res) => {
    try {
        const { longitud } = req.body;

        const resultado = generarContrasena(longitud);

        res.json({
            ok: true,
            resultado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: error.message
        });
    }
};