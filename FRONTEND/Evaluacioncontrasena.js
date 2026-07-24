const API_BASE = "https://ghost-net-api.onrender.com/api/contrasena";


// =================================================
// EVALUAR CONTRASEÑA
// =================================================

document.getElementById("evaluarBtn").addEventListener("click", async () => {

    const password = document.getElementById("password").value;


    if (!password) {
        alert("Ingresa una contraseña");
        return;
    }


    try {

        const res = await fetch(`${API_BASE}/verificar`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                contrasena: password
            })

        });


        const data = await res.json();


        console.log("Respuesta verificar:", data);


        if (!data.ok) {

            alert("Error al evaluar contraseña");
            return;

        }


        const r = data.resultado;


        document.getElementById("barraSeguridad").style.width =
            r.puntaje + "%";


        document.getElementById("porcentaje").textContent =
            r.puntaje + "%";


        document.getElementById("nivel").textContent =
            r.nivel;



        llenarLista(
            "fortalezas",
            r.fortalezas
        );


        llenarLista(
            "debilidades",
            r.debilidades
        );


        llenarLista(
            "recomendaciones",
            r.recomendaciones
        );


    } catch(error){

        console.error(
            "Error verificar:",
            error
        );

        alert("No se pudo conectar con el servidor");

    }


});




// =================================================
// MOSTRAR / OCULTAR PASSWORD
// =================================================

document.getElementById("mostrarPassword")
.addEventListener("click",()=>{


    const input =
    document.getElementById("password");


    if(input.type === "password"){

        input.type="text";

    }else{

        input.type="password";

    }


});




// =================================================
// GENERAR CONTRASEÑA
// =================================================

const botonGenerar =
document.querySelector(".btn-generate");


if(botonGenerar){


botonGenerar.addEventListener("click", async()=>{


    try{


        const res = await fetch(`${API_BASE}/generar`,{


            method:"POST",


            headers:{
                "Content-Type":"application/json"
            },


            body:JSON.stringify({

                longitud:16

            })


        });



        const data = await res.json();


        console.log("Respuesta generar:",data);



        if(data.ok){


            document.querySelector(".gen-display").textContent =
            data.resultado.contrasena;


        }



    }catch(error){


        console.error(
            "Error generar:",
            error
        );


    }



});


}
// =================================================
// COMPARAR CONTRASEÑAS (SOLUCIÓN DEFINITIVA)
// =================================================
const btnComparar = document.getElementById("btnComparar");

if (btnComparar) {
    btnComparar.addEventListener("click", async () => {
        const password1 = document.getElementById("password1").value;
        const password2 = document.getElementById("password2").value;

        if (!password1 || !password2) {
            alert("Debes ingresar ambas contraseñas.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/comparar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contrasena1: password1,
                    contrasena2: password2
                })
            });

            const data = await res.json();
            console.log("Respuesta del servidor:", data);

            if (!data.ok) {
                alert(data.mensaje || "Error al comparar");
                return;
            }

            const r = data.resultado;

            // 1. Renderizar el ganador
            document.getElementById("ganadorComparacion").textContent = 
                r.ganador === "Empate" ? "¡Es un Empate!" : `¡Ganadora: ${r.ganador}!`;

            // 2. Renderizar Contraseña 1
            if (r.p1) {
                document.getElementById("barraPassword1").style.width = r.p1.puntaje + "%";
                document.getElementById("puntajePassword1").textContent = r.p1.puntaje + "%";
                document.getElementById("nivelPassword1").textContent = r.p1.nivel;
            }

            // 3. Renderizar Contraseña 2
            if (r.p2) {
                document.getElementById("barraPassword2").style.width = r.p2.puntaje + "%";
                document.getElementById("puntajePassword2").textContent = r.p2.puntaje + "%";
                document.getElementById("nivelPassword2").textContent = r.p2.nivel;
            }

            // 4. Renderizar la lista de diferencias
            llenarLista("diferenciasComparar", r.diferencias);

        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Error de conexión");
        }
    });
}



// =================================================
// LLENAR LISTAS
// =================================================

function llenarLista(id,items){


    const ul =
    document.getElementById(id);



    if(!ul) return;



    ul.innerHTML="";



    if(!items || items.length===0){


        ul.innerHTML="<li>Sin información</li>";

        return;

    }



    items.forEach(texto=>{


        const li =
        document.createElement("li");


        li.textContent=texto;


        ul.appendChild(li);


    });



}