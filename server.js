const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Configuración de CORS para desarrollo local (acepta cualquier origen)
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware para entender formato JSON que algien me diga que va antes xdxdxd
app.use(express.json());

// Servir archivos estáticos desde la raíz del proyecto para evitar origin file://
app.use(express.static(path.join(__dirname, "..")));

// Servir la carpeta HTML directamente en /HTML
app.use("/HTML", express.static(path.join(__dirname, "..", "HTML")));

// Redirigir la raíz a la página principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "HTML", "index.html"));
});

// Ruta alternativa para el archivo con ñ en el nombre
app.get("/HTML/EvaluacionContrasena.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "HTML", "EvaluacionContraseña.html"));
});

//Importación y uso de rutas con prefijo 
const passwordRoutes = require("./routers/contrasenaRouter");
app.use("/api", passwordRoutes);

// 4. Encendido del servidor
app.listen(3000, () => {
    console.log("Servidor iniciado en http://localhost:3000");
});