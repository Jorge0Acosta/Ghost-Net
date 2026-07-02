const input = document.querySelector(".card-pass-input");
const resultado = document.querySelector(".resultado");

input.addEventListener("input", async () => {
    const contraseña = input.value;

    // Si el input está vacío, limpiamos el resultado y no hacemos la petición
    if (!contraseña) {
        resultado.textContent = "";
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

        resultado.textContent = `Nivel: ${data.nivel} — ${data.mensaje}`;
        resultado.className = `resultado resultado-${data.nivel.toLowerCase().replace(/\s+/g, "-")}`;
    } catch (error) {
        console.log("Error: no se conectó a la api", error);
        resultado.textContent = "Error de conexión con el servidor. Asegura que el backend esté en http://localhost:3000";
        resultado.className = "resultado resultado-error";
    }
});