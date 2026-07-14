const URL_KEV =
    "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";

async function obtenerDatosKEV() {

    try {

        const respuesta = await fetch(URL_KEV);

        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        const vulnerabilidades = datos.vulnerabilities || [];

        const fabricantes = {};
        const productos = {};
        const anios = {};

        vulnerabilidades.forEach((item) => {

            // Fabricante
            const fabricante = item.vendorProject;

            fabricantes[fabricante] =
                (fabricantes[fabricante] || 0) + 1;

            // Producto
            const producto = item.product;

            productos[producto] =
                (productos[producto] || 0) + 1;

            // Año
            const anio = item.dateAdded
            ? item.dateAdded.substring(0, 4)
            : "Sin fecha";

            anios[anio] =
                (anios[anio] || 0) + 1;

        });

        const topFabricantes = Object.entries(fabricantes)
            .sort((a,b)=>b[1]-a[1])
            .slice(0,8)
            .map(([fabricante,total])=>({

                fabricante,
                total

            }));

        const topProductos = Object.entries(productos)
            .sort((a,b)=>b[1]-a[1])
            .slice(0,8)
            .map(([producto,total])=>({

                producto,
                total

            }));

        return {

            totalExplotadas: vulnerabilidades.length,

            fabricantes: topFabricantes,

            productos: topProductos,

            tendencia: anios

        };

    } catch (error) {

        console.error("Error CISA KEV:", error.message);

        return {

            totalExplotadas: 0,

            fabricantes: [],

            productos: [],

            tendencia: {}

        };

    }

}

module.exports = {

    obtenerDatosKEV

};