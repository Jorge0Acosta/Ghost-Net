const URL_NVD = "https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=200";

async function obtenerDatosNVD() {

    try {

        const respuesta = await fetch(URL_NVD);

        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        const vulnerabilidades = datos.vulnerabilities || [];

        let criticas = 0;
        let altas = 0;
        let medias = 0;
        let bajas = 0;

        const tendencia = {};
        const empresas = {};

        vulnerabilidades.forEach((item) => {

            const cve = item.cve;

            // Año
            const anio = cve.published
            ? cve.published.substring(0, 4)
            : "Sin fecha";

            tendencia[anio] = (tendencia[anio] || 0) + 1;

            // Severidad
            let severidad = "";

            if (cve.metrics?.cvssMetricV31) {

                severidad =
                    cve.metrics.cvssMetricV31[0].cvssData.baseSeverity;

            } else if (cve.metrics?.cvssMetricV30) {

                severidad =
                    cve.metrics.cvssMetricV30[0].cvssData.baseSeverity;

            } else if (cve.metrics?.cvssMetricV2) {

                severidad =
                    cve.metrics.cvssMetricV2[0].baseSeverity;

            }

            switch (severidad) {

                case "CRITICAL":
                    criticas++;
                    break;

                case "HIGH":
                    altas++;
                    break;

                case "MEDIUM":
                    medias++;
                    break;

                case "LOW":
                    bajas++;
                    break;

            }

            // Empresas afectadas

            if (cve.configurations) {

                cve.configurations.forEach(config => {

                    config.nodes?.forEach(node => {

                        node.cpeMatch?.forEach(cpe => {

                            const partes = cpe.criteria.split(":");

                            if (partes.length > 3) {

                                const fabricante = partes[3];

                                empresas[fabricante] =
                                    (empresas[fabricante] || 0) + 1;

                            }

                        });

                    });

                });

            }

        });

        const topEmpresas = Object.entries(empresas)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([empresa, cantidad]) => ({
                empresa,
                cantidad
            }));

        return {

            resumen: {
                total: vulnerabilidades.length,
                criticas,
                altas,
                medias,
                bajas
            },

            tendencia,

            empresas: topEmpresas,

            severidad: {
                criticas,
                altas,
                medias,
                bajas
            }

        };

    } catch (error) {

        console.error("Error al consultar NVD:", error.message);

        return {

            resumen: {
                total: 0,
                criticas: 0,
                altas: 0,
                medias: 0,
                bajas: 0
            },

            tendencia: {},

            empresas: [],

            severidad: {
                criticas: 0,
                altas: 0,
                medias: 0,
                bajas: 0
            }

        };

    }

}

module.exports = {
    obtenerDatosNVD
};