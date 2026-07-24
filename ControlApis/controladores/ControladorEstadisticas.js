const {
    obtenerDatosNVD
} = require("../serviciosExternos/nvdService");

const {
    obtenerDatosKEV
} = require("../serviciosExternos/cisaKevService");

const {
    obtenerPasswordsMasComunes
} = require("../serviciosExternos/passwordsService");

//  CACHE

let cacheEstadisticas = null;
let ultimaActualizacion = 0;
let actualizandoCache = false;

// 1 hora
const TIEMPO_CACHE = 60 * 60 * 1000;


//ACTUALIZAR CACHE

async function actualizarCache() {

    if (actualizandoCache) return;

    actualizandoCache = true;

    try {

        console.log("Actualizando estadísticas...");

        const [
            datosNVD,
            datosKEV,
            passwords
        ] = await Promise.all([

            obtenerDatosNVD(),
            obtenerDatosKEV(),
            obtenerPasswordsMasComunes()

        ]);

        cacheEstadisticas = {

            resumen: {

                totalVulnerabilidades:
                    datosNVD.resumen.total,

                criticas:
                    datosNVD.resumen.criticas,

                altas:
                    datosNVD.resumen.altas,

                medias:
                    datosNVD.resumen.medias,

                bajas:
                    datosNVD.resumen.bajas,

                explotadasKEV:
                    datosKEV.totalExplotadas

            },

            tendencia: {

                nvd:
                    datosNVD.tendencia,

                kev:
                    datosKEV.tendencia

            },

            empresas:
                datosNVD.empresas,

            fabricantes:
                datosKEV.fabricantes,

            productos:
                datosKEV.productos,

            severidad:
                datosNVD.severidad,

            passwords

        };

        ultimaActualizacion = Date.now();

        console.log("Cache actualizada correctamente.");

    }

    catch (error) {

        console.error("Error actualizando cache:", error);

    }

    finally {

        actualizandoCache = false;

    }

}

//OBTENER ESTADÍSTICAS

async function obtenerEstadisticas(req, res) {

    try {

        // Si es la primera vez genera el cache
        if (!cacheEstadisticas) {

            await actualizarCache();

        }

        // Si ya expiro actualizar en segundo plano
        else if (
            Date.now() - ultimaActualizacion > TIEMPO_CACHE &&
            !actualizandoCache
        ) {

            actualizarCache();

        }

        res.status(200).json(cacheEstadisticas);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: "Error al obtener las estadísticas."

        });

    }

}

module.exports = {

    obtenerEstadisticas,
    actualizarCache

};