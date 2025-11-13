import os
import json
import base64
import numpy as np
from io import BytesIO
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
from dotenv import load_dotenv
import logging
from tensorflow import keras

# extras
from twilio.rest import Client
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

# local
from model_trainer import TeethDiseaseModel
from grad_cam import get_gradcam_heatmap
from auth_utils import create_user, verify_user

# load env
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SmileCare1")

app = Flask(__name__)
CORS(app, origins=os.getenv("CORS_ALLOWED_ORIGINS", "*"))

# config
MODEL_PATH = os.getenv("MODEL_PATH", "./models/teeth_disease_model.h5")
TW_SID = os.getenv("TWILIO_SID")
TW_AUTH = os.getenv("TWILIO_AUTH")
TW_FROM = os.getenv("TWILIO_FROM")
TW_WHATSAPP_FROM = os.getenv("TWILIO_WHATSAPP_FROM")
GOOGLE_MAPS_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
JWT_SECRET = os.getenv("JWT_SECRET_KEY", "change_this_secret_for_prod")

app.config["JWT_SECRET_KEY"] = JWT_SECRET
jwt = JWTManager(app)

# load wrapper
model_wrapper = TeethDiseaseModel(model_path=MODEL_PATH)
if model_wrapper.model is None:
    try:
        model_wrapper.model = keras.models.load_model(MODEL_PATH, compile=False)
        logger.info("Keras model loaded directly")
    except Exception:
        logger.exception("Could not load Keras model")

# disease KB
DISEASE_KB = {
    "Caries": {"name":"Dental Caries","summary":"Caries description","symptoms":["Tooth pain"], "causes":["Sugar"], "care_and_precautions":["Brushing"], "treatment":["Filling"], "risk_factors":["Poor hygiene"], "when_to_see_dentist":"If severe pain", "prevention":["Avoid sugar"], "emergency_signs":["Severe swelling"]},
    "Calculus": {"name":"Calculus (Tartar)","summary":"Calculus description","symptoms":["Hard deposits"], "causes":["Plaque"], "care_and_precautions":["Scaling"], "treatment":["Scaling & polishing"], "risk_factors":["Poor hygiene"], "when_to_see_dentist":"If visible deposits", "prevention":["Good brushing"], "emergency_signs":["Infection"]},
    "Gingivitis": {"name":"Gingivitis","summary":"Gingivitis description","symptoms":["Red/bleeding gums"], "causes":["Plaque"], "care_and_precautions":["Brush & floss"], "treatment":["Professional cleaning"], "risk_factors":["Smoking"], "when_to_see_dentist":"Gums bleed regularly", "prevention":["Regular cleaning"], "emergency_signs":["Pus"]},
    "Periodontitis": {"name":"Periodontitis","summary":"Periodontitis description","symptoms":["Loose teeth"], "causes":["Untreated gingivitis"], "care_and_precautions":["Oral hygiene"], "treatment":["Scaling, root planing"], "risk_factors":["Diabetes"], "when_to_see_dentist":"Loose teeth", "prevention":["Treat gingivitis"], "emergency_signs":["Tooth loss"]},
    "Healthy": {"name":"Healthy","summary":"No disease detected","symptoms":[], "causes":[], "care_and_precautions":["Maintain hygiene"], "treatment":[], "risk_factors":[], "when_to_see_dentist":"Routine checkups", "prevention":["Brush daily"], "emergency_signs":[]}
}

# init Twilio client if configured
twilio_client = None
if TW_SID and TW_AUTH:
    twilio_client = Client(TW_SID, TW_AUTH)

@app.route("/")
def index():
    return jsonify({"SmileCare1": "AI Dental Health Detection Platform", "status": "running"})

@app.route("/health")
def health():
    return jsonify({"status": "ok", "model_loaded": model_wrapper.model is not None})

# auth endpoints
@app.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    try:
        user = create_user(data["email"], data["password"], data.get("name", ""))
        token = create_access_token(identity=user["email"])
        return jsonify({"status":"success","user":user,"token":token})
    except Exception as e:
        return jsonify({"status":"error","message":str(e)}), 400

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    user = verify_user(data["email"], data["password"])
    if not user:
        return jsonify({"status":"error","message":"Invalid credentials"}), 401
    token = create_access_token(identity=user["email"])
    return jsonify({"status":"success","user":user,"token":token})

# predict
@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        if "image" in request.files:
            image = Image.open(request.files["image"]).convert("RGB").resize((224, 224))
        elif "image_base64" in request.form:
            data = base64.b64decode(request.form["image_base64"])
            image = Image.open(BytesIO(data)).convert("RGB").resize((224, 224))
        else:
            return jsonify({"status":"error","message":"No image provided"}), 400

        img_array = np.array(image) / 255.0
        res = model_wrapper.predict(img_array)
        label = res.get("predicted_class")
        confidence = res.get("confidence")
        all_preds = res.get("all_confidences", {})
        report = DISEASE_KB.get(label, {"name": label, "summary": "No info available"})
        return jsonify({"status":"success", "disease_label": label, "disease_name": report["name"], "confidence": confidence, "all_predictions": all_preds, "disease_report": report})
    except Exception as e:
        logger.exception("Prediction error")
        return jsonify({"status":"error","message":str(e)}), 500

# heatmap endpoint
@app.route("/api/heatmap", methods=["POST"])
def heatmap():
    try:
        if "image" not in request.files:
            return jsonify({"status":"error","message":"No image file"}), 400
        f = request.files["image"]
        image = Image.open(f.stream).convert("RGB").resize((224,224))
        img_arr = np.array(image) / 255.0

        mdl = model_wrapper.model
        if mdl is None:
            return jsonify({"status":"error","message":"Model not loaded"}), 500

        heatmap = get_gradcam_heatmap(mdl, img_arr)
        import cv2
        img = (img_arr * 255).astype("uint8")
        heatmap_uint8 = (heatmap * 255).astype("uint8")
        heatmap_color = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
        overlay = cv2.addWeighted(img, 0.6, heatmap_color[..., ::-1], 0.4, 0)

        _, png = cv2.imencode('.png', overlay)
        return send_file(BytesIO(png.tobytes()), mimetype='image/png')
    except Exception as e:
        logger.exception("Heatmap error")
        return jsonify({"status":"error","message":str(e)}), 500

# twilio sms
@app.route("/api/send-sms", methods=["POST"])
@jwt_required(optional=True)
def send_sms():
    if not twilio_client:
        return jsonify({"status":"error","message":"Twilio not configured"}), 500
    data = request.get_json()
    to = data.get("to")
    body = data.get("body", "Hello from SmileCare1")
    try:
        msg = twilio_client.messages.create(body=body, from_=TW_FROM, to=to)
        return jsonify({"status":"success","sid": msg.sid})
    except Exception as e:
        logger.exception("Twilio error")
        return jsonify({"status":"error","message":str(e)}), 500

@app.route("/api/send-whatsapp", methods=["POST"])
@jwt_required(optional=True)
def send_whatsapp():
    if not twilio_client:
        return jsonify({"status":"error","message":"Twilio not configured"}), 500
    data = request.get_json()
    to = data.get("to")
    body = data.get("body", "Hello from SmileCare1")
    try:
        msg = twilio_client.messages.create(body=body, from_=TW_WHATSAPP_FROM, to=to)
        return jsonify({"status":"success","sid": msg.sid})
    except Exception as e:
        logger.exception("Twilio WA error")
        return jsonify({"status":"error","message":str(e)}), 500

# booking and gps logging
@app.route("/api/book", methods=["POST"])
def book_consult():
    data = request.get_json()
    os.makedirs("bookings", exist_ok=True)
    file_path = f"bookings/{data.get('email','unknown')}.json"
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)
    return jsonify({"status":"success","booking": data})

@app.route("/api/log-location", methods=["POST"])
def log_location():
    data = request.get_json()
    os.makedirs("gps_logs", exist_ok=True)
    with open("gps_logs/locations.json", "a") as f:
        f.write(json.dumps(data) + "\n")
    return jsonify({"status":"success"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("FLASK_PORT", 5000)), debug=True)
