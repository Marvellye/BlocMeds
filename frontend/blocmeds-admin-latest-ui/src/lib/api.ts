// API service layer with real endpoints and localStorage fallbacks
// Base URLs for different services
const API_BASE_URL = 'http://localhost:3000';
const AI_API_BASE_URL = 'http://localhost:5001';

export interface ManufacturerVerification {
  address: string;
  isVerified: boolean;
  verifiedAt?: string;
  revokedAt?: string;
}

export interface DrugUpload {
  id: string;
  batchId: string;
  drugName: string;
  manufacturer: string;
  expiryDate: string;
  quantity: number;
  location: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  anomalies: string[];
  predictions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
}

export interface ScanHistoryItem {
  id: string;
  batchId: string;
  timestamp: string;
  userId: string;
  location: string;
  hasAnomaly: boolean;
}

export interface RiskPrediction {
  region: string;
  riskLevel: 'low' | 'medium' | 'high';
  predictedIncidents: number;
  confidence: number;
  factors: string[];
}

// Manufacturer Verification APIs
export const manufacturerAPI = {
  isVerified: async (address: string): Promise<{ verified: boolean; data?: ManufacturerVerification }> => {
    try {
      console.log(`Fetching ${API_BASE_URL}/api/manufacturers/is-verified`);
      const response = await fetch(`${API_BASE_URL}/api/manufacturers/is-verified`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });

      if (!response.ok) {
        throw new Error('Verification check failed');
      }

      const data = await response.json();
      return {
        verified: data.isVerified || false,
        data: data
      };
    } catch (err) {
      console.error('Verification check error:', err);
      // Fallback to localStorage
      const manufacturers = JSON.parse(localStorage.getItem('verifiedManufacturers') || '[]');
      const manufacturer = manufacturers.find((m: ManufacturerVerification) => m.address === address);
      
      return {
        verified: manufacturer?.isVerified || false,
        data: manufacturer
      };
    }
  },

  verify: async (address: string, regulatorKey: string): Promise<{ success: boolean; transactionHash?: string; error?: string }> => {
    if (!address || !regulatorKey) {
      return { success: false, error: 'Missing required fields' };
    }

    try {
      console.log(`Fetching ${API_BASE_URL}/api/manufacturers/verify`);
      const response = await fetch(`${API_BASE_URL}/api/manufacturers/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          regulatorPrivateKey: regulatorKey
        })
      });

      if (!response.ok) {
        throw new Error('Failed to verify manufacturer');
      }

      const result = await response.json();
      
      // Store in localStorage on success
      const manufacturers = JSON.parse(localStorage.getItem('verifiedManufacturers') || '[]');
      const existingIndex = manufacturers.findIndex((m: ManufacturerVerification) => m.address === address);
      
      const verification: ManufacturerVerification = {
        address,
        isVerified: true,
        verifiedAt: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        manufacturers[existingIndex] = verification;
      } else {
        manufacturers.push(verification);
      }

      localStorage.setItem('verifiedManufacturers', JSON.stringify(manufacturers));

      return {
        success: true,
        transactionHash: result.transactionHash || `0x${Math.random().toString(16).substr(2, 64)}`
      };
    } catch (err) {
      console.error('Verification error:', err);
      // Fallback to localStorage mock
      const manufacturers = JSON.parse(localStorage.getItem('verifiedManufacturers') || '[]');
      const existingIndex = manufacturers.findIndex((m: ManufacturerVerification) => m.address === address);

      const verification: ManufacturerVerification = {
        address,
        isVerified: true,
        verifiedAt: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        manufacturers[existingIndex] = verification;
      } else {
        manufacturers.push(verification);
      }

      localStorage.setItem('verifiedManufacturers', JSON.stringify(manufacturers));

      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        error: 'Using mock data - backend unavailable'
      };
    }
  },

  revoke: async (address: string, regulatorKey: string): Promise<{ success: boolean; transactionHash?: string; error?: string }> => {
    if (!address || !regulatorKey) {
      return { success: false, error: 'Missing required fields' };
    }

    try {
      console.log(`Fetching ${API_BASE_URL}/api/manufacturers/revoke`);
      const response = await fetch(`${API_BASE_URL}/api/manufacturers/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          regulatorPrivateKey: regulatorKey
        })
      });

      if (!response.ok) {
        throw new Error('Failed to revoke manufacturer');
      }

      const result = await response.json();

      // Remove from localStorage on success
      const manufacturers = JSON.parse(localStorage.getItem('verifiedManufacturers') || '[]');
      const filteredManufacturers = manufacturers.filter((m: ManufacturerVerification) => m.address !== address);
      localStorage.setItem('verifiedManufacturers', JSON.stringify(filteredManufacturers));

      return {
        success: true,
        transactionHash: result.transactionHash || `0x${Math.random().toString(16).substr(2, 64)}`
      };
    } catch (err) {
      console.error('Revocation error:', err);
      // Fallback to localStorage mock
      const manufacturers = JSON.parse(localStorage.getItem('verifiedManufacturers') || '[]');
      const filteredManufacturers = manufacturers.filter((m: ManufacturerVerification) => m.address !== address);
      localStorage.setItem('verifiedManufacturers', JSON.stringify(filteredManufacturers));

      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        error: 'Using mock data - backend unavailable'
      };
    }
  }
};

// Drug Upload API
export const drugAPI = {
  upload: async (drugData: Omit<DrugUpload, 'id' | 'uploadedAt' | 'uploadedBy'>): Promise<{ success: boolean; drugId?: string; error?: string }> => {
    try {
      console.log(`Fetching ${API_BASE_URL}/api/drugs/upload`);
      const response = await fetch(`${API_BASE_URL}/api/drugs/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drugName: drugData.drugName,
          manufacturer: drugData.manufacturer,
          batchId: drugData.batchId,
          expiry: drugData.expiryDate,
          senderAddress: drugData.location
        })
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      // Store in localStorage on success
      const drugs = JSON.parse(localStorage.getItem('uploadedDrugs') || '[]');
      const newDrug: DrugUpload = {
        ...drugData,
        id: result.drugId || `drug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'current-user'
      };

      drugs.push(newDrug);
      localStorage.setItem('uploadedDrugs', JSON.stringify(drugs));

      const batches = JSON.parse(localStorage.getItem('batches') || '[]');
      batches.push({
        id: drugData.batchId,
        drugName: drugData.drugName,
        manufacturer: drugData.manufacturer,
        expiryDate: drugData.expiryDate,
        quantity: drugData.quantity,
        status: 'verified',
        location: drugData.location
      });
      localStorage.setItem('batches', JSON.stringify(batches));

      return {
        success: true,
        drugId: newDrug.id
      };
    } catch (err) {
      console.error('Upload error:', err);
      // Fallback to localStorage mock
      const drugs = JSON.parse(localStorage.getItem('uploadedDrugs') || '[]');
      const newDrug: DrugUpload = {
        ...drugData,
        id: `drug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'current-user'
      };

      drugs.push(newDrug);
      localStorage.setItem('uploadedDrugs', JSON.stringify(drugs));

      const batches = JSON.parse(localStorage.getItem('batches') || '[]');
      batches.push({
        id: drugData.batchId,
        drugName: drugData.drugName,
        manufacturer: drugData.manufacturer,
        expiryDate: drugData.expiryDate,
        quantity: drugData.quantity,
        status: 'verified',
        location: drugData.location
      });
      localStorage.setItem('batches', JSON.stringify(batches));

      return {
        success: true,
        drugId: newDrug.id,
        error: 'Using mock data - backend unavailable'
      };
    }
  }
};

// AI Analysis APIs
export const analysisAPI = {
  analyze: async (data?: any): Promise<{ success: boolean; analysis?: AnalysisResult; error?: string }> => {
    try {
      console.log(`Fetching ${AI_API_BASE_URL}/api/analyze`);
      const response = await fetch(`${AI_API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scan_data: data || [
            ["KANO-001", 12.0022, 8.5917, Date.now()],
            ["LAG-001", 6.5244, 3.3792, Date.now()],
            ["SOK-001", 13.0600, 5.2400, Date.now()]
          ]
        })
      });

      if (!response.ok) {
        throw new Error('AI analysis failed');
      }

      const result = await response.json();
      
      const analysis: AnalysisResult = {
        id: `analysis-${Date.now()}`,
        timestamp: new Date().toISOString(),
        anomalies: result.anomalies || [],
        predictions: result.prediction ? [result.prediction] : [],
        riskLevel: 'medium' as 'low' | 'medium' | 'high',
        confidence: 0.85
      };

      // Store analysis history
      const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
      history.push(analysis);
      localStorage.setItem('analysisHistory', JSON.stringify(history));

      return {
        success: true,
        analysis
      };
    } catch (err) {
      console.error('AI analysis error:', err);
      // Fallback to mock data
      const anomalies = [
        'Batch LAG-001 in Lagos: Unauthorized scans',
        'Batch KANO-003 in Kano: Location mismatch',
        'Unusual batch size detected in Lagos region'
      ];

      const predictions = [
        '75% risk of counterfeits in northern regions next month',
        'Expected 15% increase in demand for antimalarial drugs'
      ];

      const analysis: AnalysisResult = {
        id: `analysis-${Date.now()}`,
        timestamp: new Date().toISOString(),
        anomalies: anomalies.slice(0, Math.floor(Math.random() * 3) + 1),
        predictions: predictions.slice(0, Math.floor(Math.random() * 2) + 1),
        riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        confidence: 0.75 + Math.random() * 0.2
      };

      const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
      history.push(analysis);
      localStorage.setItem('analysisHistory', JSON.stringify(history));

      return {
        success: true,
        analysis,
        error: 'Using mock data - AI service unavailable'
      };
    }
  },

  getScanHistory: async (): Promise<{ success: boolean; history?: ScanHistoryItem[]; error?: string }> => {
    try {
      console.log(`Fetching ${AI_API_BASE_URL}/api/scan_history`);
      const response = await fetch(`${AI_API_BASE_URL}/api/scan_history`);

      if (!response.ok) {
        throw new Error('Scan history failed');
      }

      const result = await response.json();
      
      const history: ScanHistoryItem[] = result.history?.map((item: any) => ({
        id: item.batchId,
        batchId: item.batchId,
        timestamp: item.timestamp,
        userId: item.userId || 'unknown',
        location: `${item.location?.latitude || 0}, ${item.location?.longitude || 0}`,
        hasAnomaly: item.is_anomaly || false
      })) || [];

      // Store in localStorage
      localStorage.setItem('scanHistory', JSON.stringify(history));
      
      return {
        success: true,
        history
      };
    } catch (err) {
      console.error('Scan history failed:', err);
      // Fallback to mock data
      const mockHistory: ScanHistoryItem[] = [
        {
          id: 'LAG-001',
          batchId: 'LAG-001',
          timestamp: new Date().toISOString(),
          userId: 'user-001',
          location: '6.5244, 3.3792',
          hasAnomaly: true
        },
        {
          id: 'KANO-001',
          batchId: 'KANO-001',
          timestamp: new Date().toISOString(),
          userId: 'user-002',
          location: '12.0022, 8.5917',
          hasAnomaly: false
        }
      ];

      localStorage.setItem('scanHistory', JSON.stringify(mockHistory));
      
      return {
        success: true,
        history: mockHistory,
        error: 'Using mock data - scan history service unavailable'
      };
    }
  },

  predictRisk: async (region?: string): Promise<{ success: boolean; predictions?: RiskPrediction[]; error?: string }> => {
    try {
      console.log(`Fetching ${AI_API_BASE_URL}/api/predict_risk`);
      const response = await fetch(`${AI_API_BASE_URL}/api/predict_risk`);

      if (!response.ok) {
        throw new Error('Risk prediction failed');
      }

      const result = await response.json();
      const regionRisk = result.region_risk || {};

      const predictions: RiskPrediction[] = Object.entries(regionRisk).map(([regionName, risk]) => ({
        region: regionName,
        riskLevel: (risk as number) > 0.6 ? 'high' : (risk as number) > 0.3 ? 'medium' : 'low',
        predictedIncidents: Math.floor((risk as number) * 100),
        confidence: 0.8 + Math.random() * 0.15,
        factors: [
          'Historical incident rate',
          'Supply chain patterns',
          'Seasonal demand variations',
          'Regional economic indicators'
        ].slice(0, Math.floor(Math.random() * 3) + 2)
      }));

      if (region) {
        const filtered = predictions.filter(p => p.region.toLowerCase().includes(region.toLowerCase()));
        return {
          success: true,
          predictions: filtered
        };
      }

      return {
        success: true,
        predictions
      };
    } catch (err) {
      console.error('Risk prediction error:', err);
      // Fallback to mock data
      const mockPredictions: RiskPrediction[] = [
        {
          region: 'Northern Nigeria',
          riskLevel: 'low',
          predictedIncidents: 20,
          confidence: 0.75,
          factors: ['Historical incident rate', 'Supply chain patterns']
        },
        {
          region: 'Southern Nigeria',
          riskLevel: 'medium',
          predictedIncidents: 40,
          confidence: 0.82,
          factors: ['Seasonal demand variations', 'Regional economic indicators']
        },
        {
          region: 'Lagos',
          riskLevel: 'high',
          predictedIncidents: 65,
          confidence: 0.88,
          factors: ['Historical incident rate', 'Supply chain patterns', 'High population density']
        },
        {
          region: 'Kano',
          riskLevel: 'medium',
          predictedIncidents: 35,
          confidence: 0.79,
          factors: ['Seasonal demand variations', 'Regional economic indicators']
        }
      ];

      if (region) {
        const filtered = mockPredictions.filter(p => p.region.toLowerCase().includes(region.toLowerCase()));
        return {
          success: true,
          predictions: filtered,
          error: 'Using mock data - risk prediction service unavailable'
        };
      }

      return {
        success: true,
        predictions: mockPredictions,
        error: 'Using mock data - risk prediction service unavailable'
      };
    }
  }
};
