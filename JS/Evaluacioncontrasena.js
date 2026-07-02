const input = document.querySelector(".card-pass-input");

input.addEventListener("input", async () => {
    const contraseña = input.value;

    // Si el input está vacío, no hacemos la petición
    if (!contraseña) return;

    try {
        // Apuntamos a la nueva ruta configurada con 
        const response = await fetch("http://localhost:3000/api/evaluar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password: contraseña })
        });

        const data = await response.json();
        console.log("Respuesta API:", data);

    } catch (error) {
        console.log("Error: no se conectó a la api chaval", error);
    }
});