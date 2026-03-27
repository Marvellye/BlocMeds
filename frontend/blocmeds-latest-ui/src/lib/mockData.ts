export const verifiedCodes = [
  'RX-2024-001A',
  'RX-2024-002B',
  'RX-2024-003C',
  'RX-2024-004D',
  'RX-2024-005E',
];

export const fakeCodes = [
  'FAKE-001',
  'FAKE-002',
  'FAKE-003',
];

export interface DrugVerificationResult {
  status: 'verified' | 'fake' | 'invalid';
  batchId: string;
  drugName?: string;
  expiry?: string;
  manufacturer?: string;
  tokenId?: string;
  reward: number;
}

export const mockVerify = (batchId: string): DrugVerificationResult => {
  if (verifiedCodes.includes(batchId)) {
    return {
      status: 'verified',
      batchId,
      drugName: 'Paracetamol 500mg',
      expiry: '2025-12-31',
      manufacturer: 'PharmaCorp Ltd.',
      tokenId: `TKN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      reward: 10,
    };
  }
  
  if (fakeCodes.includes(batchId)) {
    return {
      status: 'fake',
      batchId,
      drugName: 'Unknown',
      expiry: 'N/A',
      manufacturer: 'Unknown',
      reward: 50,
    };
  }
  
  return {
    status: 'invalid',
    batchId,
    reward: 0,
  };
};

export const verifyDrug = async (batchId: string): Promise<DrugVerificationResult> => {
  try {
    const response = await fetch(
      `https://blocmeds-backend.onrender.com/api/drugs/verify/${batchId}`
    );
    
    if (!response.ok) {
      console.warn('API request failed, using mock data');
      return mockVerify(batchId);
    }
    
    const data = await response.json();
    
    return {
      status: data.status || 'invalid',
      batchId: data.batchId || batchId,
      drugName: data.drugName,
      expiry: data.expiry,
      manufacturer: data.manufacturer,
      tokenId: data.tokenId,
      reward: data.status === 'verified' ? 10 : data.status === 'fake' ? 50 : 0,
    };
  } catch (error) {
    console.error('API error, using mock data:', error);
    return mockVerify(batchId);
  }
};

export const leaderboard = [
  { username: 'DrVerifier', score: 45 },
  { username: 'MedGuard', score: 38 },
  { username: 'PharmaHawk', score: 32 },
  { username: 'HealthWatch', score: 28 },
  { username: 'SafeMeds', score: 24 },
];
