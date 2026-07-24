const API_URL = "http://localhost:3000/api/correo";
// =============================
// VERIFICAR CORREO
// =============================

document.getElementById("btnVerificar").addEventListener("click", async () => {
    const correo = document.getElementById("correo").value;

    const res = await fetch(`${API_URL}/verificar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ correo })
    });

    const data = await res.json();

    if (!data.ok) {
        alert("Error al verificar correo");
        return;
    }

    const r = data.resultado;

    document.getElementById("barraVerificacion").style.width = r.puntaje + "%";
    document.getElementById("porcentajeVerificacion").textContent = r.puntaje + "%";
    document.getElementById("nivelVerificacion").textContent = r.nivel;

    llenarLista("listaFortalezas", r.fortalezas);
    llenarLista("listaDebilidades", r.debilidades);
    llenarLista("listaRecomendaciones", r.recomendaciones);

    document.getElementById("resultadoVerificacion").classList.remove("oculto");
});

// =============================
// COMPARAR CORREOS
// =============================

document.getElementById("btnComparar").addEventListener("click", async () => {
    const correo1 = document.getElementById("correo1").value;
    const correo2 = document.getElementById("correo2").value;

    const res = await fetch(`${API_URL}/comparar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ correo1, correo2 })
    });

    const data = await res.json();

    if (!data.ok) {
        alert("Error al comparar correos");
        return;
    }

    const r = data.resultado;

    setResultadoComparacion("barraCorreo1", "puntajeCorreo1", "nivelCorreo1", r.correo1);
    setResultadoComparacion("barraCorreo2", "puntajeCorreo2", "nivelCorreo2", r.correo2);

    document.getElementById("ganadorComparacion").textContent =
        r.ganador === "correo1"
            ? "Correo 1 es más seguro"
            : r.ganador === "correo2"
                ? "Correo 2 es más seguro"
                : "Empate";

    llenarLista("listaDiferencias", r.diferencias);

    document.getElementById("resultadoComparacion").classList.remove("oculto");
});

// =============================
// GENERAR CORREO
// =============================

document.getElementById("btnGenerar").addEventListener("click", async () => {
    const nombre = document.getElementById("nombreGenerador").value;
    const dominio = document.getElementById("dominioGenerador").value;

    const res = await fetch(`${API_URL}/generar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, dominio })
    });

    const data = await res.json();

    if (!data.ok) {
        alert("Error al generar correo");
        return;
    }

    const r = data.resultado;

    document.getElementById("correoGenerado").textContent = r.correoGenerado;
    document.getElementById("barraGenerador").style.width = r.puntaje + "%";
    document.getElementById("puntajeGenerado").textContent = r.puntaje + "%";
    document.getElementById("nivelGenerado").textContent = r.nivel;

    llenarLista("listaFortalezasGenerador", r.fortalezas || []);
    llenarLista("listaDebilidadesGenerador", r.debilidades || []);
    llenarLista("listaRecomendacionesGenerador", r.recomendaciones || []);

    document.getElementById("resultadoGenerador").classList.remove("oculto");
});

// =============================
// COPIAR CORREO GENERADO
// =============================

document.getElementById("btnCopiarCorreo").addEventListener("click", async () => {
    const btn = document.getElementById("btnCopiarCorreo");
    const correo = document.getElementById("correoGenerado").textContent;

    try {
        await navigator.clipboard.writeText(correo);
        btn.classList.add("copiado");
        btn.innerHTML = "✓ Copiado";

        setTimeout(() => {
            btn.classList.remove("copiado");
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copiar
            `;
        }, 1800);
    } catch (err) {
        alert("No se pudo copiar el correo");
    }
});

// =============================
// UTILIDADES
// =============================

function llenarLista(id, items) {
    const ul = document.getElementById(id);
    ul.innerHTML = "";

    items.forEach(texto => {
        const li = document.createElement("li");
        li.textContent = texto;
        ul.appendChild(li);
    });
}

function setResultadoComparacion(barraId, puntajeId, nivelId, r) {
    document.getElementById(barraId).style.width = r.puntaje + "%";
    document.getElementById(puntajeId).textContent = r.puntaje + "%";
    document.getElementById(nivelId).textContent = r.nivel;
}