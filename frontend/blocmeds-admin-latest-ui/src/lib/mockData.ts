export interface Batch {
  id: string;
  batchId: string;
  drugName: string;
  manufacturer: string;
  expiry: string;
  quantity: number;
  status: 'verified' | 'pending' | 'flagged';
  location: { lat: number; lng: number };
}

export interface ScanRecord {
  batchId: string;
  timestamp: string;
  userId: string;
  location: { lat: number; lng: number };
  isAnomaly: boolean;
}

export interface Report {
  id: string;
  type: string;
  date: string;
  details: string;
}

export const generateMockBatches = (): Batch[] => {
  const drugs = [
    'Paracetamol 500mg', 'Amoxicillin 250mg', 'Ibuprofen 400mg', 
    'Metformin 850mg', 'Ciprofloxacin 500mg', 'Omeprazole 20mg',
    'Atorvastatin 10mg', 'Aspirin 75mg', 'Vitamin C 1000mg'
  ];
  
  const manufacturers = ['PharmaCorp', 'MediLife', 'HealthPlus', 'BioMed', 'CureWell'];
  
  const locations = [
    { lat: 6.5244, lng: 3.3792, name: 'Lagos' },
    { lat: 9.0820, lng: 8.6753, name: 'Abuja' },
    { lat: 7.3775, lng: 3.9470, name: 'Ibadan' },
    { lat: 11.9987, lng: 8.5211, name: 'Kano' },
    { lat: 6.4543, lng: 7.5545, name: 'Enugu' }
  ];
  
  const statuses: Array<'verified' | 'pending' | 'flagged'> = ['verified', 'verified', 'verified', 'verified', 'pending', 'flagged'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `batch-${i + 1}`,
    batchId: `RX-2024-${String(i + 1).padStart(3, '0')}A`,
    drugName: drugs[i % drugs.length],
    manufacturer: manufacturers[i % manufacturers.length],
    expiry: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quantity: Math.floor(Math.random() * 5000) + 500,
    status: statuses[i % statuses.length],
    location: locations[i % locations.length]
  }));
};

export const generateMockScans = (): ScanRecord[] => {
  const locations = [
    { lat: 6.5244, lng: 3.3792 },
    { lat: 9.0820, lng: 8.6753 },
    { lat: 7.3775, lng: 3.9470 },
    { lat: 11.9987, lng: 8.5211 },
    { lat: 6.4543, lng: 7.5545 }
  ];
  
  return Array.from({ length: 100 }, (_, i) => ({
    batchId: `RX-2024-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}A`,
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    userId: `user-${Math.floor(Math.random() * 20) + 1}`,
    location: locations[i % locations.length],
    isAnomaly: Math.random() > 0.9
  }));
};

export const initializeLocalStorage = () => {
  if (!localStorage.getItem('batches')) {
    localStorage.setItem('batches', JSON.stringify(generateMockBatches()));
  }
  if (!localStorage.getItem('scanHistory')) {
    localStorage.setItem('scanHistory', JSON.stringify(generateMockScans()));
  }
  if (!localStorage.getItem('reports')) {
    localStorage.setItem('reports', JSON.stringify([]));
  }
  if (!localStorage.getItem('settings')) {
    localStorage.setItem('settings', JSON.stringify({
      theme: 'light',
      notifications: true
    }));
  }
  if (!localStorage.getItem('verifiedManufacturers')) {
    localStorage.setItem('verifiedManufacturers', JSON.stringify([]));
  }
};
