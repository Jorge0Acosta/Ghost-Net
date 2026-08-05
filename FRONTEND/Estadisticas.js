
Chart.defaults.color = "#5D8A9C";
Chart.defaults.borderColor = "rgba(0,253,135,.07)";
Chart.defaults.font.family = "'Courier New', monospace";
Chart.defaults.font.size = 11;

/* ===================================================
   VARIABLES GLOBALES*/

let graficaLinea = null;
let graficaBarras = null;
let graficaPastel = null;

let graficaDonutContrasenas = null;
let graficaDonutCorreos = null;

let ETIQUETAS_AÑOS = [];
let DATOS_BRECHAS = [];
let DATOS_REGISTROS = [];

let ETIQUETAS_EMPRESAS = [];
let DATOS_EMPRESAS = [];

let DATOS_SEVERIDAD = [];

let PASSWORDS = [];



/* Colores */

const COLORES_EMPRESAS = [

    "#f92837",
    "#f7823e",
    "#00FD87",
    "#00C8FB",
    "#ef4ce9",
    "#ffb800",
    "#606B5F",
    "#4bc0c0"

];

const COLORES_SEVERIDAD = [

    "#f92837",
    "#f7823e",
    "#00FD87",
    "#00C8FB"

];

/* ===================================================
   TOOLTIP
   =================================================== */

const ESTILO_TOOLTIP = {

    backgroundColor:"#0a1e2e",

    borderColor:"rgba(0,253,135,.25)",

    borderWidth:1,

    titleColor:"#d8edf7",

    bodyColor:"#5D8A9C",

    padding:10

};

/* ===================================================
   CARGAR ESTADÍSTICAS
   =================================================== */

async function cargarEstadisticas(){

    try{

        const respuesta =
        await fetch("https://ghost-net-api.onrender.com/api/estadisticas");
        if(!respuesta.ok){

            throw new Error("No fue posible obtener las estadísticas.");

        }

        const datos =
        await respuesta.json();

        prepararDatos(datos);

        actualizarTarjetas(datos);

        actualizarPasswords();

        actualizarRegistros(datos);

        inicializarGraficaTendencia();

        inicializarGraficaBarras();

        inicializarGraficaPastel();

    }

    catch(error){

        console.error(error);

    }

}

/* ===================================================
   PREPARAR DATOS
   =================================================== */

function prepararDatos(datos){

/* ==============================
   GRÁFICA DE LÍNEA
   ============================== */

    const tendenciaNVD = datos.tendencia.nvd;
    const tendenciaKEV = datos.tendencia.kev;

    /* Obtener todos los años de ambas APIs */

    const años = [
        ...new Set([
            ...Object.keys(tendenciaNVD),
            ...Object.keys(tendenciaKEV)
        ])
    ].sort();

    /* Etiquetas */

    ETIQUETAS_AÑOS = años;

    /* Datos NVD */

    DATOS_BRECHAS = años.map(anio => {

        return tendenciaNVD[anio] || 0;

    });

    /* Datos KEV */

    DATOS_REGISTROS = años.map(anio => {

        return tendenciaKEV[anio] || 0;

    });

    /* ==============================
       GRAFICA DE BARRAS
       ============================== */

    ETIQUETAS_EMPRESAS =
    datos.empresas.map(item=>item.empresa);

    DATOS_EMPRESAS =
    datos.empresas.map(item=>item.cantidad);

    /* ==============================
       PASTEL
       ============================== */

    DATOS_SEVERIDAD=[

        {

            etiqueta:"Críticas",

            porcentaje:datos.severidad.criticas,

            color:"#f92837"

        },

        {

            etiqueta:"Altas",

            porcentaje:datos.severidad.altas,

            color:"#f7823e"

        },

        {

            etiqueta:"Medias",

            porcentaje:datos.severidad.medias,

            color:"#00FD87"

        },

        {

            etiqueta:"Bajas",

            porcentaje:datos.severidad.bajas,

            color:"#00C8FB"

        }

    ];

    PASSWORDS =
    datos.passwords;

}

/* ===================================================
   ACTUALIZAR TARJETAS
   =================================================== */

function actualizarTarjetas(datos){

    const tarjetas =
    document.querySelectorAll(".tarjeta-resumen");

    if(tarjetas.length<4)return;

    tarjetas[0]
    .querySelector(".tarjeta-resumen__cifra")
    .textContent =
    datos.resumen.totalVulnerabilidades.toLocaleString();

    tarjetas[1]
    .querySelector(".tarjeta-resumen__cifra")
    .textContent =
    datos.resumen.explotadasKEV.toLocaleString();

    tarjetas[2]
    .querySelector(".tarjeta-resumen__cifra")
    .textContent =
    datos.resumen.criticas.toLocaleString();

    tarjetas[3]
    .querySelector(".tarjeta-resumen__cifra")
    .textContent =
    datos.empresas.length.toLocaleString();

}

/* ===================================================
   GRÁFICA DE TENDENCIA
   =================================================== */

function inicializarGraficaTendencia(){

    const canvas =
    document.getElementById("grafica-tendencia");

    if(!canvas)return;

    if(graficaLinea){

        graficaLinea.destroy();

    }

    graficaLinea = new Chart(canvas,{

        type:"line",

        data:{

            labels:ETIQUETAS_AÑOS,

            datasets:[

                {

                    label:"CVEs (NVD)",

                    data:DATOS_BRECHAS,

                    borderColor:"#00FD87",

                    backgroundColor:"rgba(0,253,135,.08)",

                    borderWidth:2,

                    pointRadius:3,

                    pointBackgroundColor:"#00FD87",

                    tension:.35,

                    fill:true

                },

                {

                    label:"KEV (CISA)",

                    data:DATOS_REGISTROS,

                    borderColor:"#00C8FB",

                    backgroundColor:"rgba(0,200,251,.05)",

                    borderWidth:2,

                    pointRadius:3,

                    pointBackgroundColor:"#00C8FB",

                    borderDash:[5,3],

                    tension:.35,

                    fill:true,

                    yAxisID:"ejeDerecho"

                }

            ]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    labels:{

                        color:"#5D8A9C",

                        boxWidth:12

                    }

                },

                tooltip:ESTILO_TOOLTIP

            },

            scales:{

                x:{

                    grid:{

                        color:"rgba(0,253,135,.05)"

                    },

                    ticks:{

                        color:"#5D8A9C"

                    }

                },

                y:{

                    beginAtZero:true,

                    grid:{

                        color:"rgba(0,253,135,.05)"

                    },

                    ticks:{

                        color:"#5D8A9C"

                    },

                    title:{

                        display:true,

                        text:"CVEs",

                        color:"#5D8A9C"

                    }

                },

                ejeDerecho:{

                    position:"right",

                    beginAtZero:true,

                    grid:{

                        display:false

                    },

                    ticks:{

                        color:"#00C8FB"

                    },

                    title:{

                        display:true,

                        text:"KEV",

                        color:"#00C8FB"

                    }

                }

            }

        }

    });

}

/* ===================================================
   GRÁFICA DE BARRAS
   =================================================== */

function inicializarGraficaBarras(){

    const canvas =
    document.getElementById("grafica-barras");

    if(!canvas)return;

    if(graficaBarras){

        graficaBarras.destroy();

    }

    graficaBarras = new Chart(canvas,{

        type:"bar",

        data:{

            labels:ETIQUETAS_EMPRESAS,

            datasets:[

                {

                    label:"Vulnerabilidades",

                    data:DATOS_EMPRESAS,

                    backgroundColor:COLORES_EMPRESAS,

                    borderRadius:5,

                    borderSkipped:false

                }

            ]

        },

        options:{

            indexAxis:"y",

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    display:false

                },

                tooltip:{

                    ...ESTILO_TOOLTIP,

                    callbacks:{

                        label:function(contexto){

                            return " " +
                            contexto.parsed.x +
                            " vulnerabilidades";

                        }

                    }

                }

            },

            scales:{

                x:{

                    beginAtZero:true,

                    grid:{

                        color:"rgba(0,253,135,.05)"

                    },

                    ticks:{

                        color:"#5D8A9C"

                    }

                },

                y:{

                    grid:{

                        display:false

                    },

                    ticks:{

                        color:"#d8edf7"

                    }

                }

            }

        }

    });

}

/* ===================================================
   GRÁFICA DE PASTEL
   =================================================== */

function inicializarGraficaPastel() {

    const canvas = document.getElementById("grafica-pastel");

    if (!canvas) return;

    if (graficaPastel) {

        graficaPastel.destroy();

    }

    graficaPastel = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: DATOS_SEVERIDAD.map(item => item.etiqueta),

            datasets: [

                {

                    data: DATOS_SEVERIDAD.map(item => item.porcentaje),

                    backgroundColor: DATOS_SEVERIDAD.map(item => item.color),

                    borderWidth: 2,

                    borderColor: "#0a1e2e",

                    hoverOffset: 6

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "55%",

            plugins: {

                legend: {

                    display: false

                },

                tooltip: {

                    ...ESTILO_TOOLTIP,

                    callbacks: {

                        label: function (contexto) {

                            return " " + contexto.parsed;

                        }

                    }

                }

            }

        }

    });

    generarLeyendaPastel();

}

/* ===================================================
   LEYENDA DEL PASTEL
   =================================================== */

function generarLeyendaPastel() {

    const contenedor =
        document.getElementById("leyenda-pastel");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    DATOS_SEVERIDAD.forEach(item => {

        const fila =
            document.createElement("div");

        fila.classList.add("leyenda-pastel__elemento");

        const punto =
            document.createElement("span");

        punto.classList.add("leyenda-pastel__punto");

        punto.style.backgroundColor = item.color;

        const texto =
            document.createElement("span");

        texto.classList.add("leyenda-pastel__texto");

        texto.textContent =
            `${item.etiqueta} (${item.porcentaje})`;

        fila.appendChild(punto);

        fila.appendChild(texto);

        contenedor.appendChild(fila);

    });

}

/* ===================================================
   CONTRASEÑAS MÁS COMUNES
   =================================================== */

function actualizarPasswords() {

    const filas =
        document.querySelectorAll(".fila-contrasena");

    if (!filas.length) return;

    PASSWORDS.forEach((password, indice) => {

        if (!filas[indice]) return;

        filas[indice]
            .querySelector(".fila-contrasena__posicion")
            .textContent =
            "#" + password.posicion;

        filas[indice]
            .querySelector(".fila-contrasena__texto")
            .textContent =
            password.password;

    });

}

const PALETA_NIVELES = {
  "Excelente": "#00FD87",
  "Segura": "#00C8FB",
  "Seguro": "#00C8FB",
  "Regular": "#ffb800",
  "Insegura": "#f7823e",
  "Inseguro": "#f7823e",
  "Muy ins.": "#f92837",
  "Muy insegura": "#f92837"
};

function actualizarRegistros(datos) {
  const contrasenas = datos.registros.contrasenas;
  const correos = datos.registros.correos;

  // 1. Cifras generales
  document.getElementById("total-contrasenas").textContent = contrasenas.total.toLocaleString();
  document.getElementById("total-correos").textContent = correos.total.toLocaleString();
  
  const totalVerificaciones = contrasenas.total + correos.total;
  document.getElementById("total-verificaciones").textContent = `👤 ${totalVerificaciones.toLocaleString()}`;

  document.getElementById("donut-total-contrasenas").textContent = contrasenas.total.toLocaleString();
  document.getElementById("donut-total-correos").textContent = correos.total.toLocaleString();

  // 2. Renderizar Donut Charts
  renderizarDonut("grafica-donut-contrasenas", contrasenas.resultados, 'contrasenas');
  renderizarDonut("grafica-donut-correos", correos.resultados, 'correos');

  // 3. Renderizar Lista de Barras de Progreso
  renderizarListaDesglose("desglose-contrasenas", contrasenas.resultados, contrasenas.total);
  renderizarListaDesglose("desglose-correos", correos.resultados, correos.total);

  // 4. Renderizar Resumen inferior (Seguros vs Riesgo)
  renderizarResumenFooter("resumen-contrasenas", contrasenas.resultados, contrasenas.total);
  renderizarResumenFooter("resumen-correos", correos.resultados, correos.total);
}

function renderizarDonut(canvasId, resultados, tipo) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const labels = resultados.map(item => item.resultado);
  const data = resultados.map(item => item.cantidad);
  const bgColors = resultados.map(item => PALETA_NIVELES[item.resultado] || "#00C8FB");

  if (tipo === 'contrasenas' && graficaDonutContrasenas) graficaDonutContrasenas.destroy();
  if (tipo === 'correos' && graficaDonutCorreos) graficaDonutCorreos.destroy();

  const nuevaGrafica = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: bgColors,
        borderWidth: 2,
        borderColor: "#0a1e2e",
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",
      plugins: {
        legend: { display: false },
        tooltip: ESTILO_TOOLTIP
      }
    }
  });

  if (tipo === 'contrasenas') graficaDonutContrasenas = nuevaGrafica;
  if (tipo === 'correos') graficaDonutCorreos = nuevaGrafica;
}

function renderizarListaDesglose(contenedorId, resultados, total) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor || !resultados) return;

    contenedor.innerHTML = "";

    // Función auxiliar para saber el nivel de jerarquía (1 es el más seguro, 4 el peor)
    const obtenerPeso = (texto) => {
        const t = (texto || "").toString().trim().toLowerCase();
        if (t.includes("excelente")) return 1;
        if (t.includes("segur") && !t.includes("insegur")) return 2;
        if (t.includes("regular")) return 3;
        if (t.includes("muy") || t.includes("insegur")) return 4;
        return 5; // Cualquier otro
    };

    // Ordenamos copias
    const resultadosOrdenados = [...resultados].sort((a, b) => {
        return obtenerPeso(a.resultado) - obtenerPeso(b.resultado);
    });

    resultadosOrdenados.forEach(item => {
        const porcentaje = total > 0 ? Math.round((item.cantidad / total) * 100) : 0;
        const color = PALETA_NIVELES[item.resultado] || "#00C8FB";

        const html = `
        <div class="fila-desglose">
            <div class="fila-desglose__meta">
            <span class="fila-desglose__etiqueta">${item.resultado}</span>
            <div class="fila-desglose__cifras">
                <strong style="color: ${color}">${item.cantidad.toLocaleString()}</strong>
                <span class="porcentaje">${porcentaje}%</span>
            </div>
            </div>
            <div class="barra-progreso">
            <div class="barra-progreso__relleno" style="width: ${porcentaje}%; background-color: ${color}"></div>
            </div>
        </div>
        `;
        contenedor.insertAdjacentHTML("beforeend", html);
    });
}

function renderizarResumenFooter(contenedorId, resultados, total) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor || !resultados) return;

    let seguros = 0;
    let enRiesgo = 0;

    resultados.forEach(item => {
        // Normalizamos el texto: minúsculas y sin espacios extras
        const res = (item.resultado || "").toString().trim().toLowerCase();

        // Evaluamos expresamente si es peligroso / regular / inseguro
        const esRiesgo = res.includes("insegur") || 
                        res.includes("muy") || 
                        res.includes("regular") || 
                        res.includes("riesgo") ||
                        res.includes("debil") ||
                        res.includes("débil");

        if (esRiesgo) {
        enRiesgo += item.cantidad;
        } else {
        seguros += item.cantidad;
        }
    });

    const porcSeguros = total > 0 ? Math.round((seguros / total) * 100) : 0;
    const porcRiesgo = total > 0 ? Math.round((enRiesgo / total) * 100) : 0;

    contenedor.innerHTML = `
        <div>
        <span class="footer-meta">SEGUROS O EXCELENTE</span>
        <div class="footer-val footer-val--verde">${seguros.toLocaleString()} • ${porcSeguros}%</div>
        </div>
        <div>
        <span class="footer-meta">EN RIESGO / REGULAR</span>
        <div class="footer-val footer-val--rojo">${enRiesgo.toLocaleString()} • ${porcRiesgo}%</div>
        </div>
    `;
}

/* ===================================================
   INICIALIZACIÓN
   =================================================== */

document.addEventListener("DOMContentLoaded", () => {

    cargarEstadisticas();

});