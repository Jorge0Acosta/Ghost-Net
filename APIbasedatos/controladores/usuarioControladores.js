const usuarioService = require("../services/usuarioService");

async function registrar(req, res) {
    try {
        const { nombre, correo, password } = req.body;
        if (!nombre || !correo || !password) {
            return res.status(400).json({ mensaje: "nombre, correo y password son obligatorios" });
        }
        const usuario = await usuarioService.registrarUsuario(nombre, correo, password);
        res.status(201).json(usuario);
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ mensaje: "Ese correo ya está registrado" });
        }
        res.status(500).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const { correo, password } = req.body;
        if (!correo || !password) {
            return res.status(400).json({ mensaje: "correo y password son obligatorios" });
        }

        const usuario = await usuarioService.validarCredenciales(correo, password);
        if (!usuario) {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
        }

        await usuarioService.registrarInicioSesion(
            usuario.id_usuario,
            req.ip,
            req.headers["user-agent"] || "desconocido"
        );

        res.json({
            mensaje: "Login exitoso",
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { registrar, login };
