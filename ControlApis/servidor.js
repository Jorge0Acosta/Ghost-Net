require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { testConnection } = require("./configuracion/db");
const app = express();

const {
    actualizarCache
} = require("./controladores/ControladorEstadisticas");

// Cargar cache al iniciar el servidor
actualizarCache();

// Actualizar automáticamente cada hora
setInterval(actualizarCache, 60 * 60 * 1000);


// Configuración de CORS
const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://ghost-net-cwz5.onrender.com" // Tu Frontend en Render
];

app.use(cors({
    origin: function (origin, callback) {
        // Permite peticiones sin origen (como llamadas desde herramientas tipo Postman)
        // o si el origen está en la lista permitida
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Bloqueado por la política de CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Middleware

app.use(express.json());

// Importar rutas

const correoRoutes = require("./rutas/correoRoutes");
const passwordRoutes = require("./rutas/contrasenaRoutes");
const usuarioRoutes = require("./rutas/usuarioRouter");
const riesgoRoutes = require("./rutas/riesgoRouter");
const estadisticasRoutes = require("./rutas/rutaEstadistica");
const filtracionesRoutes = require("./rutas/filtracionesRouter");

// Rutas de la API
app.use("/api/contrasena", passwordRoutes);
app.use("/api/correo", correoRoutes);
app.use("/api", usuarioRoutes);
app.use("/api", riesgoRoutes);
app.use("/api/estadisticas", estadisticasRoutes);
app.use("/api/filtraciones", filtracionesRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor Ghost-Net iniciado en http://localhost:${PORT}`);
    await testConnection();
});