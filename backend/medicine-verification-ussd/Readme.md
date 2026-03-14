# BlocMeds USSD Backend (FastAPI)

This project is a **USSD-based drug verification system** built with **FastAPI**, integrated with **Firebase Firestore** for drug metadata and **Base Hashgraph** for on-chain verification.

It allows users with **basic feature phones** to verify medicines by dialing a USSD shortcode (e.g., `*384#`), making it accessible to everyone, not just smartphone users.

---

## 📂 Project Structure

```
medicine-verification-ussd/
├── main.py                  # FastAPI app entry point
├── firebase_utils.py        # Firebase Firestore integration
├── base_utils.py          # Base verification logic
├── serviceAccountKey.json   # Firebase credentials (DO NOT SHARE PUBLICLY)
├── .env                     # Environment variables
├── requirements.txt         # Python dependencies
├── venv/                    # Virtual environment (optional)
└── ext/, __pycache__/       # Internal folders
```

---

## ⚙️ Requirements

* Python 3.9+
* pip
* [FlowSim: Universal USSD Simulator]() (for local testing)

> ⚠️ Note: I initially tested with Africa’s Talking USSD Sandbox, but it gave me a lot of issues. I switched to **FlowSim**, though i reprogrammed some parts of the program using **Go, HTML, CSS, and JavaScript**.

---

## 🚀 Setup Instructions

1. **Create a virtual environment (optional but recommended)**

   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the FastAPI server**

   ```bash
   uvicorn main:app --reload
   ```

4. **Configure FlowSim USSD endpoint**

   * Set the USSD callback URL to:

     ```
     http://localhost:8000/ussd
     ```

---

## 📱 Testing the Flow

1. Dial `*384#` in FlowSim.
2. Enter a **valid drug Batch ID**.
3. You should see a response like:

   ```json
   {
     "batchId": "BATCH12345",
     "name": "Paracetamol",
     "expiryDate": "2026-08-15",
     "manufacturer": "XYZ Pharma"
   }
   ```

---

## 🔥 Firebase Setup

* Ensure your Firestore has a collection named **`drugs`**.
* Each document ID should match a batch ID (e.g., `ABC123`).
* Example document format:

  ```json
  {
    "batchId": "BATCH12345",
    "name": "Paracetamol",
    "expiryDate": "2026-08-15",
    "manufacturer": "XYZ Pharma"
  }
  ```

---

## ⛓️ Base Integration

* `base_utils.py` currently contains **placeholder logic**.
* Replace it with **Base SDK calls** to:

  * Mint tokens for each medicine batch.
  * Verify authenticity directly on-chain.

---

## 🔐 Security Notes

* Never commit `serviceAccountKey.json` publicly.
* Use `.env` to securely store secrets such as API keys and private keys.
* For production, rotate keys regularly and enable proper access control in Firebase.

---
