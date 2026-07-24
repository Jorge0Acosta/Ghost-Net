/* ===================================================
   INICIO.JS — Comportamiento de la página de inicio
   =================================================== */

/* ===== CONSTANTES ===== */

const LINEAS_TERMINAL = [
  "$ ghost-net --init",
  "Conectando a red segura...",
  "Analizando vulnerabilidades...",
  "Escaneando brechas de datos...",
  "Sistema listo. Bienvenido.",
];

const VELOCIDAD_ESCRITURA = 38;   /* milisegundos por carácter */
const PAUSA_ENTRE_LINEAS  = 220;  /* milisegundos entre líneas */

/* ===== REFERENCIAS AL DOM ===== */

const elementoTextoTerminal       = document.getElementById("texto-terminal");
const elementoCursorTerminal      = document.getElementById("cursor-terminal");
const elementoEstadisticasTerminal = document.getElementById("estadisticas-terminal");

/* ===== ESTADO INTERNO ===== */

let indiceFila     = 0;
let indiceCaracter = 0;
let textoAcumulado = "";

/* ===== ANIMACIÓN DE TERMINAL ===== */

/**
 * Escribe el texto de la terminal carácter a carácter.
 * Cuando termina todas las líneas, oculta el cursor y
 * muestra el panel de estadísticas.
 */
function escribirTerminal() {
  /* Todas las líneas completadas */
  if (indiceFila >= LINEAS_TERMINAL.length) {
    elementoCursorTerminal.style.display      = "none";
    elementoEstadisticasTerminal.style.display = "block";
    return;
  }

  const lineaActual = LINEAS_TERMINAL[indiceFila];

  /* Aún hay caracteres en la línea actual */
  if (indiceCaracter < lineaActual.length) {
    textoAcumulado += lineaActual[indiceCaracter];
    elementoTextoTerminal.textContent = textoAcumulado;
    indiceCaracter++;
    setTimeout(escribirTerminal, VELOCIDAD_ESCRITURA);

  /* Línea terminada — pasar a la siguiente */
  } else {
    textoAcumulado += "\n";
    elementoTextoTerminal.textContent = textoAcumulado;
    indiceFila++;
    indiceCaracter = 0;
    setTimeout(escribirTerminal, PAUSA_ENTRE_LINEAS);
  }
}

/* ===== EFECTO HOVER EN TARJETAS DE MÓDULO ===== */

/**
 * Aplica efecto de elevación visual a cada tarjeta
 * de módulo al pasar el cursor.
 */
function inicializarHoverTarjetas() {
  const tarjetas = document.querySelectorAll(".tarjeta-modulo");

  tarjetas.forEach(function(tarjeta) {
    tarjeta.addEventListener("mouseenter", function() {
      tarjeta.classList.add("tarjeta-modulo--elevada");
    });

    tarjeta.addEventListener("mouseleave", function() {
      tarjeta.classList.remove("tarjeta-modulo--elevada");
    });
  });
}

 //INICIALIZACIÓN 


 //Punto de entrada principal.
 //Se ejecuta cuando el DOM está completamente cargado.
 
function inicializar() {
  escribirTerminal();
  inicializarHoverTarjetas();
}

document.addEventListener("DOMContentLoaded", inicializar);
