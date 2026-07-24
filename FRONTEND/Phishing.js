/* ===================================================
   PHISHING.JS — Simulador de Detección de Phishing
   =================================================== */

/* ===== ÁRBOLES DE CONVERSACIÓN ===== */

const ARBOL_BANCO = {
  inicio: {
    mensajes: [
      "Estimado cliente, detectamos un movimiento inusual de $4,850 en su cuenta.",
      "Para evitar el bloqueo de su tarjeta, verifique su identidad en las próximas 2 horas:",
      "🔗 seguridad.banco-nacional-mx.co/verificar-cuenta",
    ],
    opciones: [
      { texto: "Abrir el enlace",           siguienteNodo: "enlace_abierto",  esError: true },
      { texto: "Ignorar el mensaje",        siguienteNodo: "ignorado",        esError: false },
      { texto: "Llamar al banco directamente", siguienteNodo: "llamado",     esError: false },
    ],
  },
  enlace_abierto: {
    mensajes: [
      "Abriendo enlace...",
      "Formulario: Ingresa número de cuenta, contraseña y código PIN para verificar identidad.",
      "Gracias. Tu información ha sido recibida.",
    ],
    esError: true,
    esTerminal: true,
  },
  ignorado: {
    mensajes: ["No abriste el enlace. Acción correcta ✓"],
    esTerminal: true,
  },
  llamado: {
    mensajes: [
      "Agente: Le confirmamos que NOSOTROS NO enviamos ese mensaje.",
      "Agente: Es un intento de phishing. No abra el enlace y repórtelo.",
    ],
    esTerminal: true,
  },
};

const ARBOL_RECLUTADOR = {
  inicio: {
    mensajes: [
      "Hola! Encontré tu perfil. Tenemos una vacante: Desarrollador Senior — $8,500 USD/mes, 100% remoto 🚀",
      "Necesito: foto de INE o pasaporte, CURP y referencia bancaria. Es el procedimiento estándar antes de la entrevista. ¿Puedes hoy?",
    ],
    opciones: [
      { texto: "Enviar mis documentos",                  siguienteNodo: "documentos_enviados", esError: true },
      { texto: "Pedir información de la empresa primero", siguienteNodo: "pedir_info",         esError: false },
      { texto: "Ignorar",                                siguienteNodo: "ignorado",            esError: false },
    ],
  },
  pedir_info: {
    mensajes: [
      "Somos TechGlobal Solutions, empresa en Delaware. Los docs son para verificar elegibilidad legal. La vacante se llena esta semana 😊",
    ],
    opciones: [
      { texto: "Enviar los documentos ahora",    siguienteNodo: "documentos_enviados", esError: true },
      { texto: "Buscar la empresa en Google primero", siguienteNodo: "buscado",        esError: false },
    ],
  },
  documentos_enviados: {
    mensajes: ["¡Perfecto! Muchas gracias. Te contactaremos pronto.", "..."],
    esError: true,
    esTerminal: true,
  },
  buscado: {
    mensajes: [
      "No encuentras resultados verificables de TechGlobal Solutions. El dominio del correo fue registrado hace 2 semanas. Señal de alerta.",
    ],
    esTerminal: true,
  },
  ignorado: {
    mensajes: ["Decidiste no responder. Acción correcta ✓"],
    esTerminal: true,
  },
};

const ARBOL_MAMA = {
  inicio: {
    mensajes: [
      "Hola mi amor 💙 perdí el celular 😭 Estoy usando el de una amiga.",
      "Necesito el código de 6 dígitos que te llegó por SMS. Es para recuperar mi WhatsApp. ¿Me lo mandas rápido? 🙏",
    ],
    opciones: [
      { texto: "Compartir el código",              siguienteNodo: "codigo_compartido", esError: true },
      { texto: "Llamar al número habitual de mamá", siguienteNodo: "llamado",          esError: false },
      { texto: "Preguntar algo que solo ella sabría", siguienteNodo: "verificar",      esError: false },
    ],
  },
  verificar: {
    mensajes: [
      "Ehh... es que estoy muy nerviosa, no recuerdo bien. Solo mándame el código, urgente por favor",
    ],
    opciones: [
      { texto: "Compartir el código de todas formas", siguienteNodo: "codigo_compartido", esError: true },
      { texto: "Es phishing — colgar",               siguienteNodo: "rechazado",         esError: false },
    ],
  },
  codigo_compartido: {
    mensajes: ["Gracias!! 🙏", "..."],
    esError: true,
    esTerminal: true,
  },
  llamado: {
    mensajes: [
      "Mamá: ¿Hola? Yo tengo mi teléfono aquí, no te escribí nada...",
      "Mamá: Eso es una estafa mi amor. Gracias por llamar antes de hacer algo.",
    ],
    esTerminal: true,
  },
  rechazado: {
    mensajes: ["Decidiste no compartir el código. Acción correcta ✓"],
    esTerminal: true,
  },
};

const ARBOLES = {
  banco:      ARBOL_BANCO,
  reclutador: ARBOL_RECLUTADOR,
  mama:       ARBOL_MAMA,
};

const EXPLICACIONES = {
  banco: {
    error: "Suplantación de identidad bancaria. El enlace lleva a un sitio falso que roba tus credenciales bancarias. Los bancos NUNCA piden datos a través de mensajes ni enlaces.",
    consejos: [
      "Nunca abras enlaces de mensajes de alerta bancaria — llama directamente al número oficial",
      "Verifica que el dominio sea exactamente el oficial (banco-nacional-mx.co es falso)",
      "Los bancos nunca solicitan PIN ni contraseñas por ningún canal digital",
    ],
  },
  reclutador: {
    error: "Fraude laboral. Solicitar documentos oficiales antes de una entrevista es robo de identidad. Las empresas legítimas verifican en persona o mediante plataformas oficiales.",
    consejos: [
      "Busca la empresa en LinkedIn, Google Maps y registros oficiales antes de compartir nada",
      "Nunca envíes documentos de identidad sin verificar la legitimidad de la oferta",
      "Las vacantes urgentes con salarios muy altos son señales clásicas de fraude",
    ],
  },
  mama: {
    error: "Ingeniería social por urgencia emocional. El atacante se hace pasar por un familiar en crisis para obtener un código OTP que le permite tomar control de cuentas de WhatsApp u otras apps.",
    consejos: [
      "Nunca compartas códigos SMS con nadie — son de uso exclusivo e intransferible",
      "Ante urgencias familiares sospechosas, llama al número habitual directamente",
      "Haz preguntas de verificación que solo la persona real pueda responder",
    ],
  },
};

const INFO_CONTACTOS = {
  banco:      { nombre: "BancoNacional", avatar: "🏦", claseAvatar: "mini-avatar--azul" },
  reclutador: { nombre: "Carlos M. — Reclutador", avatar: "👔", claseAvatar: "mini-avatar--morado" },
  mama:       { nombre: "Mamá 💙", avatar: "👩", claseAvatar: "mini-avatar--verde" },
};

/* ===== ESTADO ===== */

let conversacionActiva = null;
let nodoActual         = "inicio";
let decisiones         = [];
let timeouts           = [];

/* ===== REFERENCIAS AL DOM ===== */

const faseBandeja    = document.getElementById("fase-bandeja");
const faseChat       = document.getElementById("fase-chat");
const faseResultado  = document.getElementById("fase-resultado-phishing");
const chatMensajes   = document.getElementById("chat-mensajes");
const chatOpciones   = document.getElementById("chat-opciones");
const chatNombre     = document.getElementById("chat-nombre");
const chatAvatar     = document.getElementById("chat-avatar");
const chatEstado     = document.getElementById("chat-estado");
const botonRepetir   = document.getElementById("boton-repetir-phi");

/* ===== CAMBIAR DE FASE ===== */

function cambiarFase(nombreFase) {
  document.querySelectorAll(".fase").forEach(s => s.classList.remove("fase--activa"));
  document.getElementById(`fase-${nombreFase}`).classList.add("fase--activa");
}

/* ===== LIMPIAR TIMERS ===== */

function limpiarTimers() {
  timeouts.forEach(clearTimeout);
  timeouts = [];
}

/* ===== ABRIR CONVERSACIÓN ===== */

function abrirConversacion(idConversacion) {
  limpiarTimers();
  conversacionActiva = idConversacion;
  nodoActual         = "inicio";
  decisiones         = [];

  const info = INFO_CONTACTOS[idConversacion];
  chatNombre.textContent = info.nombre;
  chatAvatar.textContent = info.avatar;
  chatAvatar.className   = `chat-avatar ${info.claseAvatar.replace("mini-", "contacto-")}`;
  chatEstado.textContent = "en línea";

  /* Actualizar mini-contactos activos */
  document.querySelectorAll(".mini-contacto").forEach(btn => {
    btn.classList.toggle(
      "mini-contacto--activo",
      btn.dataset.conversacion === idConversacion
    );
  });

  chatMensajes.innerHTML = "";
  chatOpciones.innerHTML = "";

  cambiarFase("chat");

  /* Iniciar la reproducción del nodo */
  const to = setTimeout(() => reproducirNodo("inicio"), 300);
  timeouts.push(to);
}

/* ===== REPRODUCIR UN NODO ===== */

function reproducirNodo(idNodo) {
  nodoActual = idNodo;
  const arbol = ARBOLES[conversacionActiva];
  const nodo  = arbol[idNodo];
  if (!nodo) return;

  chatOpciones.innerHTML = "";
  mostrarIndicadorEscritura();

  let demora = 800;

  nodo.mensajes.forEach((mensaje, i) => {
    const toMensaje = setTimeout(() => {
      ocultarIndicadorEscritura();
      agregarBurbuja(mensaje);

      const esUltimo = i === nodo.mensajes.length - 1;

      if (!esUltimo) {
        const toEscritura = setTimeout(mostrarIndicadorEscritura, 250);
        timeouts.push(toEscritura);
      } else {
        if (nodo.opciones && nodo.opciones.length > 0) {
          const toOpciones = setTimeout(() => mostrarOpciones(nodo.opciones), 500);
          timeouts.push(toOpciones);
        } else if (nodo.esTerminal) {
          const toResultado = setTimeout(() => {
            if (nodo.esError) decisiones.push({ texto: "Acción tomada", esError: true });
            mostrarResultadoPhishing();
          }, 1400);
          timeouts.push(toResultado);
        }
      }
    }, demora);

    timeouts.push(toMensaje);
    demora += 1000 + Math.random() * 400;
  });
}

/* ===== BURBUJA DE MENSAJE ===== */

function agregarBurbuja(texto) {
  const burbuja = document.createElement("div");
  burbuja.className = "burbuja burbuja--otro";

  const avatarDiv = document.createElement("div");
  avatarDiv.className = "burbuja__avatar";
  const info = INFO_CONTACTOS[conversacionActiva];
  avatarDiv.textContent = info.avatar;

  const textoDiv = document.createElement("div");
  textoDiv.className = "burbuja__texto";
  textoDiv.textContent = texto;

  burbuja.appendChild(avatarDiv);
  burbuja.appendChild(textoDiv);
  chatMensajes.appendChild(burbuja);
  chatMensajes.scrollTop = chatMensajes.scrollHeight;
}

/* ===== INDICADOR DE ESCRITURA ===== */

function mostrarIndicadorEscritura() {
  ocultarIndicadorEscritura();
  const indicador = document.createElement("div");
  indicador.className = "indicador-escritura";
  indicador.id = "indicador-activo";

  const info = INFO_CONTACTOS[conversacionActiva];
  const avatarDiv = document.createElement("div");
  avatarDiv.className = "burbuja__avatar";
  avatarDiv.textContent = info.avatar;

  const burbuja = document.createElement("div");
  burbuja.className = "indicador-escritura__burbuja";
  for (let i = 0; i < 3; i++) {
    const punto = document.createElement("div");
    punto.className = "indicador-escritura__punto";
    burbuja.appendChild(punto);
  }

  indicador.appendChild(avatarDiv);
  indicador.appendChild(burbuja);
  chatMensajes.appendChild(indicador);
  chatMensajes.scrollTop = chatMensajes.scrollHeight;
  chatEstado.textContent = "escribiendo...";
}

function ocultarIndicadorEscritura() {
  const indicador = document.getElementById("indicador-activo");
  if (indicador) indicador.remove();
  chatEstado.textContent = "en línea";
}

/* ===== MOSTRAR OPCIONES ===== */

function mostrarOpciones(opciones) {
  chatOpciones.innerHTML = "";
  opciones.forEach((opcion, i) => {
    const boton = document.createElement("button");
    boton.className = "boton-opcion";
    boton.textContent = opcion.texto;
    boton.style.animationDelay = (i * 70) + "ms";
    boton.type = "button";

    boton.addEventListener("click", () => {
      decisiones.push({ texto: opcion.texto, esError: !!opcion.esError });
      chatOpciones.innerHTML = "";

      /* Mostrar la decisión tomada como burbuja propia */
      const burbujaPropia = document.createElement("div");
      burbujaPropia.className = "burbuja burbuja--propia";
      burbujaPropia.style.justifyContent = "flex-end";
      burbujaPropia.style.animation = "aparecerMensaje 0.2s ease both";
      const textoDiv = document.createElement("div");
      textoDiv.className = "burbuja__texto";
      textoDiv.style.background = "rgba(0,200,251,0.12)";
      textoDiv.style.border = "1px solid rgba(0,200,251,0.25)";
      textoDiv.style.color = "#e2f0f7";
      textoDiv.textContent = opcion.texto;
      burbujaPropia.appendChild(textoDiv);
      chatMensajes.appendChild(burbujaPropia);
      chatMensajes.scrollTop = chatMensajes.scrollHeight;

      const arbol = ARBOLES[conversacionActiva];
      const siguienteNodo = arbol[opcion.siguienteNodo];

      if (siguienteNodo) {
        const to = setTimeout(() => reproducirNodo(opcion.siguienteNodo), 500);
        timeouts.push(to);
      }
    });

    chatOpciones.appendChild(boton);
  });
}

/* ===== MOSTRAR RESULTADO ===== */

function mostrarResultadoPhishing() {
  cambiarFase("resultado-phishing");

  const errores  = decisiones.filter(d => d.esError).length;
  const correctas = decisiones.filter(d => !d.esError).length;
  const nivel    = errores === 0 ? "Bajo" : errores === 1 ? "Medio" : "Alto";
  const info     = INFO_CONTACTOS[conversacionActiva];
  const expl     = EXPLICACIONES[conversacionActiva];

  /* Icono y nivel */
  document.getElementById("res-phi-icono").textContent = errores === 0 ? "✓" : "⚠";
  const nivelEl = document.getElementById("res-phi-nivel");
  nivelEl.textContent = `Nivel de riesgo: ${nivel}`;
  nivelEl.className   = `resultado-phishing__nivel nivel--${nivel.toLowerCase()}`;

  /* Conversación con */
  const tituloEl = document.querySelector(".resultado-phishing__titulo");
  tituloEl.textContent = `Análisis: ${info.nombre}`;

  /* Decisiones */
  const decisionesEl = document.getElementById("res-phi-decisiones");
  decisionesEl.innerHTML = decisiones.map(d =>
    `<div class="decision-item decision-item--${d.esError ? "error" : "ok"}">
      <span class="decision-item__icono">${d.esError ? "✗" : "✓"}</span>
      <span>${d.texto}</span>
    </div>`
  ).join("") || `<div class="decision-item decision-item--ok"><span class="decision-item__icono">✓</span><span>Evitaste el ataque correctamente.</span></div>`;

  /* ¿Dónde estuvo el error? */
  const explicacionEl = document.getElementById("res-phi-explicacion");
  if (errores > 0) {
    explicacionEl.style.display = "block";
    document.getElementById("res-phi-donde").textContent = expl.error;
  } else {
    explicacionEl.style.display = "none";
  }

  /* Consejos */
  document.getElementById("res-phi-consejos").innerHTML =
    expl.consejos.map(c => `<li>${c}</li>`).join("");
}

/* ===== REINICIAR ===== */

function reiniciarPhishing() {
  limpiarTimers();
  conversacionActiva = null;
  decisiones         = [];
  chatMensajes.innerHTML  = "";
  chatOpciones.innerHTML  = "";
  cambiarFase("bandeja");
}

/* ===== INICIALIZACIÓN ===== */

function inicializar() {
  /* Abrir conversaciones desde bandeja */
  document.querySelectorAll(".tarjeta-contacto").forEach(tarjeta => {
    tarjeta.addEventListener("click", () => {
      abrirConversacion(tarjeta.dataset.conversacion);
    });
  });

  /* Mini-contactos del panel izquierdo */
  document.querySelectorAll(".mini-contacto").forEach(btn => {
    btn.addEventListener("click", () => {
      abrirConversacion(btn.dataset.conversacion);
    });
  });

  botonRepetir.addEventListener("click", reiniciarPhishing);
}

document.addEventListener("DOMContentLoaded", inicializar);