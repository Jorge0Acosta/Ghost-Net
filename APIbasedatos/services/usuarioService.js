const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");

async function registrarUsuario(nombre, correo, password) {
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
        "INSERT INTO usuarios (nombre, correo, password_hash) VALUES (?, ?, ?)",
        [nombre, correo, password_hash]
    );
    return { id_usuario: result.insertId, nombre, correo };
}

async function validarCredenciales(correo, password) {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);
    if (rows.length === 0) return null;

    const usuario = rows[0];
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) return null;

    return usuario;
}

async function registrarInicioSesion(id_usuario, ip, dispositivo) {
    await pool.query(
        "INSERT INTO inicios_sesion (id_usuario, direccion_ip, dispositivo) VALUES (?, ?, ?)",
        [id_usuario, ip, dispositivo]
    );
}

module.exports = { registrarUsuario, validarCredenciales, registrarInicioSesion };
