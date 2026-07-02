const express = require("express");
const cors = require("cors");

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

// 4. Encendido del servidor
app.listen(3000, () => {
    console.log("Servidor iniciado en http://localhost:3000");
});