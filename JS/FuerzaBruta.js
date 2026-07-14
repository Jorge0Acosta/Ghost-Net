/* ===================================================
   FUERZABRUTA.JS — Simulador de Ataque de Fuerza Bruta
   =================================================== */

/* ===== CONSTANTES ===== */

const CONTRASENAS_COMUNES = new Set([
  "123456","password","admin","qwerty","abc123","letmein","monkey",
  "iloveyou","princess","dragon","master","sunshine","shadow","welcome",
  "654321","passw0rd","football","baseball","superman","batman","1234567890",
  "test","test123","root","toor","user","pass","pass123","guest",
]);

const MENSAJES_INICIO = [
  "Inicializando módulo de ataque de fuerza bruta...",
  "Conectando al objetivo: 192.168.1.1:22",
  "Conexión establecida ✓",
  "Cargando diccionario: rockyou2024.txt (14.3M entradas)...",
  "Configurando hilos paralelos: 8×",
  "Módulo de hash: SHA-256 activo",
  "Iniciando secuencia de ataque →",
];

const LISTA_INTENTOS = [
  "123456","password","admin","qwerty","abc123","letmein","monkey",
  "iloveyou","princess","dragon","master","sunshine","shadow","welcome",
  "654321","passw0rd","football","baseball","superman","batman",
  "Aa000001","Aa000002","Aa000003","Aa000004","Aa000005",
  "password1","Password1","P@ssword","P@ssw0rd","Admin123",
  "test1234","hello123","secure99","love2023","pass2024",
  "Aa100001","Aa100002","Ab000001","Ab000002","Ba000001",
  "ghost123","cyber2024","matrix99","darknet1","hax0r123",
];

const VELOCIDAD_ESCRITURA_MS = 80;
const DURACION_DEBIL_MS      = 5000;
const DURACION_FUERTE_MS     = 9500;
const INTENTOS_POR_TICK      = 28;   /* cada 100ms */

/* ===== ESTADO ===== */

let faseActual    = "configuracion";
let intervalos    = [];
let timeouts      = [];
let analisis      = null;
let indiceTintento = 0;

/* ===== REFERENCIAS AL DOM ===== */

const entradaContrasena    = document.getElementById("entrada-contrasena");
const botonVerContrasena   = document.getElementById("boton-ver-contrasena");
const botonIniciar         = document.getElementById("boton-iniciar");
const botonRepetir         = document.getElementById("boton-repetir");
const contenedorFortaleza  = document.getElementById("contenedor-fortaleza");
const etiquetaFortaleza    = document.getElementById("etiqueta-fortaleza");
const indicadorMayuscula   = document.getElementById("ind-mayuscula");
const indicadorNumero      = document.getElementById("ind-numero");
const indicadorSimbolo     = document.getElementById("ind-simbolo");
const indicadorLongitud    = document.getElementById("ind-longitud");
const cuerpoTerminal       = document.getElementById("cuerpo-terminal");
const metricaTiempo        = document.getElementById("metrica-tiempo");
const metricaIntento       = document.getElementById("metrica-intentos");
const progresoRelleno      = document.getElementById("progreso-relleno");
const progresoPorcentaje   = document.getElementById("progreso-porcentaje");
const tarjetaResultado     = document.getElementById("tarjeta-resultado");
const resultadoIcono       = document.getElementById("resultado-icono");
const resultadoTitulo      = document.getElementById("resultado-titulo");
const resTiempoDescifrado  = document.getElementById("res-tiempo-descifrado");
const resCombinaciones     = document.getElementById("res-combinaciones");
const resExplicacionTitulo = document.getElementById("res-explicacion-titulo");
const resExplicacionLista  = document.getElementById("res-explicacion-lista");

/* ===== ANÁLISIS DE CONTRASEÑA ===== */

/**
 * Analiza las características de seguridad de una contraseña
 * y devuelve un objeto con puntuación y tiempo estimado de descifrado.
 */
function analizarContrasena(contrasena) {
  const tieneMayuscula = /[A-Z]/.test(contrasena);
  const tieneMinuscula = /[a-z]/.test(contrasena);
  const tieneNumero    = /[0-9]/.test(contrasena);
  const tieneSimbolo   = /[^a-zA-Z0-9]/.test(contrasena);
  const esComun        = CONTRASENAS_COMUNES.has(contrasena.toLowerCase());
  const longitud       = contrasena.length;

  let puntuacion = 0;
  if (tieneMayuscula) puntuacion += 1;
  if (tieneMinuscula) puntuacion += 1;
  if (tieneNumero)    puntuacion += 1;
  if (tieneSimbolo)   puntuacion += 2;
  if (longitud >= 16) puntuacion += 2;
  else if (longitud >= 12) puntuacion += 1;
  if (longitud < 8)   puntuacion -= 2;

  const esDebil = esComun || longitud < 8 || puntuacion < 3;

  let conjuntoChar = 0;
  if (tieneMinuscula) conjuntoChar += 26;
  if (tieneMayuscula) conjuntoChar += 26;
  if (tieneNumero)    conjuntoChar += 10;
  if (tieneSimbolo)   conjuntoChar += 32;
  if (conjuntoChar === 0) conjuntoChar = 26;

  const combinaciones = Math.pow(conjuntoChar, Math.max(longitud, 1));

  let tiempoDescifrado;
  if (esComun || esDebil) tiempoDescifrado = "menos de 1 segundo";
  else if (puntuacion <= 3) tiempoDescifrado = "minutos";
  else if (puntuacion <= 4) tiempoDescifrado = "semanas";
  else if (puntuacion <= 5) tiempoDescifrado = "décadas";
  else tiempoDescifrado = "siglos";

  return {
    esDebil, puntuacion: Math.max(0, Math.min(6, puntuacion)),
    tieneMayuscula, tieneMinuscula, tieneNumero, tieneSimbolo,
    esComun, longitud, tiempoDescifrado,
    combinaciones: combinaciones.toLocaleString(),
  };
}

/* ===== ACTUALIZAR INTERFAZ DE FORTALEZA ===== */

const ETIQUETAS_FORTALEZA = ["", "Muy débil", "Débil", "Regular", "Buena", "Fuerte", "Muy fuerte"];
const COLORES_FORTALEZA   = ["", "#f92837", "#f7823e", "#ffb800", "#aadd00", "#00FD87", "#00FD87"];
const SEGMENTOS = [
  document.getElementById("segmento-1"),
  document.getElementById("segmento-2"),
  document.getElementById("segmento-3"),
  document.getElementById("segmento-4"),
  document.getElementById("segmento-5"),
];

function actualizarInterfazFortaleza(contrasena) {
  if (!contrasena) {
    contenedorFortaleza.classList.remove("fortaleza-contenedor--visible");
    botonIniciar.disabled = true;
    SEGMENTOS.forEach(seg => { seg.style.background = "rgba(255,255,255,0.08)"; });
    [indicadorMayuscula, indicadorNumero, indicadorSimbolo, indicadorLongitud]
      .forEach(ind => ind.classList.remove("indicador--activo"));
    return;
  }

  const a = analizarContrasena(contrasena);
  contenedorFortaleza.classList.add("fortaleza-contenedor--visible");
  botonIniciar.disabled = false;

  /* Actualizar segmentos */
  const segmentosActivos = Math.min(5, Math.max(1, Math.ceil((a.puntuacion / 6) * 5)));
  SEGMENTOS.forEach((seg, i) => {
    seg.style.background = i < segmentosActivos
      ? COLORES_FORTALEZA[a.puntuacion]
      : "rgba(255,255,255,0.08)";
  });

  /* Actualizar etiqueta */
  etiquetaFortaleza.textContent = ETIQUETAS_FORTALEZA[a.puntuacion] || "Muy débil";
  etiquetaFortaleza.style.color = COLORES_FORTALEZA[a.puntuacion] || "#f92837";

  /* Actualizar indicadores */
  indicadorMayuscula.classList.toggle("indicador--activo", a.tieneMayuscula);
  indicadorNumero.classList.toggle("indicador--activo", a.tieneNumero);
  indicadorSimbolo.classList.toggle("indicador--activo", a.tieneSimbolo);
  indicadorLongitud.classList.toggle("indicador--activo", a.longitud >= 8);
}

/* ===== CAMBIAR DE FASE ===== */

function cambiarFase(nombreFase) {
  faseActual = nombreFase;
  document.querySelectorAll(".fase").forEach(seccion => {
    seccion.classList.remove("fase--activa");
  });
  document.getElementById(`fase-${nombreFase}`).classList.add("fase--activa");
}

/* ===== AGREGAR LÍNEA AL TERMINAL ===== */

function agregarLineaTerminal(texto, tipo) {
  const linea = document.createElement("div");
  linea.className = `linea-terminal linea-terminal--${tipo}`;
  linea.textContent = texto;
  cuerpoTerminal.appendChild(linea);
  cuerpoTerminal.scrollTop = cuerpoTerminal.scrollHeight;
}

/* ===== LIMPIAR TIMERS ===== */

function limpiarTimers() {
  intervalos.forEach(clearInterval);
  timeouts.forEach(clearTimeout);
  intervalos = [];
  timeouts   = [];
}

/* ===== FORMATEAR TIEMPO ===== */

function formatearTiempo(ms) {
  const seg = Math.floor(ms / 1000);
  const min = Math.floor(seg / 60);
  const dec = Math.floor((ms % 1000) / 10);
  return `${String(min).padStart(2, "0")}:${String(seg % 60).padStart(2, "0")}.${String(dec).padStart(2, "0")}`;
}

/* ===== INICIAR SIMULACIÓN ===== */

function iniciarSimulacion() {
  const contrasena = entradaContrasena.value.trim();
  if (!contrasena) return;

  analisis = analizarContrasena(contrasena);
  indiceTintento = 0;
  limpiarTimers();
  cuerpoTerminal.innerHTML = "";

  cambiarFase("ejecutando");

  const duracion = analisis.esDebil ? DURACION_DEBIL_MS : DURACION_FUERTE_MS;
  let tiempoTranscurrido = 0;
  let intentosTotales    = 0;

  /* Métricas en tiempo real */
  const intervaloMetricas = setInterval(() => {
    tiempoTranscurrido += 100;
    intentosTotales    += INTENTOS_POR_TICK;
    metricaTiempo.textContent  = formatearTiempo(tiempoTranscurrido);
    metricaIntento.textContent = intentosTotales.toLocaleString();
    const pct = Math.min(100, (tiempoTranscurrido / duracion) * 100);
    progresoRelleno.style.width = pct + "%";
    progresoPorcentaje.textContent = Math.floor(pct) + "%";
  }, 100);
  intervalos.push(intervaloMetricas);

  /* Mensajes de inicio */
  MENSAJES_INICIO.forEach((mensaje, i) => {
    const to = setTimeout(() => {
      agregarLineaTerminal(`[INIT] ${mensaje}`, "init");
    }, i * 320);
    timeouts.push(to);
  });

  /* Intentos de contraseña */
  const toInicioIntentos = setTimeout(() => {
    const intervaloIntentos = setInterval(() => {
      const candidata = LISTA_INTENTOS[indiceTintento % LISTA_INTENTOS.length];
      indiceTintento++;
      agregarLineaTerminal(`[ATTEMPT] ${candidata}`, "intento");
    }, VELOCIDAD_ESCRITURA_MS);
    intervalos.push(intervaloIntentos);
  }, MENSAJES_INICIO.length * 320 + 200);
  timeouts.push(toInicioIntentos);

  /* Fin de la simulación */
  const toFin = setTimeout(() => {
    limpiarTimers();

    if (analisis.esDebil) {
      agregarLineaTerminal(`[ATTEMPT] ${contrasena}`, "intento");
      const toEncontrada = setTimeout(() => {
        agregarLineaTerminal(`[!!] CONTRASEÑA ENCONTRADA: "${contrasena}"`, "encontrado");
        setTimeout(() => mostrarResultado(contrasena, true), 1200);
      }, 400);
      timeouts.push(toEncontrada);
    } else {
      agregarLineaTerminal("[!!] TIEMPO DE ATAQUE AGOTADO — contraseña no encontrada", "timeout");
      setTimeout(() => mostrarResultado(contrasena, false), 1200);
    }
  }, duracion);
  timeouts.push(toFin);
}

/* ===== MOSTRAR RESULTADO ===== */

function mostrarResultado(contrasena, fueCrackeada) {
  cambiarFase("resultado");

  if (fueCrackeada) {
    tarjetaResultado.className = "tarjeta-resultado tarjeta-resultado--rojo";
    resultadoIcono.textContent = "✗";
    resultadoTitulo.textContent = "Contraseña encontrada";

    resTiempoDescifrado.textContent = analisis.tiempoDescifrado;
    resCombinaciones.textContent = analisis.combinaciones + " combinaciones";

    resExplicacionTitulo.textContent = "// ¿Por qué fue vulnerable?";
    const razones = [];
    if (analisis.esComun) razones.push("La contraseña está en diccionarios de contraseñas conocidas.");
    if (analisis.longitud < 8) razones.push("Es demasiado corta (menos de 8 caracteres).");
    if (!analisis.tieneMayuscula) razones.push("No contiene letras mayúsculas.");
    if (!analisis.tieneNumero) razones.push("No contiene números.");
    if (!analisis.tieneSimbolo) razones.push("No contiene símbolos especiales.");
    razones.push("Recomendación: usa al menos 16 caracteres con mayúsculas, números y símbolos.");
    resExplicacionLista.innerHTML = razones.map(r => `<li>${r}</li>`).join("");
  } else {
    tarjetaResultado.className = "tarjeta-resultado tarjeta-resultado--verde";
    resultadoIcono.textContent = "✓";
    resultadoTitulo.textContent = "No fue posible descifrar la contraseña";

    resTiempoDescifrado.textContent = analisis.tiempoDescifrado;
    resCombinaciones.textContent = analisis.combinaciones + " combinaciones";

    resExplicacionTitulo.textContent = "// ¿Qué la hace segura?";
    const fortalezas = [];
    if (analisis.tieneMayuscula) fortalezas.push("Contiene letras mayúsculas ✓");
    if (analisis.tieneMinuscula) fortalezas.push("Contiene letras minúsculas ✓");
    if (analisis.tieneNumero) fortalezas.push("Contiene números ✓");
    if (analisis.tieneSimbolo) fortalezas.push("Contiene símbolos especiales ✓");
    if (analisis.longitud >= 12) fortalezas.push(`Longitud de ${analisis.longitud} caracteres ✓`);
    fortalezas.push("Consejo: usa un gestor de contraseñas para recordar claves complejas.");
    resExplicacionLista.innerHTML = fortalezas.map(r => `<li>${r}</li>`).join("");
  }
}

/* ===== REINICIAR ===== */

function reiniciar() {
  limpiarTimers();
  entradaContrasena.value = "";
  actualizarInterfazFortaleza("");
  cuerpoTerminal.innerHTML = "";
  metricaTiempo.textContent  = "00:00.00";
  metricaIntento.textContent = "0";
  progresoRelleno.style.width = "0%";
  progresoPorcentaje.textContent = "0%";
  cambiarFase("configuracion");
}

/* ===== INICIALIZACIÓN ===== */

function inicializar() {
  entradaContrasena.addEventListener("input", () => {
    actualizarInterfazFortaleza(entradaContrasena.value);
  });

  botonVerContrasena.addEventListener("click", () => {
    const esContrasena = entradaContrasena.type === "password";
    entradaContrasena.type = esContrasena ? "text" : "password";
    botonVerContrasena.textContent = esContrasena ? "🙈" : "👁";
  });

  botonIniciar.addEventListener("click", iniciarSimulacion);
  botonRepetir.addEventListener("click", reiniciar);
}

document.addEventListener("DOMContentLoaded", inicializar);
