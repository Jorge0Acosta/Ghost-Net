require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { testConnection } = require("./config/db");

const app = express();

// Configuración de CORS habilitando tu origen de Live Server
app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware para entender formato JSON que algien me diga que va antes xdxdxd
app.use(express.json());

//Importación y uso de rutas con prefijo
const passwordRoutes = require("./routers/contrasenaRouter");
app.use("/api", passwordRoutes);

const usuarioRoutes = require("./routers/usuarioRouter");
app.use("/api", usuarioRoutes);

// Encendido del servidor
app.listen(3000, async () => {
    console.log("Servidor iniciado en http://localhost:3000");
    await testConnection();
});
