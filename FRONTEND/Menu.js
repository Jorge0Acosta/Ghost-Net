const boton = document.getElementById("menu-hamburguesa");
const menu = document.querySelector(".enlaces-nav");
const auth = document.querySelector(".zona-auth");

if (boton && menu && auth) {

    boton.addEventListener("click", () => {
        menu.classList.toggle("activo");
        auth.classList.toggle("activo");
    });

}