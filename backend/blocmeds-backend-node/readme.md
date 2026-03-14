
# BlocMeds Backend (Node.js + Express)

BlocMeds is Africa’s first medicine verification system that uses **Base’s distributed ledger technology**, **QR scanning**, and **USSD support** to fight counterfeit medicines. This repository contains the **backend service**, built with **Node.js + Express**, integrated with **Firebase** and the **Base SDK**.


## ⚙️ Installation & Setup

1. **Clone the repo**

```bash
git clone https://github.com/myusername/blocmeds-backend-node.git
cd blocmeds-backend-node
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

```
PORT=5000
BASE_ACCOUNT_ID=your-account-id
BASE_PRIVATE_KEY=your-private-key
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY=your-firebase-private-key
```

4. **Add Firebase service key**
   Place your `serviceAccountKey.json` file inside the root directory.

5. **Run the server**

```bash
npm start
```

Backend will be running at:
👉 `http://localhost:5000`

---

## 📡 API Endpoints

### Upload Medicine Batch

```
POST /api/drugs/upload
```

* Uploads medicine batch data
* Mints a token on **Base DLT**
* Saves metadata to **Firebase**

Example request:

```json
{
  "batchId": "BATCH12345",
  "name": "Paracetamol",
  "expiryDate": "2026-08-15",
  "manufacturer": "XYZ Pharma"
}
```

### Verify Medicine

```
GET /api/drugs/verify/:batchId
```

* Returns authenticity info from Base + Firebase

---

## 🧪 Testing

Use the provided **Postman collection** in `/postman` to test all API endpoints.

---

## 🛠️ Tech Stack

* **Node.js + Express** – Backend framework
* **Firebase Firestore** – Data storage
* **Base SDK** – DLT integration
* **Postman** – API testing



