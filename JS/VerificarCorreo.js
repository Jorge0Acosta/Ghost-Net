const API_URL = "http://localhost:3001/api/correo";

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

    llenarLista("listaFortalezas", r.fortalezas || []);
    llenarLista("listaDebilidades", r.debilidades || []);
    llenarLista("listaRecomendaciones", r.recomendaciones || []);
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