**BlocMeds Admin Portal V2** By integrating Base Hashgraph's distributed ledger technology (DLT), EVM-compatible smart contract, and AI-driven analytics, this platform offers an immutable, scalable solution to combat counterfeit drugs. With a sleek, responsive interface featuring multi-step forms, interactive dashboards, and real-time visualizations, BlocMeds V2 empowers regulators with tools for batch tracking, manufacturer verification, and predictive counterfeit detection.

## Mission
**"To build a transparent, secure, and inclusive pharmaceutical ecosystem, reducing the rate of counterfeit medicines by 30% within two years through Base’s immutable distributed ledger and AI-powered insights."**

##  Key Features

### Core Functionality
- **Secure Batch Uploads**: Intuitive multi-step form with progress tracking, uploading drug batches to Base with Base Consensus logging.
- **Manufacturer Verification**: Admin-controlled smart contract interface to approve or revoke manufacturers using Base wallets.
- **AI Counterfeit Analytics**: Machine learning detects anomalies and predicts hotspots, displayed on interactive Leaflet maps and Chart.js charts.
- 
### Design & Usability
- **Responsive UI**: Gradient backgrounds, floating shapes, and smooth animations enhance user experience.
- **Inclusive Design**: Supports QR scanning for urban users, with USSD integration planned for rural access.
- **Accessibility**: High-contrast themes and keyboard navigation-ready.

### Technical Edge
- **Base DLT**: Base Consensus for event logging and EVM smart contract for secure operations.
- **AI Integration**: Flask-based backend with scikit-learn for real-time analysis.

##  Tech Stack

- **Frontend**: HTML5, CSS3 (animations), JavaScript, Leaflet.js (maps), Chart.js (charts), Font Awesome (icons).
- **Backend**: Node.js/Express (API), Python Flask (AI), Firebase (data), Base SDK (DLT).
- **Distributed Ledger Technology (DLT)**: Base Hashgraph (Base Consensus, EVM).
- **AI/ML**: scikit-learn for anomaly detection.
- **Utilities**: XLSX.js (file processing).

##  Getting Started

### Prerequisites
- Node.js v18+, Python 3.9+
- Base testnet account ([portal.base.com](https://portal.base.com))
- HashPack wallet
- Ports 3000 (backend), 5001 (AI) available

### Installation

1. **Clone the Repo**

   git clone https://github.com/Marvellye/BlocMeds.git
   cd BlocMeds-Admin-V2
   

2. **Backend Setup**
   
   cd backend
   npm install
   cp .env.example .env  # Add Base TOPIC_ID, OPERATOR_ID, PRIVATE_KEY
   node server.js
   

3. **AI Service Setup**
   
   Create in a virtual enviroment
   
   cd ../ai-service
   
   pip install -r requirements.txt
   
   pip install flask-cors
   
   pip install flask firebase-admin
   run the program
   python app.py
   

4. **Run Frontend**
   - Open `index.html` in a browser or use `live-server`.
   - Navigate sections via navbar.

5. **Test Features**
   - Upload a batch (e.g., Drug: Aspirin, Batch: BATCH-2025-002).
   - Verify a manufacturer address.
   - Run AI analysis for hotspot visualization.

### API Endpoints
- POST /api/drugs/upload` - Batch submission.
- POST /api/manufacturers/verify` - Approve manufacturer.
- POST /api/analyze` - Trigger AI insights.

### Deployment
- **Backend**: Railway or Heroku.
- **AI**: Railway with model hosting.
- **Frontend**: Netlify or GitHub Pages.

If you want to use the scanner app after uploading a medicine through Admin V2, make sure the API endpoint reads from the drug_batches collection instead of the drug collection.
