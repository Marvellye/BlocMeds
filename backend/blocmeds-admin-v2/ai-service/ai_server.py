from flask import Flask, request, jsonify
from sklearn.ensemble import IsolationForest
import numpy as np
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
import time
from collections import defaultdict

app = Flask(__name__)
CORS(app)

# 🔐 Firebase setup
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# 🧠 In-memory scan history
scan_history = []

# 🗺️ Region classifier
def classify_region(lat, lon):
    if lat > 11:
        return "Northern Nigeria"
    elif lat > 7:
        return "Central Nigeria"
    else:
        return "Southern Nigeria"

# 📍 Hotspot generator
def generate_hotspots(anomalies):
    hotspot_map = {
        "Lagos": [6.5244, 3.3792],
        "Kano": [12.0022, 8.5917],
        "Abuja": [9.0765, 7.3985],
        "Sokoto": [13.0600, 5.2400]
    }
    result = []
    for batch_id in anomalies:
        if "LAG" in batch_id:
            result.append({ "coords": hotspot_map["Lagos"], "popup": "Lagos: High Risk (5 incidents)" })
        elif "KANO" in batch_id:
            result.append({ "coords": hotspot_map["Kano"], "popup": "Kano: Medium Risk (3 incidents)" })
        elif "ABJ" in batch_id:
            result.append({ "coords": hotspot_map["Abuja"], "popup": "Abuja: Low Risk (2 incidents)" })
    return result

# 🔍 Core anomaly detection
def run_isolation_forest(raw_data):
    batch_ids = [str(row[0]) for row in raw_data]
    X = np.array([row[1:] for row in raw_data])

    clf = IsolationForest(contamination=0.2, random_state=42)
    clf.fit(X)
    predictions = clf.predict(X)

    anomalies = [batch_ids[i] for i, pred in enumerate(predictions) if pred == -1]

    for i, row in enumerate(raw_data):
        scan_record = {
            "batch_id": str(row[0]),
            "latitude": row[1],
            "longitude": row[2],
            "timestamp": row[3],
            "is_anomaly": bool(predictions[i] == -1),
            "scanned_at": int(time.time())
        }
        db.collection("drug_scans").add(scan_record)
        scan_history.append(scan_record)

    return anomalies

# ✅ Main analysis route
@app.route('/api/analyze', methods=['POST'])
def analyze():
    raw_data = request.json.get('scan_data')
    if not raw_data:
        return jsonify({'error': 'No data provided'}), 400

    anomalies = run_isolation_forest(raw_data)
    prediction = f"{len(anomalies)} suspicious batches detected"
    hotspots = generate_hotspots(anomalies)

    return jsonify({
        "anomalies": anomalies,
        "prediction": prediction,
        "hotspots": hotspots
    })

# 📜 History route
@app.route('/api/scan_history', methods=['GET'])
def get_scan_history():
    return jsonify({
        "history": scan_history,
        "total_scans": len(scan_history),
        "timestamp": int(time.time())
    })

# 📈 Predictive risk route
@app.route('/api/predict_risk', methods=['GET'])
def predict_risk():
    region_counts = defaultdict(lambda: {"total": 0, "anomalies": 0})

    for scan in scan_history:
        region = classify_region(scan["latitude"], scan["longitude"])
        region_counts[region]["total"] += 1
        if scan["is_anomaly"]:
            region_counts[region]["anomalies"] += 1

    risk_map = {}
    for region, counts in region_counts.items():
        total = counts["total"]
        anomalies = counts["anomalies"]
        risk_score = round(anomalies / total, 2) if total > 0 else 0
        risk_map[region] = risk_score

    return jsonify({
        "region_risk": risk_map,
        "generated_at": int(time.time())
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
