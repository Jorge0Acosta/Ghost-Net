const {
    obtenerDatosNVD
} = require("../serviciosExternos/nvdService");

const {
    obtenerDatosKEV
} = require("../serviciosExternos/cisaKevService");

const {
    obtenerPasswordsMasComunes
} = require("../serviciosExternos/passwordsService");

async function obtenerEstadisticas(req, res) {

    try {

        const [
            datosNVD,
            datosKEV,
            passwords
        ] = await Promise.all([

            obtenerDatosNVD(),

            obtenerDatosKEV(),

            obtenerPasswordsMasComunes()

        ]);

        res.status(200).json({

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

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            mensaje: "Error al obtener las estadísticas."

        });

    }

}

module.exports = {

    obtenerEstadisticas

};