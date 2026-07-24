// Filtraciones.js — Ghost_Net: conecta el botón "Verificar" con el backend real (XposedOrNot)

const API_URL = 'https://ghost-net-api.onrender.com/api/filtraciones/verificar';

const emailInput = document.getElementById('emailInput');
const btnVerificar = document.getElementById('btnVerificar');
const btnVerificarText = btnVerificar.querySelector('.btn-verify-text');

btnVerificar.addEventListener('click', () => verificarCorreo());
emailInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') verificarCorreo();
});

async function verificarCorreo() {
  const email = emailInput.value.trim();
  if (!email) return;

  setCargando(true);

  try {
    const res = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    renderResultado(data);
  } catch (err) {
    console.error(err);
    alert('No se pudo conectar con el servidor. Verifica que el backend (npm start) esté corriendo en ghost-net-api.onrender.com.');
  } finally {
    setCargando(false);
  }
}

function setCargando(cargando) {
  btnVerificar.disabled = cargando;
  btnVerificarText.textContent = cargando ? 'Verificando...' : 'Verificar';
}

function renderResultado(data) {
  // --- Anillo de "Nivel de Riesgo" ---
  const nivelRiesgoEl = document.getElementById('nivelRiesgo');
  nivelRiesgoEl.textContent = data.nivelRiesgo;
  nivelRiesgoEl.closest('.risk-ring').className = `risk-ring risk-${data.nivelRiesgo.toLowerCase()}`;

  // --- Descripción bajo el anillo ---
  const descripcionEl = document.getElementById('descripcionRiesgo');
  descripcionEl.innerHTML = data.found
    ? `Este correo ha sido encontrado en<br><b>${data.totalFiltraciones} filtracion${data.totalFiltraciones === 1 ? '' : 'es'} de seguridad</b>`
    : 'Buenas noticias:<br><b>no se encontraron filtraciones para este correo</b>';

  document.getElementById('fechaActualizacion').textContent = new Date().toLocaleDateString('es-MX');

  // --- Tarjetas de métricas ---
  document.getElementById('numBrechas').textContent = data.totalFiltraciones;
  document.getElementById('registrosExpuestos').textContent = formatearNumero(data.totalRecordsExpuestos);
  document.getElementById('ultimaBrecha').textContent = data.ultimaFiltracion ?? '—';
  document.getElementById('nivelRiesgoMini').textContent = data.nivelRiesgo;

  // --- Tabla de filtraciones ---
  const tbody = document.getElementById('tablaBrechas');
  tbody.innerHTML = '';

  if (!data.filtraciones || !data.filtraciones.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; opacity:.6;">No se encontraron filtraciones para este correo</td></tr>';
    return;
  }

  data.filtraciones.forEach((f) => {
    const gravedadClass = f.gravedad.toLowerCase(); // alto | media | baja
    const inicial = f.servicio.charAt(0).toUpperCase();
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>
        <div class="service-cell">
          <div class="service-logo" style="background:${colorParaServicio(f.servicio)}">${inicial}</div>
          ${f.servicio}
        </div>
      </td>
      <td>${f.anio}</td>
      <td>${formatearNumero(f.registrosExpuestos)}</td>
      <td><span class="badge ${gravedadClass}">${f.gravedad}</span></td>
    `;
    tbody.appendChild(fila);
  });
}

// Genera un color consistente a partir del nombre del servicio (para el avatar del logo)
function colorParaServicio(nombre) {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 40%)`;
}

function formatearNumero(n) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B+';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M+';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K+';
  return String(n);
}