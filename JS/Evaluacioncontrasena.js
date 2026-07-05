const input = document.querySelector(".card-pass-input");
const resultado = document.querySelector(".resultado");

input.addEventListener("input", async () => {
    const contraseña = input.value;

    if (!contraseña) {
        resultado.textContent = "";
        resultado.className = "resultado";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/evaluar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password: contraseña })
        });

        const data = await response.json();
        console.log("Respuesta API:", data);

        mostrarResultado(data);

    } catch (error) {
        console.log("Error: no se conectó a la api chaval", error);
        resultado.textContent = "No se pudo conectar con el servidor.";
        resultado.className = "resultado result-bad";
    }
});

function mostrarResultado(data) {
    resultado.textContent = `${data.nivel} (${data.score} pts)`;
    resultado.className = "resultado";

    if (data.nivel === "Fuerte") {
        resultado.classList.add("result-ok");
    } else if (data.nivel === "Media") {
        resultado.classList.add("result-medium");
    } else {
        resultado.classList.add("result-bad");
    }
}

// ---------- GENERADOR DE CONTRASEÑAS SEGURAS ----------
const btnGenerate = document.querySelector(".btn-generate");
const genDisplay = document.querySelector(".gen-display");

const CARACTERES = {
    minusculas: "abcdefghijklmnopqrstuvwxyz",
    mayusculas: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numeros: "0123456789",
    simbolos: "!@#$%^&*()_-+=?"
};

function generarPasswordSegura(longitud = 16) {
    const todos = CARACTERES.minusculas + CARACTERES.mayusculas + CARACTERES.numeros + CARACTERES.simbolos;

    // Usamos crypto.getRandomValues para números aleatorios criptográficamente seguros
    const randomValues = new Uint32Array(longitud);
    crypto.getRandomValues(randomValues);

    let password = "";

    // Garantizamos al menos un carácter de cada tipo
    password += CARACTERES.minusculas[randomValues[0] % CARACTERES.minusculas.length];
    password += CARACTERES.mayusculas[randomValues[1] % CARACTERES.mayusculas.length];
    password += CARACTERES.numeros[randomValues[2] % CARACTERES.numeros.length];
    password += CARACTERES.simbolos[randomValues[3] % CARACTERES.simbolos.length];

    // Rellenamos el resto de forma aleatoria
    for (let i = 4; i < longitud; i++) {
        password += todos[randomValues[i] % todos.length];
    }

    // Mezclamos los caracteres para que los primeros 4 no siempre sigan el mismo patrón
    return password.split("").sort(() => Math.random() - 0.5).join("");
}

if (btnGenerate && genDisplay) {
    btnGenerate.addEventListener("click", () => {
        const nuevaPassword = generarPasswordSegura(16);
        genDisplay.textContent = nuevaPassword;
        genDisplay.style.color = "var(--text-primary)";
        genDisplay.title = "Clic para copiar";
        genDisplay.style.cursor = "pointer";
    });

    // Clic en el display copia la contraseña generada al portapapeles
    genDisplay.addEventListener("click", async () => {
        const texto = genDisplay.textContent;

        // Si todavía no se generó nada, no hacemos nada
        if (!texto || texto === "Genera una contraseña segura...") return;

        try {
            await navigator.clipboard.writeText(texto);
            const original = genDisplay.textContent;
            genDisplay.textContent = "Copiado ✔";
            setTimeout(() => {
                genDisplay.textContent = original;
            }, 900);
        } catch (error) {
            console.log("No se pudo copiar al portapapeles:", error);
        }
    });
}