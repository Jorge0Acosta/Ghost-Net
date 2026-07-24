/* ===================================================
   DESCARGA.JS — Simulador de Descarga Segura
   =================================================== */

/* ===== CONSTANTES ===== */

const DATOS_URLS = {
  oficial: {
    url: "videolan.org",
    esOficial: true,
    candado: "🔒",
    pestana: "VLC media player — VideoLAN",
    sitio: "sitio-oficial",
    nombreMostrado: "videolan.org",
  },
  falso1: {
    url: "vlc-download.net",
    esOficial: false,
    candado: "🔒",
    pestana: "VLC Download — vlc-download.net",
    sitio: "sitio-falso",
    nombreMostrado: "vlc-download.net",
  },
  falso2: {
    url: "vlcpremium.com",
    esOficial: false,
    candado: "🔓",
    pestana: "VLC Premium Free — vlcpremium.com",
    sitio: "sitio-falso",
    nombreMostrado: "vlcpremium.com",
  },
  falso3: {
    url: "vlc-player-free.org",
    esOficial: false,
    candado: "🔓",
    pestana: "VLC Player GRATIS — vlc-player-free.org",
    sitio: "sitio-falso",
    nombreMostrado: "vlc-player-free.org",
  },
};

const LISTA_MALWARE = ["Spyware", "Troyano", "Keylogger", "Adware"];

/* ===== ESTADO ===== */

let urlSeleccionada     = null;
let tipoBotonClickeado  = null;  /* 'oficial' | 'anuncio' */
let intervalos          = [];
let timeouts            = [];

/* ===== REFERENCIAS AL DOM ===== */

const navCandado       = document.getElementById("nav-candado");
const navDireccion     = document.getElementById("nav-direccion");
const navPestana       = document.getElementById("nav-pestana");
const navContenido     = document.getElementById("navegador-contenido");
const barraDescarga    = document.getElementById("barra-descarga");
const pctDescarga      = document.getElementById("pct-descarga");
const barraInstalacion = document.getElementById("barra-instalacion");
const pctInstalacion   = document.getElementById("pct-instalacion");
const pasoDescargando  = document.getElementById("paso-descargando");
const pasoVerificando  = document.getElementById("paso-verificando");
const pasoInstalando   = document.getElementById("paso-instalando");
const malwareLista     = document.getElementById("malware-lista");
const botonReintentar  = document.getElementById("boton-reintentar");
const falsoNombreSitio = document.getElementById("falso-nombre-sitio");

/* ===== LIMPIAR TIMERS ===== */

function limpiarTimers() {
  intervalos.forEach(clearInterval);
  timeouts.forEach(clearTimeout);
  intervalos = [];
  timeouts   = [];
}

/* ===== CAMBIAR DE FASE ===== */

function cambiarFase(nombreFase) {
  document.querySelectorAll(".fase").forEach(s => s.classList.remove("fase--activa"));
  document.getElementById(`fase-${nombreFase}`).classList.add("fase--activa");
}

/* ===== IR AL SITIO ===== */

function irAlSitio(idUrl) {
  const datos = DATOS_URLS[idUrl];
  urlSeleccionada    = datos;
  tipoBotonClickeado = null;

  /* Actualizar chrome del navegador */
  navCandado.textContent    = datos.candado;
  navDireccion.textContent  = datos.url;
  navPestana.textContent    = datos.pestana;

  /* Mostrar el sitio correcto */
  document.querySelectorAll(".sitio-web").forEach(s => {
    s.classList.remove("sitio-web--visible");
    s.classList.add("sitio-web--oculto");
  });

  const sitio = document.getElementById(datos.sitio);
  sitio.classList.remove("sitio-web--oculto");
  sitio.classList.add("sitio-web--visible");

  /* Si es sitio falso, actualizar nombre */
  if (!datos.esOficial && falsoNombreSitio) {
    falsoNombreSitio.textContent = datos.nombreMostrado;
  }

  cambiarFase("navegador");
}

/* ===== MANEJAR CLICK EN BOTÓN DE DESCARGA ===== */

function manejarDescarga(tipoClic) {
  tipoBotonClickeado = tipoClic;
  limpiarTimers();
  iniciarAnimacionDescarga();
}

/* ===== ANIMACIÓN DE DESCARGA ===== */

function iniciarAnimacionDescarga() {
  cambiarFase("descargando");

  /* Reset visual */
  barraDescarga.style.width    = "0%";
  pctDescarga.textContent      = "0%";
  barraInstalacion.style.width = "0%";
  pctInstalacion.textContent   = "0%";
  pasoDescargando.classList.remove("descarga-paso--oculto");
  pasoVerificando.classList.add("descarga-paso--oculto");
  pasoInstalando.classList.add("descarga-paso--oculto");

  let progresoDl = 0;

  /* Fase: descarga */
  const intervaloDl = setInterval(() => {
    progresoDl += 2.5;
    barraDescarga.style.width = Math.min(progresoDl, 100) + "%";
    pctDescarga.textContent   = Math.min(Math.floor(progresoDl), 100) + "%";

    if (progresoDl >= 100) {
      clearInterval(intervaloDl);

      /* Fase: verificando */
      const toVerif = setTimeout(() => {
        pasoDescargando.classList.add("descarga-paso--oculto");
        pasoVerificando.classList.remove("descarga-paso--oculto");

        /* Fase: instalando */
        const toInst = setTimeout(() => {
          pasoVerificando.classList.add("descarga-paso--oculto");
          pasoInstalando.classList.remove("descarga-paso--oculto");

          let progresoInst = 0;
          const intervaloInst = setInterval(() => {
            progresoInst += 4;
            barraInstalacion.style.width = Math.min(progresoInst, 100) + "%";
            pctInstalacion.textContent   = Math.min(Math.floor(progresoInst), 100) + "%";

            if (progresoInst >= 100) {
              clearInterval(intervaloInst);

              /* Mostrar resultado */
              const toRes = setTimeout(mostrarResultadoDescarga, 600);
              timeouts.push(toRes);
            }
          }, 60);
          intervalos.push(intervaloInst);
        }, 1000);
        timeouts.push(toInst);
      }, 1000);
      timeouts.push(toVerif);
    }
  }, 50);
  intervalos.push(intervaloDl);
}

/* ===== MOSTRAR RESULTADO ===== */

function mostrarResultadoDescarga() {
  cambiarFase("resultado-descarga");

  const tarjeta      = document.getElementById("tarjeta-resultado-descarga");
  const icono        = document.getElementById("res-desc-icono");
  const titulo       = document.getElementById("res-desc-titulo");
  const subtitulo    = document.getElementById("res-desc-subtitulo");
  const dondeTitulo  = document.getElementById("res-donde-titulo");
  const dondeTexto   = document.getElementById("res-donde-texto");
  const comoLista    = document.getElementById("res-como-lista");

  malwareLista.innerHTML = "";

  const esOficial    = urlSeleccionada && urlSeleccionada.esOficial;
  const esBotonReal  = tipoBotonClickeado === "oficial";

  let tipoResultado;
  if (!esOficial) {
    tipoResultado = "malware";
  } else if (esOficial && esBotonReal) {
    tipoResultado = "seguro";
  } else {
    tipoResultado = "anuncio";
  }

  /* Aplicar estilos por tipo */
  tarjeta.className = "resultado-descarga";

  if (tipoResultado === "seguro") {
    tarjeta.classList.add("resultado-descarga--verde");
    icono.textContent     = "✓";
    titulo.textContent    = "Archivo verificado. Instalación segura.";
    subtitulo.textContent = "No se detectaron amenazas en el archivo descargado.";
    dondeTitulo.textContent = "// ¿Por qué fue la decisión correcta?";
    dondeTexto.textContent = "Seleccionaste el dominio oficial (videolan.org) y descargaste desde el botón oficial del sitio. El archivo es legítimo y seguro.";
    comoLista.innerHTML = `
      <li>Siempre descarga software desde el sitio oficial del desarrollador</li>
      <li>Verifica que el dominio sea exactamente el correcto (sin guiones ni palabras extra)</li>
      <li>Usa el botón principal de descarga, no banners ni anuncios laterales</li>
    `;

  } else if (tipoResultado === "anuncio") {
    tarjeta.classList.add("resultado-descarga--amarillo");
    icono.textContent     = "⚠";
    titulo.textContent    = "El sitio era legítimo, pero descargaste desde un anuncio.";
    subtitulo.textContent = "Muchos sitios oficiales muestran publicidad que imita los botones de descarga.";
    dondeTitulo.textContent = "// ¿Dónde estuvo el error?";
    dondeTexto.textContent = "Accediste al sitio correcto (videolan.org), pero hiciste clic en un anuncio que imitaba el botón oficial. Este tipo de publicidad puede llevar a descargas maliciosas.";
    comoLista.innerHTML = `
      <li>Lee el contenido de la página completo antes de hacer clic en un botón de descarga</li>
      <li>El botón oficial generalmente tiene información clara sobre versión y tamaño del archivo</li>
      <li>Los anuncios suelen tener textos como "GRATIS", "RÁPIDO" o estrellas de valoración</li>
      <li>Busca si el botón dice "Publicidad" o "Patrocinado" cerca de él</li>
    `;

  } else {
    tarjeta.classList.add("resultado-descarga--rojo");
    icono.textContent     = "✗";
    titulo.textContent    = "El archivo contenía software malicioso.";
    subtitulo.textContent = "Se detectaron las siguientes amenazas durante el análisis del archivo:";
    dondeTitulo.textContent = "// ¿Dónde estuvo el error?";
    dondeTexto.textContent = `Accediste a "${urlSeleccionada.url}", un sitio que imita al oficial (videolan.org). Los dominios falsos copian el diseño para engañar al usuario. El dominio oficial es SOLO videolan.org.`;
    comoLista.innerHTML = `
      <li>Verifica cuidadosamente el dominio completo antes de descargar (videolan.org ≠ vlc-download.net)</li>
      <li>Un dominio oficial nunca tiene guiones extras ni palabras adicionales como "free", "download", "premium"</li>
      <li>Busca el sitio en Google y entra desde el primer resultado orgánico, no desde anuncios</li>
      <li>Comprueba que el sitio tenga certificado SSL (🔒) y sea el dominio exacto del desarrollador</li>
    `;

    /* Mostrar malware uno por uno */
    LISTA_MALWARE.forEach((malware, i) => {
      const toMalware = setTimeout(() => {
        const item = document.createElement("div");
        item.className = "malware-item";
        item.style.animationDelay = "0ms";
        item.innerHTML = `<span>✗</span> <strong>${malware}</strong> detectado e instalado`;
        malwareLista.appendChild(item);
      }, i * 500);
      timeouts.push(toMalware);
    });
  }
}

/* ===== REINICIAR ===== */

function reiniciarDescarga() {
  limpiarTimers();
  urlSeleccionada    = null;
  tipoBotonClickeado = null;
  malwareLista.innerHTML = "";

  /* Ocultar todos los sitios */
  document.querySelectorAll(".sitio-web").forEach(s => {
    s.classList.remove("sitio-web--visible");
    s.classList.add("sitio-web--oculto");
  });

  cambiarFase("url");
}

/* ===== INICIALIZACIÓN ===== */

function inicializar() {
  /* Botones de selección de URL */
  document.querySelectorAll(".tarjeta-url").forEach(tarjeta => {
    tarjeta.addEventListener("click", () => {
      irAlSitio(tarjeta.dataset.urlId);
    });
  });

  /* Botón de descarga OFICIAL */
  const btnOficial = document.getElementById("btn-descarga-oficial");
  if (btnOficial) {
    btnOficial.addEventListener("click", () => manejarDescarga("oficial"));
  }

  /* Botones de ANUNCIO en sitio oficial */
  ["anuncio-top", "anuncio-inline", "anuncio-lateral"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => manejarDescarga("anuncio"));
  });

  /* Botones del sitio FALSO */
  ["btn-popup", "btn-falso-1", "btn-falso-2", "btn-falso-3", "btn-falso-4"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => manejarDescarga("anuncio"));
  });

  /* Botón reiniciar */
  botonReintentar.addEventListener("click", reiniciarDescarga);
}

document.addEventListener("DOMContentLoaded", inicializar);