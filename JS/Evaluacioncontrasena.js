const input = document.querySelector(".card-pass-input");
const resultado = document.querySelector(".resultado");
const togglePassword = document.querySelector(".card-eye");

if (togglePassword && input) {
    togglePassword.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        togglePassword.setAttribute("aria-label", isPassword ? "Ocultar contraseña" : "Mostrar contraseña");
        togglePassword.setAttribute("title", isPassword ? "Ocultar contraseña" : "Mostrar contraseña");
    });
}

input.addEventListener("input", async () => {
    const contraseña = input.value;

    if (!contraseña) {
        if (resultado) {
            resultado.textContent = "Escribe una contraseña para ver su nivel de seguridad.";
            resultado.className = "resultado result-neutral";
        }
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
        if (resultado) {
            resultado.textContent = "No se pudo conectar con el servidor.";
            resultado.className = "resultado result-bad";
        }
    }
});

function mostrarResultado(data) {
    if (!resultado) return;
    const nivel = data.nivel || "Débil";
    const puntos = data.score ?? 0;
    resultado.textContent = `${nivel} (${puntos} pts)`;
    resultado.className = "resultado";

    if (nivel === "Fuerte") {
        resultado.classList.add("result-ok");
    } else if (nivel === "Media") {
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

    const randomValues = new Uint32Array(longitud);
    crypto.getRandomValues(randomValues);

    let password = "";

    password += CARACTERES.minusculas[randomValues[0] % CARACTERES.minusculas.length];
    password += CARACTERES.mayusculas[randomValues[1] % CARACTERES.mayusculas.length];
    password += CARACTERES.numeros[randomValues[2] % CARACTERES.numeros.length];
    password += CARACTERES.simbolos[randomValues[3] % CARACTERES.simbolos.length];

    for (let i = 4; i < longitud; i++) {
        password += todos[randomValues[i] % todos.length];
    }

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

    genDisplay.addEventListener("click", async () => {
        const texto = genDisplay.textContent;
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