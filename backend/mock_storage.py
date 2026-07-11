import json
import os

STORAGE_FILE = os.path.join(os.path.dirname(__file__), 'sim_state.json')


def load_state():
    try:
        if not os.path.exists(STORAGE_FILE):
            return None
        with open(STORAGE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return None


def save_state(state):
    try:
        with open(STORAGE_FILE, 'w', encoding='utf-8') as f:
            json.dump(state, f, ensure_ascii=False, indent=2)
        return True
    except Exception:
        return False
