/*CONSTANTES*/

const URLS_DATOS = [
  { id: "ok", texto: "https://games-steam-oficial.net",  correcto: true  },
  { id: "f1", texto: "https://games-steam-oficiaI.net",  correcto: false },
  { id: "f2", texto: "https://games.steam-oficial.net",   correcto: false },
  { id: "f3", texto: "https://games-stearn-oficial.net",   correcto: false },
];

const BOTONES_DESCARGA = [
  { 
    id: "f1", 
    texto: "DESCARGAR STEAM-LAUNCHER (CounterStrike_2_Setup.exe)", 
    correcto: false, 
    fondo: "#0284c7", // Azul tecnológico, imita el color de plataformas oficiales
    grande: true 
    // ENGAÑO: Usa nombres de juegos ultra populares combinados con el instalador oficial. El usuario cansado va directo aquí.
  },
  { 
    id: "f2", 
    texto: "Download Minecraft_Bedrock_v2026.1_Full_Installer.exe", 
    correcto: false, 
    fondo: "#16a34a", // Verde "seguro" de descarga
    grande: true 
    // ENGAÑO: Pone extensiones explícitas (.exe) y palabras como "Full Installer" en verde llamativo para simular limpieza.
  },
  { 
    id: "ok", 
    texto: "checksum_sha256_verify_source_build_3.2.1.zip", 
    correcto: true, 
    fondo: "#1f2937", // Gris oscuro mate (casi se mezcla con el fondo de Ghost-Net)
    grande: false 
    // ¡EL BUENO!: Parece una simple línea de código de verificación técnica o un log aburrido. No tiene llamadas a la acción ("Download").
  },
  { 
    id: "f3", 
    texto: "INSTALADOR DIRECTO — GTA_VI_Alpha_Build_Leak.zip", 
    correcto: false, 
    fondo: "#b45309", // Naranja de advertencia/atención
    grande: true 
    // ENGAÑO: Apela a la codicia del usuario ofreciendo una supuesta "filtración" (Leak) de un juego muy esperado.
  },
  { 
    id: "f4", 
    texto: "Instalar EA-App + Sims_4_All_DLCs_Bundle", 
    correcto: false, 
    fondo: "#4b5563", // Gris neutro engañoso
    grande: false 
    // ENGAÑO: Simula ser un instalador oficial empaquetado (Bundle) con expansiones gratis.
  },
  { 
    id: "f5", 
    texto: "DESCARGA EXPRESA (Servidor Espejo Latinoamérica)", 
    correcto: false, 
    fondo: "#dc2626", // Rojo de alta prioridad
    grande: true 
    // ENGAÑO: Usa términos de infraestructura de red real ("Servidor Espejo") para sonar legítimo y geolocalizado.
  }
];

const CONTRASENAS = [
  { id: "f1", texto: "A1b2C3d4E5f6G7h8!",         correcto: false,
    razon: "Contiene un nombre propio y año. Alguien que te conozca podría adivinarlo fácilmente." },
  { id: "f2", texto: "K8$v9!Q_L2x4T",       correcto: false,
    razon: "Usa 'password' como base con números al final. Patrón muy común en ataques de diccionario." },
  { id: "f3", texto: "GNet_Secure20261P",         correcto: false,
    razon: "Tiene símbolo pero es un patrón predecible indexado en todas las bases de datos filtradas." },
  { id: "ok", texto: "3Q!w9x$K2_L4T", correcto: true,
    razon: "Combina palabras aleatorias, sustitución de caracteres y símbolos. Larga e impredecible." },
];

const CARPETAS_WINDOS = [
  "Usuarios", "Sistema", "Configuración", "Drivers", "Logs",
  "Sistema Avanzado", "Archivos de programa", "Registro",
  "Actualizaciones", "Red", "Multimedia", "Herramientas",
  "Boot", "Temp", "Cache",
];

const NOMBRES_CAYENDO = ["Usuarios", "Sistema", "Drivers", "Logs", "Red", "Boot", "Temp"];

/*PIEZAS DEL ROMPECABEZAS*/

const PIEZAS_PUZZLE = [
  { fila: 1, col: 1, trazado: "M 0,30 L 30,30 L 30,60",  rotInicial: 2 },
  { fila: 2, col: 1, trazado: "M 30,0 L 30,30 L 60,30",   rotInicial: 3 },
  { fila: 2, col: 2, trazado: "M 0,30 L 60,30",            rotInicial: 1 },
  { fila: 2, col: 3, trazado: "M 30,0 L 30,30 L 0,30",    rotInicial: 1 },
  { fila: 1, col: 3, trazado: "M 60,30 L 30,30 L 30,60",  rotInicial: 3 },
];

/*ESTADO GLOBAL*/

let FASE_ACTUAL      = "intro";
let PUNTUACIONES     = { p1Url: false, p1Dl: false, p2: false, p3: false, p4: false, p5: false };
let METODO_P5        = null;

/* Temporizador */
let TIMER_MS         = 0;
let TIMER_MAX_MS     = 0;
let TIMER_ACTIVO     = false;
let TIMER_PAUSADO    = false;
let TIMER_ID         = null;

/* Estado por fase */
let P1_URL_OK        = false;
let P1_DL_OK         = false;
let EMAIL_VAL        = "";
let ROTACIONES_PIEZA = PIEZAS_PUZZLE.map(p => p.rotInicial);
let P4_ELECCION      = null;
let P4_REVELADO      = false;
let RUTA_EXPLORADOR  = [];
let CODIGO_VAL       = "";
let INTENTOS_CODIGO  = 3;
let CAYENDO_64       = false;
let CAIDA_COMPLETA   = false;
let MSG_SISTEMA      = null;
let MSG_SISTEMA_TO   = null;

/*TEMPORIZADOR*/

function iniciarTemporizador(ms) {
  TIMER_MS     = ms;
  TIMER_MAX_MS = ms;
  TIMER_ACTIVO = true;
  TIMER_PAUSADO = false;
  if (TIMER_ID) clearInterval(TIMER_ID);
  TIMER_ID = setInterval(tickTemporizador, 100);
}

function detenerTemporizador() {
  TIMER_ACTIVO = false;
  if (TIMER_ID) { clearInterval(TIMER_ID); TIMER_ID = null; }
}

function pausarTemporizador()   { TIMER_PAUSADO = true;  }
function reanudarTemporizador() { TIMER_PAUSADO = false; }

function tickTemporizador() {
  if (!TIMER_ACTIVO || TIMER_PAUSADO) return;
  TIMER_MS = Math.max(0, TIMER_MS - 100);
  actualizarBarraTiempo();
  if (TIMER_MS <= 0) {
    detenerTemporizador();
    alExpirarTiempo();
  }
}

function alExpirarTiempo() {
  const f = FASE_ACTUAL;
  if (f === "p1_urls" || f === "p1_descarga") renderFase("p1_resultado");
  else if (f === "p2_email")  { PUNTUACIONES.p2 = false; renderFase("p2_resultado"); }
  else if (f === "p3_puzzle") { PUNTUACIONES.p3 = false; renderFase("p3_resultado"); }
  else if (f === "p5_explorador" || f === "p5_64bits") renderFase("final");
  else if (f === "p4_seleccion") { PUNTUACIONES.p4 = false;P4_REVELADO = true;renderFase("p4_seleccion");
}
}

/* ===== BARRA DE TIEMPO ===== */

function actualizarBarraTiempo() {
  const relleno = document.getElementById("g-barra-relleno");
  const segs    = document.getElementById("g-barra-segundos");
  if (!relleno || !segs) return;
  const pct   = TIMER_MAX_MS > 0 ? (TIMER_MS / TIMER_MAX_MS) * 100 : 100;
  const color = pct < 20 ? "#f92837" : pct < 45 ? "#f7823e" : "#00FD87";
  relleno.style.width      = pct + "%";
  relleno.style.background = color;
  relleno.style.boxShadow  = `0 0 8px ${color}88`;
  segs.textContent         = Math.ceil(TIMER_MS / 1000) + "s";
  segs.style.color         = color;
}

function htmlBarraTiempo() {
  const pct   = TIMER_MAX_MS > 0 ? (TIMER_MS / TIMER_MAX_MS) * 100 : 100;
  const color = pct < 20 ? "#f92837" : pct < 45 ? "#f7823e" : "#00FD87";
  const secs  = Math.ceil(TIMER_MS / 1000);
  return `
    <div class="g-barra-tiempo">
      <div class="g-barra-tiempo__cabecera">
        <span class="g-barra-tiempo__etiqueta">⏱ TIEMPO RESTANTE</span>
        <span class="g-barra-tiempo__segundos" id="g-barra-segundos" style="color:${color}">${secs}s</span>
      </div>
      <div class="g-barra-tiempo__pista">
        <div class="g-barra-tiempo__relleno" id="g-barra-relleno" style="width:${pct}%;background:${color};box-shadow:0 0 8px ${color}88;"></div>
      </div>
    </div>`;
}

/* ===== RENDER PRINCIPAL ===== */

function renderFase(fase) {
  FASE_ACTUAL = fase;
  const app = document.getElementById("guardian-app");
  switch (fase) {
    case "intro":         app.innerHTML = htmlIntro();        break;
    case "p1_contexto":   app.innerHTML = htmlP1Contexto();  break;
    case "p1_urls":       iniciarTemporizador(8000); app.innerHTML = htmlP1Urls();     break;
    case "p1_descarga":   iniciarTemporizador(7000); app.innerHTML = htmlP1Descarga(); break;
    case "p1_resultado":  detenerTemporizador(); app.innerHTML = htmlP1Resultado(); break;
    case "p2_intro":      app.innerHTML = htmlP2Intro();     break;
    case "p2_email":      iniciarTemporizador(9000); app.innerHTML = htmlP2Email();    break;
    case "p2_resultado":  detenerTemporizador(); app.innerHTML = htmlP2Resultado(); break;
    case "p3_intro":      app.innerHTML = htmlP3Intro();     break;
    case "p3_puzzle":     iniciarTemporizador(6000); app.innerHTML = htmlP3Puzzle();   break;
    case "p3_resultado":  detenerTemporizador(); app.innerHTML = htmlP3Resultado(); break;
    case "p4_intro":      detenerTemporizador();app.innerHTML = htmlP4Intro();     break;
    case "p4_seleccion": if (!TIMER_ACTIVO) {iniciarTemporizador(8000);}app.innerHTML = htmlP4Seleccion();break;
    case "p5_intro":      app.innerHTML = htmlP5Intro();     break;
    case "p5_explorador": RUTA_EXPLORADOR = RUTA_EXPLORADOR; iniciarTemporizador(TIMER_MS || 20000);
                          app.innerHTML = htmlP5Explorador(); break;
    case "p5_sisav":      pausarTemporizador(); app.innerHTML = htmlP5SistemaAvanzado(); break;
    case "p5_64bits":     app.innerHTML = htmlP5_64bits(); lanzarCaida(); break;
    case "final":         detenerTemporizador(); app.innerHTML = htmlFinal(); break;
  }
  vincularEventos(fase);
}

/* ===== HTML: INTRO ===== */

function htmlIntro() {
  return `
  <div class="g-caja g-caja--rojo">
    <div class="g-intro-icono">💀</div>
    <h1 class="g-intro-titulo">SIMULADOR 6</h1>
    <h2 class="g-intro-subtitulo">Ataque Total — El Guardián de la Base de Datos</h2>
    <p class="g-intro-parrafo">
      Un atacante está comprometiendo el sistema completo. Deberás tomar decisiones rápidas, resolver desafíos bajo presión y usar las pistas del camino para proteger la infraestructura.
    </p>
    <div class="g-intro-fichas">
      <div class="g-intro-ficha"><div class="g-intro-ficha__icono">⚡</div><div class="g-intro-ficha__texto">5 Fases de ataque</div></div>
      <div class="g-intro-ficha"><div class="g-intro-ficha__icono">🧩</div><div class="g-intro-ficha__texto">Minijuegos interactivos</div></div>
      <div class="g-intro-ficha"><div class="g-intro-ficha__icono">💡</div><div class="g-intro-ficha__texto">Pistas ocultas</div></div>
    </div>
    <div class="g-acciones">
      <a href="Simuladores.html" class="g-boton g-boton--gris">← Volver</a>
      <button class="g-boton g-boton--rojo" id="btn-iniciar-mision" style="flex:1">⚡ Iniciar misión</button>
    </div>
  </div>`;
}

/*HTML: FASE 1 CONTEXTO*/

function htmlP1Contexto() {
  return `
  <div class="g-caja g-caja--naranja">
    ${htmlEtiquetaFase(1, "Ataque de Descarga Sospechosa", "naranja")}
    <div style="background:#030d12;border:1px solid rgba(247,130,62,0.3);border-radius:8px;padding:16px 18px;margin-bottom:20px;font-family:'Courier New',monospace;font-size:13px;line-height:1.9;">
      <div><span style="color:#f7823e">[SISTEMA]</span> <span style="color:#a8c4d8">Un usuario intenta descargar un juego gratuito desde internet...</span></div>
      <div><span style="color:#f7823e">[SISTEMA]</span> <span style="color:#a8c4d8">Se detectó tráfico hacia varios dominios similares al oficial.</span></div>
      <div><span style="color:#f92837">[ALERTA] </span> <span style="color:#a8c4d8">Solo uno es el dominio legítimo. Los demás son sitios de phishing.</span></div>
    </div>
    <button class="g-boton g-boton--naranja" id="btn-continuar-p1">Continuar →</button>
  </div>`;
}

/* ===== HTML: FASE 1 URLs ===== */

function htmlP1Urls() {
  const urlsHtml = URLS_DATOS.map(u => `
    <button class="g-url-boton" data-url-id="${u.id}">
      <span class="g-url-boton__candado">🔒</span>
      https://${u.texto}
    </button>`).join("");
  return `
  <div class="g-caja g-caja--naranja">
    ${htmlEtiquetaFase(1, "Selecciona el dominio oficial", "naranja")}
    ${htmlBarraTiempo()}
    <p style="font-family:'Courier New',monospace;color:#5D8A9C;font-size:13px;margin-bottom:14px;">
      Analiza cada URL con cuidado. ¿Cuál es la legítima?
    </p>
    <div class="g-lista-urls">${urlsHtml}</div>
  </div>`;
}

/* ===== HTML: FASE 1 DESCARGA ===== */

function htmlP1Descarga() {
  const botonesHtml = BOTONES_DESCARGA.map(btn => `
    <button class="g-boton-descarga" data-dl-id="${btn.id}"
      style="background:${btn.fondo};padding:${btn.grande ? '14px 10px' : '10px 10px'};font-size:${btn.grande ? '13px' : '12px'};font-weight:${btn.grande ? '700' : '400'};">
      ${btn.texto}
    </button>`).join("");
  return `
  <div class="g-caja g-caja--naranja" style="max-width:800px">
    ${htmlEtiquetaFase(1, "Página de descarga", "naranja")}
    ${htmlBarraTiempo()}
    <div class="g-navegador">
      <div class="g-navegador__chrome">
        <span class="g-navegador__punto g-navegador__punto--rojo"></span>
        <span class="g-navegador__punto g-navegador__punto--amarillo"></span>
        <span class="g-navegador__punto g-navegador__punto--verde"></span>
        <div class="g-navegador__barra-url">🔒 https://games-steam-oficial.net/download/shadowrealm</div>
      </div>
      <div class="g-navegador__contenido">
        <div class="g-sitio-titulo">ShadowRealm Online</div>
        <div class="g-sitio-meta">v3.2.1 · 4.7 GB · Windows 10/11 · Gratis</div>
        <div class="g-grilla-botones-descarga">${botonesHtml}</div>
      </div>
    </div>
    <p style="font-family:'Courier New',monospace;color:#5D8A9C;font-size:11px;">⚠ Analiza bien antes de hacer clic. No todos los botones son lo que parecen.</p>
  </div>`;
}

/* ===== HTML: FASE 1 RESULTADO ===== */

function htmlP1Resultado() {
  const ambos    = P1_URL_OK && P1_DL_OK;
  const soloUrl  = P1_URL_OK && !P1_DL_OK;
  const colorBox = ambos ? "verde" : soloUrl ? "amarillo" : "rojo";
  const icono    = ambos ? "✔" : "⚠";
  const msg1     = !P1_URL_OK
    ? "Has caído en la trampa. Un archivo malicioso logró entrar al sistema."
    : !P1_DL_OK
    ? "El sitio era legítimo, pero descargaste desde un anuncio malicioso."
    : "Descarga segura confirmada. Archivo verificado correctamente.";
  const msg2     = !P1_URL_OK
    ? "Los dominios falsos cambian mínimos detalles: 'ofici4l', '.com' en lugar de .net, 'oflcial' sin la 'i'. Revisa siempre carácter por carácter."
    : !P1_DL_OK
    ? "El botón correcto era 'https://games-steam-oficial.net'. Los botones coloridos y con stars son anuncios disfrazados."
    : "Identificaste el dominio correcto Y el botón de descarga oficial. Excelente atención al detalle.";
  return `
  <div class="g-caja g-caja--${colorBox}">
    ${htmlEtiquetaFase(1, "Resultado", colorBox)}
    <div style="font-size:36px;text-align:center;margin-bottom:14px">${icono}</div>
    ${htmlNarracion(msg1, colorBox)}
    ${htmlNarracion(msg2, colorBox)}
    <p style="font-family:'Courier New',monospace;color:#5D8A9C;font-size:12px;margin-bottom:16px;">Iniciando protocolo de defensa — FASE 2...</p>
    <button class="g-boton g-boton--cyan" id="btn-ir-p2">Continuar → FASE 2</button>
  </div>`;
}

/* ===== HTML: FASE 2 INTRO ===== */

function htmlP2Intro() {
  return `
  <div class="g-caja g-caja--cyan">
    ${htmlEtiquetaFase(2, "Protección del Correo", "cyan")}
    <div class="g-alerta-parpadeo" style="font-family:'Courier New',monospace;color:#f92837;font-size:15px;margin-bottom:14px;">⚠ ALERTA DE SEGURIDAD</div>
    ${htmlNarracion("Un atacante intenta obtener acceso mediante tu correo electrónico. Crea un correo seguro antes de que el tiempo expire.", "cyan")}
    <div style="background:var(--color-superficie);border:1px solid rgba(0,200,251,0.25);border-radius:8px;padding:14px 18px;margin-bottom:18px;">
      <div style="font-family:'Courier New',monospace;color:#00C8FB;font-size:11px;letter-spacing:0.1em;margin-bottom:10px;">REQUISITOS</div>
      <ul style="margin:0;padding-left:18px;font-family:'Courier New',monospace;color:#a8c4d8;font-size:13px;line-height:1.8;">
        <li>Mínimo 15 caracteres en total</li>
        <li>Letras mayúsculas</li>
        <li>Letras minúsculas</li>
        <li>Números</li>
        <li>Símbolo especial (_, !, #, &...)</li>
        <li>Dominio válido (@gmail.com...)</li>
      </ul>
    </div>
    <div style="font-family:'Courier New',monospace;color:#5D8A9C;font-size:12px;margin-bottom:18px;line-height:1.6">
      <span style="color:#f92837">✗</span> Password123@gmail.com &nbsp;·&nbsp;
      <span style="color:#f92837">✗</span> usuario2026@gmail.com<br>
      <span style="color:#00FD87">✓</span> Nombre_Seguro92!@gmail.com
    </div>
    <button class="g-boton g-boton--cyan" id="btn-iniciar-email">Iniciar defensa (10s)</button>
  </div>`;
}

/* ===== HTML: FASE 2 EMAIL ===== */

function htmlP2Email() {
  return `
  <div class="g-caja g-caja--cyan">
    ${htmlEtiquetaFase(2, "Crea un correo seguro", "cyan")}
    ${htmlBarraTiempo()}
    <div class="g-campo-email">
      <input type="email" id="g-input-email" class="g-input" placeholder="TuCorreo_Seguro92!@gmail.com" autocomplete="off" />
      <button class="g-boton g-boton--cyan" id="btn-verificar-email" style="white-space:nowrap">Verificar</button>
    </div>
    <div id="g-error-email" class="g-error-texto" style="display:none"></div>
    <div class="g-validaciones" id="g-val-chips">
      ${htmlChipsValidacion("")}
    </div>
  </div>`;
}

function htmlChipsValidacion(email) {
  const local  = email.split("@")[0] || "";
  const domain = email.includes("@") ? email.split("@")[1] : "";
  const checks = [
    { label: "15+ chars", ok: email.length >= 15 },
    { label: "Mayúsc.",   ok: /[A-Z]/.test(local) },
    { label: "Minúsc.",   ok: /[a-z]/.test(local) },
    { label: "Número",    ok: /[0-9]/.test(local) },
    { label: "Símbolo",   ok: /[^a-zA-Z0-9]/.test(local) },
    { label: "@dominio",  ok: !!domain && domain.includes(".") },
  ];
  return checks.map(c =>
    `<span class="g-val-chip ${c.ok ? "g-val-chip--ok" : "g-val-chip--nok"}">${c.ok ? "✓" : "○"} ${c.label}</span>`
  ).join("");
}

function validarEmail(email) {
  const atIdx = email.indexOf("@");
  if (atIdx < 0) return "Debe incluir @dominio (ej: @gmail.com)";
  const local  = email.slice(0, atIdx);
  const domain = email.slice(atIdx + 1);
  if (!domain.includes(".") || domain.length < 5) return "Dominio inválido (ej: gmail.com)";
  if (email.length < 15) return "Mínimo 15 caracteres en total";
  if (local.length < 6)  return "La parte antes del @ es muy corta";
  if (!/[A-Z]/.test(local)) return "Falta al menos una MAYÚSCULA";
  if (!/[a-z]/.test(local)) return "Falta al menos una minúscula";
  if (!/[0-9]/.test(local)) return "Falta al menos un número";
  if (!/[^a-zA-Z0-9]/.test(local)) return "Falta un símbolo especial (_, !, #, &...)";
  return null;
}

/* ===== HTML: FASE 2 RESULTADO ===== */

function htmlP2Resultado() {
  const accent = PUNTUACIONES.p2 ? "verde" : "rojo";
  const icono  = PUNTUACIONES.p2 ? "🛡" : "⚠";
  const msg    = PUNTUACIONES.p2
    ? `Correo protegido correctamente. "${EMAIL_VAL}" cumple todos los requisitos.`
    : "El atacante logró identificar tu correo. Continuando el ataque...";
  const msg2   = PUNTUACIONES.p2 ? null
    : "Un correo como 'usuario2026@gmail.com' es predecible. Necesitas mayúsculas, símbolo especial y 15+ caracteres.";
  return `
  <div class="g-caja g-caja--${accent}">
    ${htmlEtiquetaFase(2, "Resultado", accent)}
    <div style="font-size:36px;text-align:center;margin-bottom:14px">${icono}</div>
    ${htmlNarracion(msg, accent)}
    ${msg2 ? htmlNarracion(msg2, "rojo") : ""}
    <button class="g-boton g-boton--morado" id="btn-ir-p3">Continuar → FASE 3</button>
  </div>`;
}

/* ===== HTML: FASE 3 INTRO ===== */

function htmlP3Intro() {
  return `
  <div class="g-caja g-caja--morado">
    ${htmlEtiquetaFase(3, "Comunicación con el Técnico", "morado")}
    ${htmlNarracion("El sistema necesita enviar una señal de emergencia al técnico antes de que el atacante avance.", "morado")}
    <div style="background:var(--color-superficie);border:1px solid rgba(176,68,255,0.25);border-radius:8px;padding:14px 20px;margin-bottom:20px;">
      <div style="font-family:'Courier New',monospace;color:#ef4ce9;font-size:11px;margin-bottom:10px;letter-spacing:0.1em;">OBJETIVO</div>
      <div style="display:flex;align-items:center;gap:12px;font-family:'Courier New',monospace;font-size:14px;color:#d8edf7;">
        <span>💻 PC</span>
        <div style="flex:1;height:2px;background:linear-gradient(90deg,#ef4ce9,#00FD87);border-radius:1px"></div>
        <span>🔧 Técnico</span>
      </div>
      <p style="font-family:'Courier New',monospace;color:#5D8A9C;font-size:13px;margin:12px 0 0;line-height:1.6;">
        Haz clic en cada pieza del circuito para rotarla. Cuando todas estén alineadas, la señal se transmitirá.
      </p>
    </div>
    <button class="g-boton g-boton--morado" id="btn-iniciar-puzzle">Iniciar rompecabezas (25s)</button>
  </div>`;
}

/* ===== HTML: FASE 3 PUZZLE ===== */

function htmlP3Puzzle() {
  const COLS = 5;
  const ROWS = 3;

  /* Mapa posición → índice de pieza */
  const mapa = {};
  PIEZAS_PUZZLE.forEach((p, i) => { mapa[`${p.fila},${p.col}`] = i; });

  let celdasHtml = "";
  for (let f = 0; f < ROWS; f++) {
    for (let c = 0; c < COLS; c++) {
      const key = `${f},${c}`;
      const pi  = mapa[key];

      if (f === 1 && c === 0) {
        celdasHtml += `<div class="g-celda g-celda--inicio"><span style="font-size:18px">💻</span><span class="g-celda__texto">PC</span></div>`;
      } else if (f === 1 && c === 4) {
        const finsol = ROTACIONES_PIEZA.every(r => r % 4 === 0);
        celdasHtml += `<div class="g-celda g-celda--fin${finsol ? " g-celda--fin-ok" : ""}" id="g-celda-fin"><span style="font-size:18px">🔧</span><span class="g-celda__texto">TÉC.</span></div>`;
      } else if (pi !== undefined) {
        const pieza = PIEZAS_PUZZLE[pi];
        const rot   = ROTACIONES_PIEZA[pi];
        const ok    = rot % 4 === 0;
        const color = ok ? "#00FD87" : "#ef4ce9";
        celdasHtml += `
          <button class="g-celda g-celda--pieza${ok ? " g-celda--pieza-ok" : ""}" data-pieza-idx="${pi}" title="Clic para rotar">
            <svg class="g-pieza-svg" width="50" height="50" viewBox="0 0 60 60" style="transform:rotate(${rot * 90}deg)">
              <circle cx="30" cy="30" r="5" fill="${color}"/>
              <path d="${pieza.trazado}" stroke="${color}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>`;
      } else {
        celdasHtml += `<div class="g-celda g-celda--vacia"></div>`;
      }
    }
  }

  const resueltas = ROTACIONES_PIEZA.filter(r => r % 4 === 0).length;
  return `
  <div class="g-caja g-caja--morado">
    ${htmlEtiquetaFase(3, "Conecta la señal de emergencia", "morado")}
    ${htmlBarraTiempo()}
    <div style="overflow-x:auto;margin-bottom:12px;">
      <div class="g-grilla-puzzle" id="g-grilla-puzzle">${celdasHtml}</div>
    </div>
    <div class="g-puzzle-estado" id="g-puzzle-estado">Clic para rotar · ${resueltas}/5 piezas alineadas</div>
  </div>`;
}

function rotarPieza(idx) {
  ROTACIONES_PIEZA[idx] = (ROTACIONES_PIEZA[idx] + 1) % 4;
  actualizarPiezaEnDOM(idx);
  const resuelto = ROTACIONES_PIEZA.every(r => r % 4 === 0);
  if (resuelto) {
    detenerTemporizador();
    PUNTUACIONES.p3 = true;
    setTimeout(() => renderFase("p3_resultado"), 700);
  }
}

function actualizarPiezaEnDOM(idx) {
  const pieza   = PIEZAS_PUZZLE[idx];
  const rot     = ROTACIONES_PIEZA[idx];
  const ok      = rot % 4 === 0;
  const color   = ok ? "#00FD87" : "#ef4ce9";
  const btn     = document.querySelector(`[data-pieza-idx="${idx}"]`);
  if (!btn) return;
  btn.classList.toggle("g-celda--pieza-ok", ok);
  const svg = btn.querySelector("svg");
  if (svg) {
    svg.style.transform = `rotate(${rot * 90}deg)`;
    svg.querySelector("circle").setAttribute("fill", color);
    svg.querySelector("path").setAttribute("stroke", color);
  }
  const resueltas = ROTACIONES_PIEZA.filter(r => r % 4 === 0).length;
  const estado = document.getElementById("g-puzzle-estado");
  if (estado) estado.textContent = `Clic para rotar · ${resueltas}/5 piezas alineadas`;
  const fin = document.getElementById("g-celda-fin");
  if (fin && resueltas === 5) fin.classList.add("g-celda--fin-ok");
}

/* ===== HTML: FASE 3 RESULTADO ===== */

function htmlP3Resultado() {
  const accent = PUNTUACIONES.p3 ? "verde" : "rojo";
  const icono  = PUNTUACIONES.p3 ? "📡" : "❌";
  const msg    = PUNTUACIONES.p3
    ? "Señal enviada correctamente. El técnico logró comunicarse contigo."
    : "La señal no llegó a tiempo. El atacante continúa avanzando.";
  const pistaHtml = PUNTUACIONES.p3 ? `
    <div class="g-pista-caja">
      <div class="g-pista-caja__titulo">PISTA RECIBIDA DEL TÉCNICO</div>
      <div class="g-pista-caja__texto">"Una contraseña segura no siempre parece complicada."</div>
      <div class="g-pista-clave">🔑 <strong>PISTA PARA REINICIO:</strong> "Me equivoque"</div>
    </div>` : "";
  return `
  <div class="g-caja g-caja--${accent}">
    ${htmlEtiquetaFase(3, "Resultado", accent)}
    <div style="font-size:36px;text-align:center;margin-bottom:14px">${icono}</div>
    ${htmlNarracion(msg, accent)}
    ${pistaHtml}
    <button class="g-boton g-boton--amarillo" id="btn-ir-p4">Continuar → FASE 4</button>
  </div>`;
}

/* ===== HTML: FASE 4 INTRO ===== */

function htmlP4Intro() {
  return `
  <div class="g-caja g-caja--amarillo">
    ${htmlEtiquetaFase(4, "Protección de Contraseña", "amarillo")}
    ${htmlNarracion("El atacante intenta cambiar tu contraseña de acceso al sistema.", "amarillo")}
    ${htmlNarracion("Selecciona la contraseña más segura. Una sola es realmente resistente a ataques automatizados.", "amarillo")}
    <button class="g-boton g-boton--amarillo" id="btn-ver-opciones-pwd">Ver opciones →</button>
  </div>`;
}

/* ===== HTML: FASE 4 SELECCIÓN ===== */

function htmlP4Seleccion() {
  const opcionesHtml = CONTRASENAS.map(pwd => {
    let claseExtra = "";

    if (P4_REVELADO) {
      claseExtra = pwd.correcto
        ? "g-contrasena-opcion--correcto"
        : (P4_ELECCION === pwd.id
            ? "g-contrasena-opcion--incorrecto"
            : "");
    } else {
      claseExtra = P4_ELECCION === pwd.id
        ? "g-contrasena-opcion--seleccionado"
        : "";
    }

    const razonHtml = P4_REVELADO
      ? `
        <div class="g-contrasena-opcion__razon ${pwd.correcto ? "g-contrasena-opcion__razon--ok" : "g-contrasena-opcion__razon--nok"}">
          ${pwd.correcto ? "✓ Correcta: " : "✗ Incorrecta: "}${pwd.razon}
        </div>`
      : "";

    return `
      <button
        class="g-contrasena-opcion ${claseExtra}"
        data-pwd-id="${pwd.id}"
        ${P4_REVELADO ? "disabled" : ""}
      >
        <div class="g-contrasena-opcion__texto">${pwd.texto}</div>
        ${razonHtml}
      </button>
    `;
  }).join("");

  const btnConfirmar =
    (!P4_REVELADO && P4_ELECCION)
      ? `<button class="g-boton g-boton--amarillo" id="btn-confirmar-pwd">
            Confirmar elección
         </button>`
      : "";

  const mensajeYBtn = P4_REVELADO
    ? `
      <div style="
        font-family:'Courier New',monospace;
        color:#5D8A9C;
        font-size:13px;
        line-height:1.65;
        margin-bottom:18px;
        background:var(--color-superficie);
        border:1px solid var(--color-borde);
        border-radius:8px;
        padding:12px 16px;
      ">
        La seguridad no depende de que una contraseña <em>parezca</em> complicada.
        Depende de qué tan difícil sea predecirla.
      </div>

      <button
        class="g-boton g-boton--rojo"
        id="btn-ir-p5"
      >
        Continuar → FASE 5 — BOSS ⚡
      </button>
    `
    : "";

  return `
    <div class="g-caja g-caja--amarillo">

      ${htmlEtiquetaFase(4, "¿Cuál es la más segura?", "amarillo")}

      ${htmlBarraTiempo()}

      <div class="g-lista-contrasenas">
        ${opcionesHtml}
      </div>

      ${btnConfirmar}

      ${mensajeYBtn}

    </div>
  `;
}

/* ===== HTML: FASE 5 INTRO ===== */

function htmlP5Intro() {
  return `
  <div class="g-caja g-caja--rojo" style="border-color:rgba(249,40,55,0.7)">
    <div style="text-align:center;margin-bottom:22px;">
      <div class="g-alerta-parpadeo" style="font-family:'Courier New',monospace;color:#f92837;font-size:20px;margin-bottom:10px;">⚠ ALERTA CRÍTICA</div>
      <div style="font-family:'Courier New',monospace;color:#d8edf7;font-size:15px;line-height:1.6;">
        El atacante está intentando modificar tu sistema.<br>Debes actuar rápido.
      </div>
    </div>
    ${htmlEtiquetaFase(5, "Crisis Final del Sistema", "rojo")}
    ${htmlNarracion("El cronómetro inicia al presionar el botón. Navega por el explorador para encontrar la forma de detener el ataque.", "rojo")}
    <button class="g-boton g-boton--rojo" id="btn-iniciar-p5" style="width:100%;display:block;text-align:center;">
      ⚡ Iniciar — CRONÓMETRO ACTIVO
    </button>
  </div>`;
}

/* ===== HTML: FASE 5 EXPLORADOR ===== */

function htmlP5Explorador() {
  const contenido  = obtenerContenido(RUTA_EXPLORADOR);

  /* Miga de pan */
  let migaHtml = `<span class="g-miga-pan__segmento" data-miga-idx="-1">🖥 Mi PC</span>`;
  RUTA_EXPLORADOR.forEach((seg, i) => {
    const activo = i === RUTA_EXPLORADOR.length - 1;
    migaHtml += `<span class="g-miga-pan__separador">›</span>
      <span class="${activo ? "g-miga-pan__segmento g-miga-pan__segmento--activo" : "g-miga-pan__segmento"}" data-miga-idx="${i}">${seg}</span>`;
  });

  /* Archivos y carpetas */
  let itemsHtml = "";
  if (RUTA_EXPLORADOR.length > 0) {
    itemsHtml += `<button class="g-archivo-boton" id="btn-subir-directorio">
      <div class="g-archivo-boton__icono">📁</div>..
    </button>`;
  }
  contenido.forEach((item, i) => {
    const icono    = item.esDir ? "📁" : iconoArchivo(item.nombre);
    const claseExt = item.especial === "exe_ganador" ? " g-archivo-boton--exe-ganador" : item.especial === "defensor" ? " g-archivo-boton--defender" : "";
    const accion   = (item.esDir || item.especial) ? `data-item-idx="${i}"` : "";
    itemsHtml += `
      <button class="g-archivo-boton${claseExt}" ${accion} ${!item.esDir && !item.especial ? "disabled style='cursor:default'" : ""}>
        <div class="g-archivo-boton__icono">${icono}</div>
        ${item.nombre}
      </button>`;
  });

  const msgSis = MSG_SISTEMA ? `<div class="g-mensaje-sistema">${MSG_SISTEMA}</div>` : "";

  return `
  <div class="g-caja g-caja--rojo" style="max-width:800px">
    ${htmlEtiquetaFase(5, "Explorador del Sistema", "rojo")}
    ${htmlBarraTiempo()}
    <div class="g-barra-busqueda-rota">
      <div class="g-barra-busqueda-rota__campo">🔍 JAJA ENCERIO PENSASTE QUE TE DARIA OPORTUNIDAD DE RESCATAR ALGO JAJA</div>
    </div>
    <div class="g-miga-pan">${migaHtml}</div>
    ${msgSis}
    <div class="g-explorador-contenido" id="g-explorador-contenido">${itemsHtml}</div>
  </div>`;
}

function iconoArchivo(nombre) {
  if (nombre.endsWith(".exe"))  return "⚙";
  if (nombre.endsWith(".dll") || nombre.endsWith(".sys")) return "🔩";
  if (nombre.endsWith(".png") || nombre.endsWith(".jpg")) return "🖼";
  if (nombre.endsWith(".sql"))  return "🗄";
  return "📄";
}

function obtenerContenido(ruta) {
  if (ruta.length === 0) return [
    { nombre: "Escritorio", esDir: true },
    { nombre: "Descargas", esDir: true },
    { nombre: "Documentos", esDir: true },
    { nombre: "Imágenes", esDir: true },
    { nombre: "Mi equipo", esDir: true },
  ];

  if (ruta[0] === "Escritorio") return [
    { nombre: "Calculadora-2GB", esDir: false },
    { nombre: "Proyecto_Final_CORREGIDO.docx", esDir: false },
    { nombre: "Informe_Final.pdf", esDir: false },
    { nombre: "Presentacion.pptx", esDir: false },
    { nombre: "Backup.sql", esDir: false },
    { nombre: "Notas.txt", esDir: false },
    { nombre: "Captura_2026-07-16.png", esDir: false },
    { nombre: "Fotos.png", esDir: false },
    { nombre: "Steam.lnk", esDir: false },
    { nombre: "Juegos.exe", esDir: false },
  ];

  if (ruta[0] === "Descargas") return [
    { nombre: "ChromeSetup.exe", esDir: false },
    { nombre: "DiscordSetup.exe", esDir: false },
    { nombre: "game_installer.exe", esDir: false },
    { nombre: "Hack_Gratis.exe", esDir: false },
    { nombre: "Proyecto_backup.docx", esDir: false },
    { nombre: "Drivers.zip", esDir: false },
    { nombre: "Manual.pdf", esDir: false },
    { nombre: "Wallpaper.jpg", esDir: false },
  ];

  if (ruta[0] === "Documentos") return [
    { nombre: "Curriculum.pdf", esDir: false },
    { nombre: "Recibos.pdf", esDir: false },
    { nombre: "Contraseñas.xlsx", esDir: false },
    { nombre: "Tareas.docx", esDir: false },
    { nombre: "Redes.pptx", esDir: false },
    { nombre: "BaseDatos.pdf", esDir: false },
    { nombre: "secreto_privado.txt", esDir: false },
  ];

  if (ruta[0] === "Imágenes") return [
    { nombre: "vacaciones2025.png", esDir: false },
    { nombre: "foto_familia.jpg", esDir: false },
    { nombre: "wallpaper.png", esDir: false },
    { nombre: "gato.png", esDir: false },
    { nombre: "captura_error.png", esDir: false },
  ];

  if (ruta[0] === "Mi equipo") {
    if (ruta.length === 1) return [
      { nombre: "Windos", esDir: true },
      { nombre: "Windos 2", esDir: true },
    ];

    if (ruta[1] === "Windos 2") return [
      { nombre: "Esta unidad está vacía.", esDir: false },
    ];

    if (ruta[1] === "Windos") {

      if (ruta.length === 2)
        return CARPETAS_WINDOS.map(n => ({ nombre: n, esDir: true }));

      if (ruta[2] === "Archivos de programa") {

        if (ruta.length === 3)
          return [
            { nombre: "Archivos de programa 32 bits", esDir: true },
            { nombre: "Archivos de programa 64 bits", esDir: true, especial: "prog64" },
          ];

        if (ruta[3] === "Archivos de programa 32 bits")
          return [
            { nombre: "Windows Defender", esDir: false, especial: "defensor" },
          ];

        if (ruta[3] === "Archivos de programa 64 bits") {

          if (!CAIDA_COMPLETA) return [];

          return [
            { nombre: "Archivos_sistema.dll", esDir: false },
            { nombre: "reiniciar_y_guardar_info.exe", esDir: false, especial: "exe_ganador" },
            { nombre: "config_backup.sys", esDir: false },
          ];
        }
      }

      return [
        { nombre: "Aquí no es. Sigue buscando.", esDir: false },
      ];
    }
  }

  return [];
}

function navegarA(nombre, especial) {
  if (especial === "defensor") {
    TIMER_MS = Math.max(0, TIMER_MS - 3000);
    actualizarBarraTiempo();
    mostrarMsgSistema("⚠ Windows Defender encontrado. Se restaron 3 segundos del cronómetro.");
    return;
  }
  if (especial === "exe_ganador") {
    detenerTemporizador();
    PUNTUACIONES.p5 = true;
    METODO_P5 = "exe";
    renderFase("final");
    return;
  }
  if (nombre === "Sistema Avanzado") {
    pausarTemporizador();
    renderFase("p5_sisav");
    return;
  }
  if (especial === "prog64") {
    RUTA_EXPLORADOR = [...RUTA_EXPLORADOR, nombre];
    CAYENDO_64 = true;
    CAIDA_COMPLETA = false;
    renderFase("p5_64bits");
    return;
  }
  RUTA_EXPLORADOR = [...RUTA_EXPLORADOR, nombre];
  renderFase("p5_explorador");
}

function mostrarMsgSistema(msg) {
  MSG_SISTEMA = msg;
  if (MSG_SISTEMA_TO) clearTimeout(MSG_SISTEMA_TO);
  MSG_SISTEMA_TO = setTimeout(() => {
    MSG_SISTEMA = null;
    const el = document.getElementById("guardian-app");
    if (el && FASE_ACTUAL === "p5_explorador") el.innerHTML = htmlP5Explorador();
    vincularEventos("p5_explorador");
  }, 2800);
  renderFase("p5_explorador");
}

/* ===== HTML: FASE 5 SISTEMA AVANZADO ===== */

function htmlP5SistemaAvanzado() {
  const msgHtml = CODIGO_VAL === "" && INTENTOS_CODIGO < 3
    ? `<div class="g-sisav-mensaje ${INTENTOS_CODIGO <= 0 ? "g-sisav-mensaje--nok" : "g-sisav-mensaje--nok"}" id="g-sisav-msg">
         ✗ Código incorrecto. Intentos restantes: ${INTENTOS_CODIGO}
       </div>` : "";
  return `
  <div class="g-caja g-caja--amarillo">
    <div class="g-sisav-titulo">SISTEMA AVANZADO</div>
    <div class="g-sisav-subtitulo">⏸ Cronómetro detenido · Introduce el código de recuperación.</div>
    <div class="g-sisav-panel">
      <div class="g-sisav-intentos">INTENTOS DISPONIBLES: ${INTENTOS_CODIGO}</div>
      <div id="g-sisav-msg-contenedor">${msgHtml}</div>
      <div class="g-sisav-campo">
        <input type="text" id="g-input-codigo" class="g-input" placeholder="Código de recuperación..." ${INTENTOS_CODIGO <= 0 ? "disabled" : ""} />
        <button class="g-boton g-boton--amarillo" id="btn-ingresar-codigo" ${INTENTOS_CODIGO <= 0 ? "disabled" : ""}>Ingresar</button>
      </div>
    </div>
    <button class="g-boton g-boton--gris" id="btn-volver-explorador">← Volver (reanudar cronómetro)</button>
  </div>`;
}

function enviarCodigo() {
  const input = document.getElementById("g-input-codigo");
  if (!input) return;
  const val = input.value.trim();
  const msgCont = document.getElementById("g-sisav-msg-contenedor");

  if (val.toLowerCase() === "me equivoque") {
    detenerTemporizador();
    PUNTUACIONES.p5 = true;
    METODO_P5 = "codigo";
    if (msgCont) {
      msgCont.innerHTML = `<div class="g-sisav-mensaje g-sisav-mensaje--ok">✔ Código correcto. Sistema recuperado.</div>`;
    }
    setTimeout(() => renderFase("final"), 1400);
  } else {
    INTENTOS_CODIGO--;
    if (msgCont) {
      if (INTENTOS_CODIGO <= 0) {
        msgCont.innerHTML = `<div class="g-sisav-mensaje g-sisav-mensaje--nok">✗ Acceso bloqueado. No fue posible recuperar el sistema.</div>`;
        document.getElementById("g-input-codigo").disabled = true;
        document.getElementById("btn-ingresar-codigo").disabled = true;
        setTimeout(() => renderFase("final"), 2200);
      } else {
        msgCont.innerHTML = `<div class="g-sisav-mensaje g-sisav-mensaje--nok">✗ Código incorrecto. Intentos restantes: ${INTENTOS_CODIGO}</div>`;
      }
    }
    const intEl = document.querySelector(".g-sisav-intentos");
    if (intEl) intEl.textContent = `INTENTOS DISPONIBLES: ${INTENTOS_CODIGO}`;
    input.value = "";
  }
}

/* ===== HTML: FASE 5 64 BITS (CAÍDA) ===== */

function htmlP5_64bits() {
  const carpetasHtml = NOMBRES_CAYENDO.map((n, i) =>
    `<div class="g-carpeta-cayendo" style="left:${5 + i * 13}%;top:10px;animation-delay:${i * 0.18}s;">📁 ${n}</div>`
  ).join("");
  return `
  <div class="g-caja g-caja--rojo" style="min-height:280px;">
    ${htmlEtiquetaFase(5, "Archivos de programa 64 bits", "rojo")}
    <div class="g-zona-caida">
      ${carpetasHtml}
      <div class="g-caida-mensaje">⚠ Sistema inestable — Analizando...</div>
    </div>
  </div>`;
}

function lanzarCaida() {
  setTimeout(() => {
    CAYENDO_64 = false;
    CAIDA_COMPLETA = true;
    FASE_ACTUAL = "p5_explorador";
    /* Reanudar el timer (ya estaba corriendo, solo actualizamos fase) */
    document.getElementById("guardian-app").innerHTML = htmlP5Explorador();
    vincularEventos("p5_explorador");
  }, 2700);
}

/* ===== HTML: FINAL ===== */

function htmlFinal() {
  const exitos  = Object.values(PUNTUACIONES).filter(Boolean).length;
  const outcome = PUNTUACIONES.p5 ? "PROTECCIÓN TOTAL" : exitos >= 3 ? "RECUPERACIÓN PARCIAL" : "SISTEMA COMPROMETIDO";
  const color   = PUNTUACIONES.p5 ? "verde" : exitos >= 3 ? "amarillo" : "rojo";
  const icono   = PUNTUACIONES.p5 ? "🛡" : exitos >= 3 ? "⚠" : "💀";
  const metodoHtml = METODO_P5
    ? `<div style="font-family:'Courier New',monospace;color:#5D8A9C;font-size:13px;margin-top:6px;">Recuperación: ${METODO_P5 === "codigo" ? '"Me equivoque"' : "reiniciar_y_guardar_info.exe"}</div>` : "";

  const items = [
    { label: "URL correcta identificada",   ok: PUNTUACIONES.p1Url },
    { label: "Descarga segura realizada",   ok: PUNTUACIONES.p1Dl  },
    { label: "Correo protegido",            ok: PUNTUACIONES.p2    },
    { label: "Señal al técnico enviada",    ok: PUNTUACIONES.p3    },
    { label: "Contraseña segura elegida",   ok: PUNTUACIONES.p4    },
    { label: "Sistema recuperado",          ok: PUNTUACIONES.p5    },
  ];

  const puntacionesHtml = items.map(it => `
    <div class="g-final-item ${it.ok ? "g-final-item--ok" : "g-final-item--nok"}">
      <span class="g-final-item__icono" style="color:${it.ok ? "#00FD87" : "#f92837"}">${it.ok ? "✓" : "✗"}</span>
      <span class="g-final-item__texto">${it.label}</span>
    </div>`).join("");

  const resumen = PUNTUACIONES.p5
    ? "Lograste defender el sistema completamente. Identificaste el código 'Me equivoque' en la Fase 3 y lo aplicaste para restablecer el control."
    : exitos >= 3
    ? "El sistema sufrió daños parciales pero limitaste el impacto del ataque. Revisa las fases fallidas para mejorar."
    : "El atacante comprometió el sistema. Cada error en la cadena de decisiones facilitó el acceso. Un solo punto débil puede comprometer toda la infraestructura.";

  return `
  <div class="g-caja g-caja--${color}">
    <div class="g-final-icono">${icono}</div>
    <div class="g-final-titulo" style="color:${PUNTUACIONES.p5 ? "#00FD87" : exitos >= 3 ? "#ffb800" : "#f92837"}">${outcome}</div>
    <div class="g-final-meta">${exitos}/6 objetivos completados ${metodoHtml}</div>
    <div class="g-final-puntuaciones">${puntacionesHtml}</div>
    <div class="g-final-resumen">${resumen}</div>
    <div class="g-acciones">
      <button class="g-boton g-boton--${color}" id="btn-repetir" style="flex:1">↩ Repetir misión</button>
      <a href="Simuladores.html" class="g-boton g-boton--gris">← Laboratorio</a>
    </div>
  </div>`;
}

/* ===== HELPERS DE HTML ===== */

function htmlEtiquetaFase(n, titulo, color) {
  return `
  <div class="g-etiqueta-fase">
    <span class="g-badge-fase g-badge-fase--${color}">FASE ${n} / 5</span>
    <span class="g-titulo-fase">${titulo}</span>
  </div>`;
}

function htmlNarracion(texto, color) {
  const coloresPrefix = {
    verde: "#00FD87", rojo: "#f92837", cyan: "#00C8FB",
    morado: "#ef4ce9", amarillo: "#ffb800", naranja: "#f7823e",
  };
  const c = coloresPrefix[color] || "#00FD87";
  return `
  <div class="g-narracion" style="border-color:${c}33">
    <span class="g-narracion__prefijo" style="color:${c}">[SYS]</span>${texto}
  </div>`;
}

/* ===== VINCULAR EVENTOS ===== */

function vincularEventos(fase) {
  const $ = id => document.getElementById(id);

  if (fase === "intro") {
    $("btn-iniciar-mision")?.addEventListener("click", () => renderFase("p1_contexto"));
  }

  if (fase === "p1_contexto") {
    $("btn-continuar-p1")?.addEventListener("click", () => renderFase("p1_urls"));
  }

  if (fase === "p1_urls") {
    document.querySelectorAll("[data-url-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.urlId;
        const url = URLS_DATOS.find(u => u.id === id);
        detenerTemporizador();
        P1_URL_OK = url?.correcto ?? false;
        if (P1_URL_OK) renderFase("p1_descarga");
        else renderFase("p1_resultado");
      });
    });
  }

  if (fase === "p1_descarga") {
    document.querySelectorAll("[data-dl-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id  = btn.dataset.dlId;
        const dl  = BOTONES_DESCARGA.find(b => b.id === id);
        detenerTemporizador();
        P1_DL_OK = dl?.correcto ?? false;
        PUNTUACIONES.p1Url = P1_URL_OK;
        PUNTUACIONES.p1Dl  = P1_DL_OK;
        renderFase("p1_resultado");
      });
    });
  }

  if (fase === "p1_resultado") {
    $("btn-ir-p2")?.addEventListener("click", () => renderFase("p2_intro"));
  }

  if (fase === "p2_intro") {
    $("btn-iniciar-email")?.addEventListener("click", () => renderFase("p2_email"));
  }

  if (fase === "p2_email") {
    const input = $("g-input-email");
    const errorEl = $("g-error-email");
    const chipsEl = $("g-val-chips");

    input?.addEventListener("input", () => {
      EMAIL_VAL = input.value;
      if (chipsEl) chipsEl.innerHTML = htmlChipsValidacion(EMAIL_VAL);
      if (errorEl) { errorEl.style.display = "none"; input.classList.remove("g-input--error"); }
    });

    input?.addEventListener("keydown", e => { if (e.key === "Enter") verificarEmail(); });

    $("btn-verificar-email")?.addEventListener("click", verificarEmail);

    function verificarEmail() {
      const val = input?.value || "";
      const err = validarEmail(val);
      if (err) {
        if (errorEl) { errorEl.textContent = "✗ " + err; errorEl.style.display = "block"; }
        input?.classList.add("g-input--error");
        return;
      }
      detenerTemporizador();
      EMAIL_VAL = val;
      PUNTUACIONES.p2 = true;
      renderFase("p2_resultado");
    }
    input?.focus();
  }

  if (fase === "p2_resultado") {
    $("btn-ir-p3")?.addEventListener("click", () => renderFase("p3_intro"));
  }

  if (fase === "p3_intro") {
    $("btn-iniciar-puzzle")?.addEventListener("click", () => {
      ROTACIONES_PIEZA = PIEZAS_PUZZLE.map(p => p.rotInicial);
      renderFase("p3_puzzle");
    });
  }

  if (fase === "p3_puzzle") {
    document.querySelectorAll("[data-pieza-idx]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.piezaIdx);
        rotarPieza(idx);
      });
    });
  }

  if (fase === "p3_resultado") {
    $("btn-ir-p4")?.addEventListener("click", () => renderFase("p4_intro"));
  }

if (fase === "p4_intro") {
  $("btn-ver-opciones-pwd")?.addEventListener("click", () => {
    P4_ELECCION = null;
    P4_REVELADO = false;
    renderFase("p4_seleccion");
  });
}

if (fase === "p4_seleccion") {

  document.querySelectorAll("[data-pwd-id]").forEach(btn => {
    btn.addEventListener("click", () => {

      if (P4_REVELADO) return;

      P4_ELECCION = btn.dataset.pwdId;

      renderFase("p4_seleccion");

    });
  });

  $("btn-confirmar-pwd")?.addEventListener("click", () => {

    detenerTemporizador();

    const elegida = CONTRASENAS.find(
      p => p.id === P4_ELECCION
    );

    PUNTUACIONES.p4 = elegida?.correcto ?? false;

    P4_REVELADO = true;

    renderFase("p4_seleccion");

  });

  $("btn-ir-p5")?.addEventListener("click", () => {
    renderFase("p5_intro");
  });

}

  if (fase === "p5_intro") 
    {
        $("btn-iniciar-p5")?.addEventListener("click", () => {
        RUTA_EXPLORADOR = [];
        INTENTOS_CODIGO = 3;
        CAIDA_COMPLETA  = false;
        CAYENDO_64      = false;
        iniciarTemporizador(25000);
        FASE_ACTUAL = "p5_explorador";
        document.getElementById("guardian-app").innerHTML = htmlP5Explorador();
        vincularEventos("p5_explorador");
        });
    }

  if (fase === "p5_explorador") {
    document.querySelectorAll("[data-miga-idx]").forEach(el => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.dataset.migaIdx);
        if (idx < 0) RUTA_EXPLORADOR = [];
        else RUTA_EXPLORADOR = RUTA_EXPLORADOR.slice(0, idx + 1);
        renderFase("p5_explorador");
      });
    });

    $("btn-subir-directorio")?.addEventListener("click", () => {
      RUTA_EXPLORADOR = RUTA_EXPLORADOR.slice(0, -1);
      renderFase("p5_explorador");
    });

    const contenido = obtenerContenido(RUTA_EXPLORADOR);
    document.querySelectorAll("[data-item-idx]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx  = parseInt(btn.dataset.itemIdx);
        const item = contenido[idx];
        if (item) navegarA(item.nombre, item.especial);
      });
    });
  }

  if (fase === "p5_sisav") {
    const input = $("g-input-codigo");
    input?.addEventListener("keydown", e => { if (e.key === "Enter" && INTENTOS_CODIGO > 0) enviarCodigo(); });
    $("btn-ingresar-codigo")?.addEventListener("click", () => { if (INTENTOS_CODIGO > 0) enviarCodigo(); });
    $("btn-volver-explorador")?.addEventListener("click", () => {
      reanudarTemporizador();
      FASE_ACTUAL = "p5_explorador";
      document.getElementById("guardian-app").innerHTML = htmlP5Explorador();
      vincularEventos("p5_explorador");
    });
    input?.focus();
  }

  if (fase === "final") {
    $("btn-repetir")?.addEventListener("click", reiniciarTodo);
  }

}
/* ===== REINICIAR ===== */

function reiniciarTodo() {
  detenerTemporizador();
  PUNTUACIONES     = { p1Url: false, p1Dl: false, p2: false, p3: false, p4: false, p5: false };
  METODO_P5        = null;
  P1_URL_OK        = false;
  P1_DL_OK         = false;
  EMAIL_VAL        = "";
  ROTACIONES_PIEZA = PIEZAS_PUZZLE.map(p => p.rotInicial);
  P4_ELECCION      = null;
  P4_REVELADO      = false;
  RUTA_EXPLORADOR  = [];
  CODIGO_VAL       = "";
  INTENTOS_CODIGO  = 3;
  CAYENDO_64       = false;
  CAIDA_COMPLETA   = false;
  MSG_SISTEMA      = null;
  if (MSG_SISTEMA_TO) clearTimeout(MSG_SISTEMA_TO);
  renderFase("intro");
}

/* ===== INICIALIZACIÓN ===== */

document.addEventListener("DOMContentLoaded", () => {
  renderFase("intro");
});
