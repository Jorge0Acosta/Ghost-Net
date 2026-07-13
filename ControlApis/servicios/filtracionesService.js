// ============================================
// Servicio: Filtraciones (brechas de seguridad)
// Fuente de datos: XposedOrNot (100% gratuita)
// Docs: https://xposedornot.com/api_doc
// ============================================

const XON_BASE = "https://api.xposedornot.com/v1";

// ============================================
// Helpers de mapeo
// ============================================

function mapSeveridad(passwordRisk) {
  switch ((passwordRisk || "").toLowerCase()) {
    case "plaintext":
    case "easytocrack":
      return "Alto";
    case "hardtocrack":
      return "Media";
    default:
      return "Baja";
  }
}

function mapRiesgo(label) {
  switch ((label || "").toLowerCase()) {
    case "high":
      return "ALTO";
    case "medium":
      return "MEDIO";
    case "low":
      return "BAJO";
    default:
      return "DESCONOCIDO";
  }
}

// ============================================
// Verificar correo contra la base de filtraciones
// ============================================

async function verificarFiltraciones(email) {
  const url = `${XON_BASE}/breach-analytics?email=${encodeURIComponent(email)}`;
  const response = await fetch(url);

  if (response.status === 429) {
    const error = new Error("Límite de la API gratuita alcanzado. Intenta en unos minutos.");
    error.status = 429;
    throw error;
  }

  if (!response.ok) {
    const error = new Error("Error al consultar la API de filtraciones");
    error.status = response.status;
    throw error;
  }

  const data = await response.json();

  // Sin filtraciones encontradas
  if (!data.ExposedBreaches) {
    return {
      email,
      found: false,
      totalFiltraciones: 0,
      totalRecordsExpuestos: 0,
      nivelRiesgo: "BAJO",
      ultimaFiltracion: null,
      filtraciones: [],
    };
  }

  const detalles = data.ExposedBreaches.breaches_details || [];
  const riskInfo = data.BreachMetrics?.risk?.[0];

  const filtraciones = detalles.map((f) => ({
    servicio: f.breach,
    dominio: f.domain,
    anio: f.xposed_date,
    registrosExpuestos: f.xposed_records,
    gravedad: mapSeveridad(f.password_risk),
    logo: f.logo,
    descripcion: f.details,
  }));

  const totalRecordsExpuestos = filtraciones.reduce((sum, f) => sum + (f.registrosExpuestos || 0), 0);
  const ultimaFiltracion = filtraciones.reduce((max, f) => Math.max(max, parseInt(f.anio) || 0), 0);

  return {
    email,
    found: true,
    totalFiltraciones: filtraciones.length,
    totalRecordsExpuestos,
    nivelRiesgo: mapRiesgo(riskInfo?.risk_label),
    ultimaFiltracion: ultimaFiltracion || null,
    filtraciones,
  };
}

module.exports = { verificarFiltraciones };
