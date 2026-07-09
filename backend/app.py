from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import threading
import time
import random
import os

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
    'status': 'idle'
}

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

@app.route('/api/simulate', methods=['POST'])
def start_simulation():
    data = request.json
    device = data.get('device')
    attack = data.get('attack')
    
    if not device or not attack:
        return jsonify({'error': 'Faltan parámetros'}), 400
    
    # Reiniciar estado
    simulation_state['running'] = True
    simulation_state['progress'] = 0
    simulation_state['logs'] = []
    simulation_state['device'] = device
    simulation_state['attack'] = attack
    simulation_state['status'] = 'running'
    
    # Iniciar simulación en hilo separado
    thread = threading.Thread(target=run_simulation, args=(device, attack))
    thread.daemon = True
    thread.start()
    
    return jsonify({'message': f'Simulación iniciada en {device} con {attack}'})

def run_simulation(device, attack):
    global simulation_state
    
    add_log(f"🟢 Sistema listo para simular", 'system')
    add_log(f"📱 Dispositivo seleccionado: {device}", 'system')
    add_log(f"⚡ Ataque seleccionado: {attack}", 'warning')
    add_log(f"🔄 Iniciando {attack} contra {device}...", 'system')
    
    steps = 10
    for i in range(1, steps + 1):
        if not simulation_state['running']:
            break
        
        time.sleep(random.uniform(0.5, 1.5))
        progress = int((i / steps) * 100)
        simulation_state['progress'] = progress
        
        # Logs según el ataque
        if attack == 'Fuerza Bruta':
            if i == 3:
                add_log(f"🔍 Probando combinaciones de contraseñas (30%)", 'info')
            elif i == 6:
                add_log(f"🔍 Probando combinaciones de contraseñas (60%)", 'info')
            elif i == 9:
                add_log(f"🔑 Contraseña encontrada: admin123", 'warning')
            elif i == 10:
                add_log(f"✅ ¡Ataque exitoso! {device} comprometido", 'success')
        
        elif attack == 'Ataque Diccionario':
            if i == 3:
                add_log(f"📖 Cargando diccionario de 10,000 palabras", 'info')
            elif i == 6:
                add_log(f"🔍 Probando palabras comunes (60%)", 'info')
            elif i == 8:
                add_log(f"⚠️ Contraseña 'password' encontrada", 'warning')
            elif i == 10:
                add_log(f"✅ ¡Ataque exitoso! Credenciales obtenidas", 'success')
        
        elif attack == 'Credential Stuffing':
            if i == 3:
                add_log(f"📊 Cargando 50,000 credenciales filtradas", 'info')
            elif i == 6:
                add_log(f"🔄 Probando credenciales reutilizadas (60%)", 'info')
            elif i == 8:
                add_log(f"⚠️ 3 cuentas con credenciales válidas", 'warning')
            elif i == 10:
                add_log(f"✅ ¡Ataque exitoso! Múltiples cuentas comprometidas", 'success')
        
        elif attack == 'Phishing':
            if i == 3:
                add_log(f"📧 Enviando correo de phishing (30%)", 'info')
            elif i == 6:
                add_log(f"📧 Enviando correo de phishing (60%)", 'info')
            elif i == 8:
                add_log(f"👤 Usuario hizo clic en enlace malicioso", 'warning')
            elif i == 10:
                add_log(f"✅ ¡Ataque exitoso! Credenciales robadas", 'success')
        
        time.sleep(0.3)
    
    if simulation_state['running']:
        simulation_state['status'] = 'completed'
        add_log(f"🔒 Recomendación: Usar contraseñas fuertes", 'warning')
    else:
        simulation_state['status'] = 'stopped'
    
    simulation_state['running'] = False

def add_log(message, log_type='system'):
    simulation_state['logs'].append({
        'message': message,
        'type': log_type,
        'timestamp': time.strftime('%H:%M:%S')
    })
    if len(simulation_state['logs']) > 50:
        simulation_state['logs'].pop(0)

@app.route('/api/stop', methods=['POST'])
def stop_simulation():
    simulation_state['running'] = False
    simulation_state['status'] = 'stopped'
    add_log("⏹️ Simulación detenida", 'warning')
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
        'status': 'idle'
    }
    return jsonify({'message': 'Simulación reiniciada'})

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 GHOST_NET - Servidor de Simulación")
    print("="*50)
    print(f"📍 Accede a: http://localhost:5000")
    print("="*50)
    print("Presiona Ctrl+C para detener\n")
    app.run(debug=True, port=5000, host='0.0.0.0')
