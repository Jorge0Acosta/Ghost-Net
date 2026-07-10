/* ===================================================
   SESION.JS — Lógica de sesión reutilizable
   Se incluye en todas las páginas que tengan los
   elementos: #auth-invitado, #auth-usuario,
   #nombre-usuario, #btn-cerrar-sesion
   (y opcionalmente #crear-cuenta-heroe / #btn-cerrar-sesion-heroe)
   =================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const authInvitado = document.getElementById("auth-invitado");
  const authUsuario = document.getElementById("auth-usuario");
  const nombreUsuario = document.getElementById("nombre-usuario");
  const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");

  const crearCuentaHeroe = document.getElementById("crear-cuenta-heroe");
  const btnCerrarSesionHeroe = document.getElementById("btn-cerrar-sesion-heroe");

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
  }

  function actualizarEstadoSesion() {
    const datos = localStorage.getItem("usuario");
    const sesion = datos ? JSON.parse(datos) : null;
    const haySesion = !!(sesion && sesion.correo);

    /* Nav bar */
    authInvitado?.classList.toggle("oculto", haySesion);
    authUsuario?.classList.toggle("oculto", !haySesion);
    if (nombreUsuario && sesion) {
      nombreUsuario.textContent = sesion.nombre || sesion.correo;
    }

    /* Botones del héroe (solo existen en index.html) */
    crearCuentaHeroe?.classList.toggle("oculto", haySesion);
    btnCerrarSesionHeroe?.classList.toggle("oculto", !haySesion);
  }

  btnCerrarSesion?.addEventListener("click", cerrarSesion);
  btnCerrarSesionHeroe?.addEventListener("click", cerrarSesion);

  actualizarEstadoSesion();
});