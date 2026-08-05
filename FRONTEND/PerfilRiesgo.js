/* ===================================================
   PERFILRIESGO.JS — Perfil de Riesgo Digital
   Ghost Internet / Ghost-Net
   =================================================== */

/* ===== PREGUNTAS ===== */

const PREGUNTAS = [
  { id: "2fa",        texto: "¿Usas autenticación de dos factores (2FA) en tus cuentas importantes?",     opciones: ["Siempre", "A veces", "Rara vez", "Nunca"],                                          pesos: [20, 12, 5, 0]  },
  { id: "pwdreuse",   texto: "¿Reutilizas la misma contraseña en múltiples servicios?",                   opciones: ["Nunca", "Rara vez", "A veces", "Siempre"],                                          pesos: [20, 12, 5, 0]  },
  { id: "pwdmanager", texto: "¿Utilizas un gestor de contraseñas?",                                       opciones: ["Sí, siempre", "Ocasionalmente", "No, pero quiero", "No y no pienso usarlo"],        pesos: [15, 8, 4, 0]   },
  { id: "phishing",   texto: "¿Verificas el remitente y los enlaces antes de hacer clic en correos?",     opciones: ["Siempre", "Generalmente", "A veces", "Raramente"],                                  pesos: [15, 10, 4, 0]  },
  { id: "updates",    texto: "¿Mantienes actualizado tu sistema operativo y aplicaciones?",                opciones: ["Siempre (automático)", "Manualmente y frecuente", "Solo a veces", "Nunca"],         pesos: [10, 7, 3, 0]   },
  { id: "publicwifi", texto: "¿Usas VPN cuando te conectas a redes WiFi públicas?",                       opciones: ["Siempre", "A veces", "Raramente", "Nunca uso VPN"],                                  pesos: [10, 6, 2, 0]   },
  { id: "backup",     texto: "¿Realizas copias de seguridad de tus datos importantes?",                   opciones: ["Regularmente (automático)", "Ocasionalmente", "Rara vez", "Nunca"],                  pesos: [10, 6, 2, 0]   },
  { id: "pwdlength",  texto: "¿Cuál es la longitud promedio de tus contraseñas?",                         opciones: ["16+ caracteres", "12-15 caracteres", "8-11 caracteres", "Menos de 8"],              pesos: [10, 7, 3, 0]   },
  { id: "social",     texto: "¿Cuánta información personal compartes en redes sociales?",                 opciones: ["Muy poca (cuenta privada)", "Moderada", "Bastante", "Todo público"],                 pesos: [10, 6, 2, 0]   },
  { id: "breachcheck",texto: "¿Revisas periódicamente si tus datos han sido filtrados?",                  opciones: ["Sí, regularmente", "Lo he hecho alguna vez", "Nunca lo he hecho", "No sé cómo hacerlo"], pesos: [10, 5, 0, 0] },
];

const MAX_PUNTAJE = PREGUNTAS.reduce((s, p) => s + p.pesos[0], 0); /* 130 */

/* ===== RECOMENDACIONES ===== */

const MAPA_REC = {
  "2fa":        { umbral: 1, prioridad: "alta",  icono: "🔐", titulo: "Activa el doble factor (2FA)",              detalle: "El 2FA bloquea el 99.9% de los ataques automáticos incluso si tu contraseña es robada. Úsalo en email, banco y redes sociales. Apps recomendadas: Google Authenticator, Authy." },
  "pwdreuse":   { umbral: 1, prioridad: "alta",  icono: "🔁", titulo: "Deja de reutilizar contraseñas",            detalle: "Cuando un servicio filtra datos, todas las cuentas con la misma contraseña quedan expuestas. Cada cuenta debe tener una clave única y diferente." },
  "pwdmanager": { umbral: 2, prioridad: "alta",  icono: "🗄", titulo: "Adopta un gestor de contraseñas",           detalle: "Un gestor genera y recuerda claves únicas por ti. No necesitas memorizar nada. Opciones gratuitas: Bitwarden. De pago: 1Password, Dashlane." },
  "phishing":   { umbral: 1, prioridad: "alta",  icono: "📧", titulo: "Verifica siempre el remitente y los links",  detalle: "El 91% de los ciberataques comienza con un correo de phishing. Antes de hacer clic revisa: el dominio real del remitente, la URL pasando el cursor encima, y si el mensaje crea urgencia artificial." },
  "updates":    { umbral: 2, prioridad: "media", icono: "🔄", titulo: "Activa actualizaciones automáticas",         detalle: "El 60% de las brechas explotan vulnerabilidades con parche disponible. Activa actualizaciones automáticas en Windows/macOS y en todas tus apps. No las postergues." },
  "publicwifi": { umbral: 1, prioridad: "media", icono: "📡", titulo: "Usa VPN en redes públicas",                  detalle: "En redes WiFi de cafeterías, aeropuertos u hoteles cualquiera puede interceptar tu tráfico. Usa una VPN o evita acceder a cuentas sensibles (banco, email) sin ella." },
  "backup":     { umbral: 2, prioridad: "media", icono: "💾", titulo: "Crea copias de seguridad regulares",         detalle: "El ransomware cifra tus archivos y pide rescate. Con un backup reciente puedes recuperarte sin pagar. Regla 3-2-1: 3 copias, en 2 soportes distintos, 1 fuera del sitio (nube)." },
  "pwdlength":  { umbral: 2, prioridad: "media", icono: "🔑", titulo: "Usa contraseñas de 16+ caracteres",          detalle: "Una contraseña de 8 caracteres se rompe en minutos con hardware moderno. Una de 16+ caracteres puede tardar siglos. Usa frases largas o combinaciones generadas por un gestor." },
  "social":     { umbral: 2, prioridad: "baja",  icono: "👁", titulo: "Reduce tu exposición en redes sociales",    detalle: "Publicar tu fecha de nacimiento, ciudad, lugar de trabajo o vacaciones facilita ataques de ingeniería social. Configura tus perfiles como privados y comparte selectivamente." },
  "breachcheck":{ umbral: 2, prioridad: "baja",  icono: "🔍", titulo: "Comprueba si tus datos han sido filtrados",  detalle: "Visita haveibeenpwned.com y escribe tu email. Si apareces en alguna filtración, cambia la contraseña de ese servicio inmediatamente y activa 2FA." },
};

const COLOR_PRIORIDAD = { alta: "#ff3860", media: "#ffb800", baja: "#00c9ff" };

const ETIQUETAS_AREA = {
  "2fa": "Doble factor", "pwdreuse": "Reutilización", "pwdmanager": "Gestor de claves",
  "phishing": "Phishing", "updates": "Actualizaciones", "publicwifi": "WiFi pública",
  "backup": "Backups", "pwdlength": "Longitud clave", "social": "Exposición social", "breachcheck": "Control brechas",
};

/* ===== ESTADO ===== */

let RESPUESTAS = {};
let PREGUNTA_ACTUAL = 0;

/* ===== REFS DOM ===== */

const $ = id => document.getElementById(id);

const ETIQUETA_PREGUNTA     = $("etiqueta-pregunta");
const ETIQUETA_RESPONDIDAS  = $("etiqueta-respondidas");
const PROGRESO_RELLENO      = $("progreso-relleno");
const NUMERO_PREGUNTA       = $("numero-pregunta");
const TEXTO_PREGUNTA        = $("texto-pregunta");
const OPCIONES_CONTENEDOR   = $("opciones-contenedor");
const BTN_ANTERIOR          = $("btn-anterior");
const BTN_SIGUIENTE         = $("btn-siguiente");
const MAPA_PREGUNTAS        = $("mapa-preguntas");
const BTN_VER_RESULTADO     = $("btn-ver-resultado");
const SECCION_CUESTIONARIO  = $("seccion-cuestionario");
const SECCION_RESULTADOS    = $("seccion-resultados");

/* ===== RENDER CUESTIONARIO ===== */

function renderPregunta() {
  const p         = PREGUNTAS[PREGUNTA_ACTUAL];
  const respondidas = Object.keys(RESPUESTAS).length;

  ETIQUETA_PREGUNTA.textContent = `Pregunta ${PREGUNTA_ACTUAL + 1} de ${PREGUNTAS.length}`;
  ETIQUETA_RESPONDIDAS.textContent = `${respondidas} respondidas`;
  PROGRESO_RELLENO.style.width = `${(respondidas / PREGUNTAS.length) * 100}%`;
  NUMERO_PREGUNTA.textContent = `// PREGUNTA ${PREGUNTA_ACTUAL + 1}`;
  TEXTO_PREGUNTA.textContent = p.texto;

  OPCIONES_CONTENEDOR.innerHTML = "";
  p.opciones.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "opcion-boton" + (RESPUESTAS[p.id] === i ? " opcion-boton--seleccionada" : "");
    btn.innerHTML = `<span class="opcion-letra">${String.fromCharCode(65 + i)}.</span>${opt}`;
    btn.addEventListener("click", () => seleccionarRespuesta(i));
    OPCIONES_CONTENEDOR.appendChild(btn);
  });

  BTN_ANTERIOR.disabled  = PREGUNTA_ACTUAL === 0;
  BTN_SIGUIENTE.disabled = PREGUNTA_ACTUAL === PREGUNTAS.length - 1;

  BTN_VER_RESULTADO.disabled = respondidas < PREGUNTAS.length;

  renderMapa();
}

function renderMapa() {
  MAPA_PREGUNTAS.innerHTML = "";
  PREGUNTAS.forEach((p, i) => {
    const celda = document.createElement("button");
    let clase = "mapa-celda";
    if (i === PREGUNTA_ACTUAL) clase += " mapa-celda--activa";
    else if (RESPUESTAS[p.id] !== undefined) clase += " mapa-celda--respondida";
    celda.className = clase;
    celda.textContent = i + 1;
    celda.addEventListener("click", () => { PREGUNTA_ACTUAL = i; renderPregunta(); });
    MAPA_PREGUNTAS.appendChild(celda);
  });
}

function seleccionarRespuesta(idx) {
  const p = PREGUNTAS[PREGUNTA_ACTUAL];
  RESPUESTAS[p.id] = idx;
  if (PREGUNTA_ACTUAL < PREGUNTAS.length - 1) {
    setTimeout(() => { PREGUNTA_ACTUAL++; renderPregunta(); }, 240);
  } else {
    renderPregunta();
  }
}

BTN_ANTERIOR.addEventListener("click", () => { if (PREGUNTA_ACTUAL > 0) { PREGUNTA_ACTUAL--; renderPregunta(); } });
BTN_SIGUIENTE.addEventListener("click", () => { if (PREGUNTA_ACTUAL < PREGUNTAS.length - 1) { PREGUNTA_ACTUAL++; renderPregunta(); } });
BTN_VER_RESULTADO.addEventListener("click", mostrarResultados);

/* ===== CALCULAR PUNTAJE ===== */

function calcularPuntaje() {
  const bruto = PREGUNTAS.reduce((s, p) => s + (p.pesos[RESPUESTAS[p.id] ?? 0] ?? 0), 0);
  return Math.round((bruto / MAX_PUNTAJE) * 100);
}

function obtenerRecomendaciones() {
  const ordenPrioridad = { alta: 0, media: 1, baja: 2 };
  return PREGUNTAS
    .filter(p => {
      const rec = MAPA_REC[p.id];
      return rec && (RESPUESTAS[p.id] ?? 99) >= rec.umbral;
    })
    .map(p => ({ ...MAPA_REC[p.id], id: p.id }))
    .sort((a, b) => ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad]);
}

/* ===== MOSTRAR RESULTADOS ===== */

function mostrarResultados() {
  const puntaje = calcularPuntaje();
  const recs    = obtenerRecomendaciones();

  const nivel      = puntaje >= 75 ? "Bajo"  : puntaje >= 50 ? "Medio" : "Alto";
  const colorRiego = puntaje >= 75 ? "#00ff88" : puntaje >= 50 ? "#ffb800" : "#ff3860";
  const iconoRiesgo = puntaje >= 75 ? "✔" : "⚠";

  /* Hero */
  const heroEl = $("hero-score");
  heroEl.style.background = `#0a1628`;
  heroEl.style.border = `1px solid ${colorRiego}35`;

  $("valor-score").textContent = puntaje;
  $("valor-score").style.color = colorRiego;
  $("valor-score").style.textShadow = `0 0 40px ${colorRiego}55`;
  $("hero-score").querySelector(".hero-score__de-cien").style.color = colorRiego;

  const badge = $("badge-riesgo");
  badge.style.background = `${colorRiego}12`;
  badge.style.border      = `1px solid ${colorRiego}40`;
  badge.style.color       = colorRiego;
  $("badge-icono").textContent = iconoRiesgo + " ";
  $("badge-texto").textContent = `Riesgo ${nivel}`;

  const barraRelleno = $("score-barra-relleno");
  barraRelleno.style.background = `linear-gradient(90deg, ${colorRiego}88, ${colorRiego})`;
  barraRelleno.style.boxShadow  = `0 0 10px ${colorRiego}66`;
  setTimeout(() => { barraRelleno.style.width = puntaje + "%"; }, 50);

  /* Barras por área */
  const barrasEl = $("barras-areas");
  barrasEl.innerHTML = "";
  PREGUNTAS.forEach(p => {
    const obtenido = p.pesos[RESPUESTAS[p.id] ?? 0];
    const maximo   = p.pesos[0];
    const pct      = Math.round((obtenido / maximo) * 100);
    const color    = pct >= 75 ? "#00ff88" : pct >= 40 ? "#ffb800" : "#ff3860";

    const div = document.createElement("div");
    div.className = "area-item";
    div.innerHTML = `
      <div class="area-item__cabecera">
        <span class="area-item__nombre">${ETIQUETAS_AREA[p.id]}</span>
        <span class="area-item__puntos" style="color:${color}">${obtenido}/${maximo}pts</span>
      </div>
      <div class="area-item__pista">
        <div class="area-item__relleno" style="width:0%;background:${color};box-shadow:0 0 5px ${color}55"></div>
      </div>`;
    barrasEl.appendChild(div);
    setTimeout(() => {
      div.querySelector(".area-item__relleno").style.width = pct + "%";
    }, 80);
  });

  /* Recomendaciones */
  const recsBadge = $("recs-badge");
  recsBadge.textContent = `${recs.length} ${recs.length === 1 ? "área" : "áreas"} a mejorar`;

  const recsEl = $("recs-contenedor");
  recsEl.innerHTML = "";

  if (recs.length === 0) {
    recsEl.innerHTML = `
      <div class="sin-recs">
        <span style="font-size:24px">✔</span>
        <div>
          <div class="sin-recs__titulo">¡Perfil de seguridad excelente!</div>
          <p class="sin-recs__texto">Tus hábitos digitales son sólidos. Sigue monitoreando tus cuentas y mantén estas prácticas.</p>
        </div>
      </div>`;
  } else {
    recs.forEach(rec => {
      const color = COLOR_PRIORIDAD[rec.prioridad];
      const item  = document.createElement("div");
      item.className = "rec-item";
      item.style.border = `1px solid ${color}22`;
      item.innerHTML = `
        <div class="rec-item__cabecera" style="background:${color}08">
          <span class="rec-item__icono">${rec.icono}</span>
          <span class="rec-item__titulo">${rec.titulo}</span>
          <span class="rec-item__prioridad" style="color:${color};border-color:${color}55;border:1px solid ${color}55;padding:2px 8px;border-radius:10px">${rec.prioridad}</span>
        </div>
        <div class="rec-item__cuerpo">
          <p class="rec-item__detalle">${rec.detalle}</p>
        </div>`;
      recsEl.appendChild(item);
    });
  }

  /* Mostrar sección */
  SECCION_CUESTIONARIO.classList.add("oculto");
  SECCION_RESULTADOS.classList.remove("oculto");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ===== BOTÓN VOLVER ===== */

$("btn-volver").addEventListener("click", () => {
  RESPUESTAS = {};
  PREGUNTA_ACTUAL = 0;
  SECCION_RESULTADOS.classList.add("oculto");
  SECCION_CUESTIONARIO.classList.remove("oculto");
  renderPregunta();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ===== INIT ===== */

renderPregunta();