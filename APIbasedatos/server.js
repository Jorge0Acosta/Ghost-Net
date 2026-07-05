require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { testConnection } = require("./config/db");

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const usuarioRoutes = require("./routers/usuarioRouter");
app.use("/api", usuarioRoutes);

const riesgoRoutes = require("./routers/riesgoRouter");
app.use("/api", riesgoRoutes);

const PORT = 3002;
app.listen(PORT, async () => {
    console.log(`🗄️  API Base de Datos iniciada en http://localhost:${PORT}`);
    await testConnection();
});
