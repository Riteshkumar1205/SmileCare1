import os, json
from werkzeug.security import generate_password_hash, check_password_hash

USERS_FILE = "users.json"

def _load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r") as f:
        try:
            return json.load(f)
        except Exception:
            return {}

def _save_users(data):
    with open(USERS_FILE, "w") as f:
        json.dump(data, f, indent=2)

def create_user(email, password, name):
    users = _load_users()
    if email in users:
        raise ValueError("User already exists")
    pw_hash = generate_password_hash(password)
    users[email] = {"name": name, "password": pw_hash}
    _save_users(users)
    return {"email": email, "name": name}

def verify_user(email, password):
    users = _load_users()
    u = users.get(email)
    if not u:
        return None
    if check_password_hash(u["password"], password):
        return {"email": email, "name": u.get("name")}
    return None
