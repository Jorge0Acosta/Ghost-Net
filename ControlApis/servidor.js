require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { testConnection } = require("./configuracion/db");

const app = express();

// ==============================
// Configuración de CORS
// ==============================

app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ==============================
// Middleware
// ==============================

app.use(express.json());

// ==============================
// Importar rutas
// ==============================

const correoRoutes = require("./rutas/correoRoutes");
const passwordRoutes = require("./rutas/contrasenaRouter");
const usuarioRoutes = require("./rutas/usuarioRouter");
const riesgoRoutes = require("./rutas/riesgoRouter");
const filtracionesRoutes = require("./rutas/filtracionesRouter");



// ==============================
// Rutas de la API
// ==============================

app.use("/api/correo", correoRoutes);
app.use("/api/contrasena", passwordRoutes);
app.use("/api", usuarioRoutes);
app.use("/api", riesgoRoutes);
app.use("/api/filtraciones", filtracionesRoutes);

// ==============================
// Puerto del servidor
// ==============================

const PORT = process.env.PORT || 3000;

// ==============================
// Iniciar servidor
// ==============================

app.listen(PORT, async () => {
    console.log(`🚀 Servidor Ghost-Net iniciado en http://localhost:${PORT}`);
    await testConnection();
});