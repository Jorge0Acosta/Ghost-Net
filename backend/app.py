from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import threading
import time
import random
import os
from mock_storage import load_state, save_state

# Configurar rutas
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__, 
            static_folder=os.path.join(BASE_DIR, 'CSS'), 
            static_url_path='/CSS')
CORS(app)

# Estado de la simulación
simulation_state = {
    'running': False,
    'progress': 0,
    'logs': [],
    'device': None,
    'attack': None,
    'status': 'idle',
    'password': None,
    'password_evaluation': None
}

# Load persisted simulator state if available (simulator-only persistence)
persisted = load_state()
if isinstance(persisted, dict):
    simulation_state.update(persisted)

# Datos de dispositivos
DEVICES = [
    {'name': 'PC de Trabajo', 'vuln': 'Media', 'icon': '💻'},
    {'name': 'Smartphone', 'vuln': 'Media', 'icon': '📱'},
    {'name': 'Servidor Web', 'vuln': 'Alta', 'icon': '🖥️'},
    {'name': 'Router', 'vuln': 'Baja', 'icon': '📡'}
]

# Tipos de ataque
ATTACKS = [
    'Fuerza Bruta',
    'Ataque Diccionario',
    'Credential Stuffing',
    'Phishing'
]

# Evaluación de contraseñas para el simulador
common_passwords = [
    '123456', 'password', 'qwerty', '123456789', '12345678', '12345', 'admin', 'letmein'
]

def evaluate_password_strength(password):
    if not password:
        return {
            'password': password,
            'score': 0,
            'label': 'Muy débil',
            'nivel': 'Muy débil',
            'mensaje': 'Contraseña vacía',
            'is_common': False,
            'recommendations': ['Usa una contraseña segura.']
        }

    score = 0
    issues = []

    if len(password) >= 8:
        score += 15
    else:
        issues.append('menos de 8 caracteres')

    if len(password) >= 12:
        score += 25
    if len(password) >= 15:
        score += 20

    if any(c.isupper() for c in password):
        score += 10
    else:
        issues.append('sin mayúsculas')

    if any(c.islower() for c in password):
        score += 10
    else:
        issues.append('sin minúsculas')

    if any(c.isdigit() for c in password):
        score += 10
    else:
        issues.append('sin números')

    if any(not c.isalnum() for c in password):
        score += 15
    else:
        issues.append('sin símbolos')

    is_common = any(common in password.lower() for common in common_passwords)
    if is_common:
        score -= 25
        issues.append('contraseña común o predecible')

    score = max(0, min(score, 100))
    if score >= 80:
        label = 'Fuerte'
        nivel = 'Fuerte'
    elif score >= 50:
        label = 'Media'
        nivel = 'Media'
    else:
        label = 'Débil'
        nivel = 'Débil'

    mensaje = 'Evaluación completada'
    if issues:
        mensaje = f"La evaluación detectó: {', '.join(issues)}"

    recommendations = []
    if 'menos de 8 caracteres' in issues:
        recommendations.append('Aumenta la longitud de la contraseña a 12 o más caracteres.')
    if 'sin mayúsculas' in issues:
        recommendations.append('Incluye letras mayúsculas.')
    if 'sin minúsculas' in issues:
        recommendations.append('Incluye letras minúsculas.')
    if 'sin números' in issues:
        recommendations.append('Incluye números.')
    if 'sin símbolos' in issues:
        recommendations.append('Incluye símbolos especiales.')
    if is_common:
        recommendations.append('Evita palabras comunes y patrones predecibles.')
    if not recommendations:
        recommendations.append('Usa una contraseña única y evita patrones comunes.')

    return {
        'password': password,
        'score': score,
        'label': label,
        'nivel': nivel,
        'mensaje': mensaje,
        'is_common': is_common,
        'recommendations': recommendations
    }


def get_attack_outcome(attack, evaluation):
    score = evaluation.get('score', 0)
    success = False
    step = 10
    message = 'El ataque no logró comprometer el objetivo.'

    if attack == 'Fuerza Bruta':
        if score < 50:
            success = True
            step = 7
            message = 'La contraseña fue comprometida tras un ataque de fuerza bruta.'
    elif attack == 'Ataque Diccionario':
        if score < 60 or evaluation.get('is_common'):
            success = True
            step = 8
            message = 'El ataque por diccionario encontró coincidencias en la contraseña.'
    elif attack == 'Credential Stuffing':
        if score < 55 or evaluation.get('is_common'):
            success = True
            step = 8
            message = 'Las credenciales reutilizadas fueron explotadas con éxito.'
    elif attack == 'Phishing':
        if score < 70:
            success = True
            step = 8
            message = 'El phishing logró obtener las credenciales del usuario.'

    return {
        'success': success,
        'step': step,
        'message': message
    }

# Servir archivos HTML
@app.route('/')
@app.route('/HTML/<path:path>')
def serve_html(path=None):
    if path is None:
        return send_from_directory(os.path.join(BASE_DIR, 'HTML'), 'simulador.html')
    return send_from_directory(os.path.join(BASE_DIR, 'HTML'), path)

@app.route('/CSS/<path:path>')
def serve_css(path):
    return send_from_directory(os.path.join(BASE_DIR, 'CSS'), path)

@app.route('/SVG/<path:path>')
def serve_svg(path):
    return send_from_directory(os.path.join(BASE_DIR, 'SVG'), path)

# API Endpoints
@app.route('/api/devices', methods=['GET'])
def get_devices():
    return jsonify(DEVICES)

@app.route('/api/attacks', methods=['GET'])
def get_attacks():
    return jsonify(ATTACKS)

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify(simulation_state)

@app.route('/api/evaluate-password', methods=['POST'])
def evaluate_password():
    data = request.json or {}
    password = data.get('password', '')
    evaluation = evaluate_password_strength(password)
    return jsonify(evaluation)

@app.route('/api/simulate', methods=['POST'])
def start_simulation():
    data = request.json or {}
    device = data.get('device')
    attack = data.get('attack')
    password = data.get('password', '')

    if not device or not attack or not password:
        return jsonify({'error': 'Faltan parámetros'}), 400

    evaluation = evaluate_password_strength(password)
    outcome = get_attack_outcome(attack, evaluation)

    simulation_state['running'] = True
    simulation_state['progress'] = 0
    simulation_state['logs'] = []
    simulation_state['device'] = device
    simulation_state['attack'] = attack
    simulation_state['status'] = 'running'
    simulation_state['password'] = password
    simulation_state['password_evaluation'] = evaluation

    thread = threading.Thread(target=run_simulation, args=(device, attack, password, evaluation, outcome))
    thread.daemon = True
    thread.start()

    try:
        save_state(simulation_state)
    except Exception:
        pass

    return jsonify({'message': f'Simulación iniciada en {device} con {attack}', 'evaluation': evaluation, 'resistant': not outcome['success']})


def run_simulation(device, attack, password, evaluation, outcome):
    global simulation_state

    add_log("🟢 Sistema listo para simular", 'system')
    add_log(f"📱 Dispositivo seleccionado: {device}", 'system')
    add_log(f"⚡ Ataque seleccionado: {attack}", 'warning')
    add_log("🔐 Contraseña recibida y evaluada", 'system')
    add_log(f"🧪 Resultado: {evaluation['label']} ({evaluation['score']}/100)", 'system')
    if evaluation['is_common']:
        add_log("⚠️ La contraseña es común o predecible", 'warning')
    else:
        add_log("🛡️ La contraseña no parece ser común", 'system')
    if evaluation['recommendations']:
        add_log(f"💡 {evaluation['recommendations'][0]}", 'warning')
    add_log(f"🔄 Iniciando {attack} contra {device}...", 'system')

    compromised = False
    steps = 10
    for i in range(1, steps + 1):
        if not simulation_state['running']:
            break

        time.sleep(random.uniform(0.5, 1.5))
        progress = int((i / steps) * 100)
        simulation_state['progress'] = progress

        if attack == 'Fuerza Bruta':
            if i == 3:
                add_log("🔍 Probando combinaciones de contraseñas (30%)", 'info')
            elif i == 6:
                add_log("🔍 Probando combinaciones de contraseñas (60%)", 'info')
            elif i == 9:
                add_log("🔑 Intentando combinaciones comunes", 'warning')
            elif i == 10:
                add_log(f"✅ ¡Ataque exitoso! {device} comprometido", 'success')

        elif attack == 'Ataque Diccionario':
            if i == 3:
                add_log("📖 Cargando diccionario de 10,000 palabras", 'info')
            elif i == 6:
                add_log("🔍 Probando palabras comunes (60%)", 'info')
            elif i == 8:
                add_log("⚠️ Palabras comunes detectadas", 'warning')
            elif i == 10:
                add_log("✅ ¡Ataque exitoso! Credenciales obtenidas", 'success')

        elif attack == 'Credential Stuffing':
            if i == 3:
                add_log("📊 Cargando 50,000 credenciales filtradas", 'info')
            elif i == 6:
                add_log("🔄 Probando credenciales reutilizadas (60%)", 'info')
            elif i == 8:
                add_log("⚠️ Se encontraron credenciales reutilizadas", 'warning')
            elif i == 10:
                add_log("✅ ¡Ataque exitoso! Múltiples cuentas comprometidas", 'success')

        elif attack == 'Phishing':
            if i == 3:
                add_log("📧 Enviando correo de phishing (30%)", 'info')
            elif i == 6:
                add_log("📧 Enviando correo de phishing (60%)", 'info')
            elif i == 8:
                add_log("👤 Usuario hizo clic en enlace malicioso", 'warning')
            elif i == 10:
                add_log("✅ ¡Ataque exitoso! Credenciales robadas", 'success')

        if i == outcome['step']:
            if outcome['success']:
                add_log(f"⚠️ {outcome['message']}", 'warning')
                compromised = True
            else:
                add_log(f"🛡️ {outcome['message']}", 'success')

        time.sleep(0.3)

    if simulation_state['running']:
        simulation_state['status'] = 'completed'
        if compromised:
            add_log("⚠️ Recomendación: usa una contraseña más larga, aleatoria y única", 'warning')
        else:
            add_log("✅ La contraseña mostró buena resistencia frente al ataque", 'success')
    else:
        simulation_state['status'] = 'stopped'

    simulation_state['running'] = False
    try:
        save_state(simulation_state)
    except Exception:
        pass


def add_log(message, log_type='system'):
    simulation_state['logs'].append({
        'message': message,
        'type': log_type,
        'timestamp': time.strftime('%H:%M:%S')
    })
    if len(simulation_state['logs']) > 50:
        simulation_state['logs'].pop(0)
    try:
        save_state({
            'logs': simulation_state['logs'],
            'status': simulation_state.get('status'),
            'progress': simulation_state.get('progress'),
            'device': simulation_state.get('device'),
            'attack': simulation_state.get('attack')
        })
    except Exception:
        pass

@app.route('/api/stop', methods=['POST'])
def stop_simulation():
    simulation_state['running'] = False
    simulation_state['status'] = 'stopped'
    add_log("⏹️ Simulación detenida", 'warning')
    try:
        save_state(simulation_state)
    except Exception:
        pass
    return jsonify({'message': 'Simulación detenida'})

@app.route('/api/reset', methods=['POST'])
def reset_simulation():
    global simulation_state
    simulation_state = {
        'running': False,
        'progress': 0,
        'logs': [],
        'device': None,
        'attack': None,
        'status': 'idle',
        'password': None,
        'password_evaluation': None
    }
    try:
        save_state(simulation_state)
    except Exception:
        pass
    return jsonify({'message': 'Simulación reiniciada'})

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 GHOST_NET - Servidor de Simulación")
    print("="*50)
    print(f"📍 Accede a: http://localhost:5000")
    print("="*50)
    print("Presiona Ctrl+C para detener\n")
    app.run(debug=True, port=5000, host='0.0.0.0')
