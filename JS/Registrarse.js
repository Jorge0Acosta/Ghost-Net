// Conecta los formularios de Registrarse.html con la API de Base de Datos (puerto 3001)

const API_URL = "http://localhost:3000/api";
// ---------- REGISTRO ----------
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("regName").value.trim();
    const correo = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirmar = document.getElementById("regConfirm").value;

    if (!nombre || !correo || !password) {
      alert("Completa todos los campos.");
      return;
    }

    if (password !== confirmar) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, password })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        alert(data.mensaje || "Error al registrar el usuario.");
        return;
      }

      alert("Cuenta creada correctamente.");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("No se pudo conectar con el servidor de base de datos (puerto 3000). ¿Está corriendo?");
    }
  });
}

// ---------- LOGIN ----------
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!correo || !password) {
      alert("Completa correo y contraseña.");
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        alert(data.mensaje || "Credenciales inválidas.");
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      alert(`Bienvenido, ${data.usuario.nombre}`);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("No se pudo conectar con el servidor de base de datos (puerto 3001). ¿Está corriendo?");
    }
  });
}
