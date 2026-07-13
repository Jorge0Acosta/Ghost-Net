// ============================================
// Controlador: Filtraciones (brechas de seguridad)
// ============================================

const { verificarFiltraciones } = require("../servicios/filtracionesService");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================
// GET /api/filtraciones/verificar?email=...
// ============================================

async function verificarFiltracionesController(req, res) {
  const { email } = req.query;

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "Correo inválido" });
  }

  try {
    const resultado = await verificarFiltraciones(email);
    return res.json(resultado);
  } catch (err) {
    console.error(`❌ Error verificando filtraciones: ${err.message}`);
    return res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { verificarFiltracionesController };
