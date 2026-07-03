// config/db.js
require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ghost_net",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Conexión a MySQL (ghost_net) exitosa");
        connection.release();
    } catch (error) {
        console.error("❌ Error al conectar con MySQL:", error.message);
    }
}

module.exports = { pool, testConnection };
