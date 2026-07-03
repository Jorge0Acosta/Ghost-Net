const express = require("express");
const cors = require("cors");

const app = express();

// Configuración de CORS
app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware para interpretar JSON
app.use(express.json());

// Importar rutas
const correoRoutes = require("./router/correoRoutes");

// Usar rutas
app.use("/api/correo", correoRoutes);

// Puerto del servidor
const PORT = 3001;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});