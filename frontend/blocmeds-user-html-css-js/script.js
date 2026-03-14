// Mock Data for Testing (Fallback)
const verifiedCodes = ['RX-2024-001A', 'RX-2024-002B', 'RX-2024-003C', 'RX-2024-004D', 'RX-2024-005E', 'RX-2024-006F', 'RX-2024-007G', 'RX-2024-008H', 'RX-2024-009I', 'RX-2024-010J'];
const fakeCodes = ['FAKE-001', 'FAKE-002', 'FAKE-003', 'FAKE-004', 'FAKE-005'];
const leaderboardData = [
  { username: 'VerifierPro', score: 1200 },
  { username: 'DrugHunter', score: 950 },
  { username: 'RxGuard', score: 800 },
  { username: 'FakeBuster', score: 650 },
  { username: 'PillWatch', score: 500 }
];

// User Data (Stored in localStorage)
let user = JSON.parse(localStorage.getItem('user')) || {
  balance: 0,
  scans: 0,
  streak: 0,
  reports: 0,
  trustScore: 0,
  rank: 'Bronze',
  transactions: [],
  recentActivity: [],
  generatedHistory: [],
  reportsHistory: [],
  achievements: []
};
let scanner;
let isScanning = false;
let deferredPrompt;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  if (!localStorage.getItem('user')) showRegisterModal();
  document.getElementById('dark-mode-toggle').onclick = toggleDarkMode;
  document.getElementById('report-form').onsubmit = submitReport;
  document.getElementById('install-btn').onclick = triggerInstallPrompt;

  // Check if browser supports PWA
  if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log('Service Worker registered'))
      .catch(err => {
        console.error('Service Worker registration failed:', err);
        showToast('Failed to register service worker');
      });
  } else {
    document.getElementById('install-fallback').style.display = 'block';
    console.warn('PWA install not supported in this browser');
  }

  // Debug manifest loading
  fetch('/manifest.json')
    .then(res => res.json())
    .then(manifest => console.log('Manifest loaded:', manifest))
    .catch(err => console.error('Failed to load manifest:', err));
});

// PWA Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('install-btn').style.display = 'block';
  console.log('Install prompt available');
  showToast('Install BlocMeds QR to your device!');
});

window.addEventListener('appinstalled', () => {
  showToast('BlocMeds QR installed successfully!');
  document.getElementById('install-btn').style.display = 'none';
  deferredPrompt = null;
});

function triggerInstallPrompt() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        showToast('Installing BlocMeds QR...');
      } else {
        showToast('Installation cancelled');
      }
      deferredPrompt = null;
      document.getElementById('install-btn').style.display = 'none';
    });
  } else {
    showToast('Install prompt not available. Ensure HTTPS and try again.');
    console.warn('No deferred prompt available');
  }
}

// Navigation Between Pages
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

// Update UI Elements
function updateUI() {
  document.getElementById('balance-display').innerText = `ETH: ${user.balance}`;
  document.getElementById('hbar-balance').innerText = user.balance;
  document.getElementById('trust-score').innerText = user.trustScore.toFixed(1);
  document.getElementById('total-scans').innerText = user.scans;
  document.getElementById('verification-stats').innerText = `Scans: ${user.scans} | Streak: ${user.streak}`;
  
  document.getElementById('recent-activity').innerHTML = user.recentActivity.map(act => `<div>${act}</div>`).join('');
  document.getElementById('leaderboard').innerHTML = leaderboardData.map((entry, i) => `<div>${i+1}. ${entry.username} - ${entry.score}</div>`).join('');
  document.getElementById('transaction-history').innerHTML = user.transactions.map(tx => `<div>${tx}</div>`).join('');
  document.getElementById('achievements').innerHTML = user.achievements.map(a => `<div>${a}</div>`).join('');
  document.getElementById('generated-history').innerHTML = user.generatedHistory.map(h => `<div>${h}</div>`).join('');
  document.getElementById('reports-history').innerHTML = user.reportsHistory.map(r => `<div>${r}</div>`).join('');
  
  saveUser();
}

// Save User Data to localStorage
function saveUser() {
  localStorage.setItem('user', JSON.stringify(user));
}

// Toggle Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  document.getElementById('dark-mode-setting').checked = document.body.classList.contains('dark');
}

// Modal Handling
function showModal(content) {
  document.getElementById('modal-body').innerHTML = content;
  document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// User Registration
function showRegisterModal() {
  showModal(`
    <h2>Register</h2>
    <input id="reg-username" placeholder="Username">
    <div class="button-group">
      <button onclick="registerUser()">Register</button>
    </div>
  `);
}

function registerUser() {
  const username = document.getElementById('reg-username').value.trim();
  if (!username) return showToast('Please enter a username');
  user.username = username;
  user.balance = 100;
  user.transactions.push('Welcome bonus: +100 ETH');
  user.recentActivity.push(`Registered as ${username} on ${new Date().toLocaleString()}`);
  document.getElementById('username').innerText = username;
  updateUI();
  closeModal();
  showToast('Welcome! You got 100 ETH bonus.');
}

// QR Scanner
function startScanner() {
  if (isScanning) {
    showToast('Scanner already running');
    return;
  }
  isScanning = true;
  document.getElementById('start-scan-btn').innerHTML = '<i class="fas fa-stop"></i> Stop Scan';
  document.getElementById('start-scan-btn').onclick = stopScanner;
  
  scanner = new Html5Qrcode('reader');
  scanner.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    async (batchId) => {
      showLoading(true);
      try {
        const response = await verifyCode(batchId);
        displayScanResult(response, batchId);
      } catch (err) {
        showModal(`
          <h2>Error</h2>
          <p>Failed to verify: ${err.message}</p>
          <div class="button-group">
            <button onclick="closeModal(); startScanner()">Retry</button>
            <button onclick="closeModal()">Close</button>
          </div>
        `);
      }
      showLoading(false);
      stopScanner();
    },
    (err) => console.warn('Scan error:', err)
  ).catch(err => {
    showToast('Failed to start scanner');
    isScanning = false;
    stopScanner();
  });
}

function stopScanner() {
  if (scanner) {
    scanner.stop().then(() => {
      isScanning = false;
      document.getElementById('start-scan-btn').innerHTML = '<i class="fas fa-camera"></i> Start Scan';
      document.getElementById('start-scan-btn').onclick = startScanner;
      showToast('Scanner stopped');
    }).catch(err => showToast('Error stopping scanner'));
  }
}

// Real API Verification for QR Scanning
async function verifyCode(batchId) {
  try {
    const response = await fetch(`https://blocmeds-backend-production.up.railway.app/api/drugs/verify/${encodeURIComponent(batchId)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('API error:', err);
    // Fallback to mock verification if API fails
    return mockVerify(batchId);
  }
}


// Mock Verification API (Fallback)
function mockVerify(batchId) {
  console.warn('Using mock API as fallback');
  if (verifiedCodes.includes(batchId)) {
    return {
      status: 'verified',
      batchId: batchId,
      drugName: 'Paracetamol 500mg',
      expiry: '2025-12-31',
      manufacturer: 'PharmaCorp Ltd',
      tokenId: `TOKEN-${batchId}`,
      reward: 10
    };
  }
  if (fakeCodes.includes(batchId)) {
    return {
      status: 'fake',
      batchId: batchId,
      drugName: 'Unknown',
      expiry: 'N/A',
      manufacturer: 'N/A',
      tokenId: 'N/A',
      reward: 50
    };
  }
  return {
    status: 'invalid',
    batchId: batchId,
    drugName: 'N/A',
    expiry: 'N/A',
    manufacturer: 'N/A',
    tokenId: 'N/A',
    reward: 0
  };
}

// Display Scan Result
function displayScanResult(res, batchId) {
  const resultEl = document.getElementById('scan-result');
  let content = `
    <strong>Batch ID:</strong> ${res.batchId || 'N/A'}<br>
    <strong>Drug Name:</strong> ${res.drugName || 'N/A'}<br>
    <strong>Expiry:</strong> ${res.expiry || 'N/A'}<br>
    <strong>Manufacturer:</strong> ${res.manufacturer || 'N/A'}<br>
    <strong>Token ID:</strong> ${res.tokenId || 'N/A'}
  `;
  resultEl.innerHTML = content;
  resultEl.style.background = res.status === 'verified' ? '#90EE90' : res.status === 'fake' ? '#ef4444' : '#ccc';
  
  if (res.status === 'fake') {
    content += `<div class="button-group"><button onclick="navigateTo('report-page'); document.getElementById('report-batch').value = '${batchId}'; closeModal()">Report Fake</button></div>`;
  }
  content += `<div class="button-group"><button onclick="startScanner()">Scan Again</button></div>`;
  
  showModal(content);
  
  if (res.reward > 0) {
    user.balance += res.reward;
    user.scans += res.status === 'verified' ? 1 : 0;
    user.streak += res.status === 'verified' ? 1 : 0;
    user.transactions.push(`${res.status} scan: +${res.reward} ETH`);
    user.recentActivity.push(`Scanned ${batchId} - ${res.status} on ${new Date().toLocaleString()}`);
    if (user.scans % 10 === 0) user.achievements.push(`Verifier Badge ${user.scans / 10}`);
    updateRank();
    showToast(`Earned ${res.reward} ETH!`);
  }
  updateUI();
}

// QR Code Generator
function generateQRCode() {
  const batchId = document.getElementById('batch-input').value.trim();
  if (!batchId) return showToast('Enter a valid Batch ID');
  const qrContainer = document.getElementById('qr-output');
  qrContainer.innerHTML = '';
  new QRCode(qrContainer, {
    text: batchId,
    width: 128,
    height: 128,
    colorDark: '#2E8B57',
    colorLight: '#ffffff'
  });
  user.generatedHistory.push(`Generated QR for ${batchId} at ${new Date().toLocaleString()}`);
  updateUI();
  showToast('QR Code generated!');
}

// Download QR Code
function downloadQRCode() {
  const canvas = document.querySelector('#qr-output canvas');
  if (!canvas) return showToast('Generate QR code first');
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'qr.png';
  link.click();
  showToast('QR Code downloaded!');
}

// Share QR Code
function shareQRCode() {
  const canvas = document.querySelector('#qr-output canvas');
  if (!canvas) return showToast('Generate QR code first');
  if (!navigator.canShare) return showToast('Sharing not supported');
  canvas.toBlob(blob => {
    const file = new File([blob], 'qr.png', { type: 'image/png' });
    navigator.share({ files: [file], title: 'BlocMeds QR Code' })
      .then(() => showToast('QR Code shared!'))
      .catch(err => showToast('Failed to share QR code'));
  });
}

// Submit Fake Drug Report
function submitReport(e) {
  e.preventDefault();
  const batch = document.getElementById('report-batch').value.trim();
  if (!batch) return showToast('Enter Batch ID');
  showLoading(true);
  setTimeout(() => {
    user.balance += 50;
    user.reports++;
    user.transactions.push('Fake report: +50 ETH');
    user.reportsHistory.push(`Reported ${batch} at ${new Date().toLocaleString()}`);
    user.recentActivity.push(`Reported fake ${batch} on ${new Date().toLocaleString()}`);
    updateRank();
    updateUI();
    showToast('Report submitted! +50 ETH');
    showLoading(false);
    document.getElementById('report-form').reset();
  }, 1000);
}

// Update User Rank and Trust Score
function updateRank() {
  user.trustScore = (user.scans + user.reports * 2) / 10;
  if (user.trustScore > 10) user.rank = 'Gold';
  else if (user.trustScore > 5) user.rank = 'Silver';
  else user.rank = 'Bronze';
}

// Toast Notification
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3000);
}

// Loading Spinner
function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'flex' : 'none';
}

// Export User Data
function exportData() {
  const data = JSON.stringify(user);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'user-data.json';
  a.click();
  showToast('Data exported!');
}