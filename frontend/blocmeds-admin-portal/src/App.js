import React, { useState, useEffect } from 'react';

const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState({
    drugName: '',
    manufacturer: '',
    batchId: '',
    expiry: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toasts, setToasts] = useState([]);

  const validateInput = (name, value) => {
    let error = '';
    if (!value.trim()) {
      error = `${name} is required`;
    } else if (name === 'expiry') {
      const expiryDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiryDate <= today) error = 'Expiry must be in the future';
    } else if (name === 'batchId' && value.length < 3) {
      error = 'Batch ID must be at least 3 characters';
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateInput(name, value);
    setErrors((prev) => ({ ...prev, [name]: error || '' }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateStep = () => {
    let isValid = true;
    const fields = currentStep === 1 ? ['drugName', 'manufacturer'] : currentStep === 2 ? ['batchId', 'expiry'] : [];
    fields.forEach((field) => {
      const error = validateInput(field, formData[field]);
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
        isValid = false;
      }
    });
    return isValid;
  };

  const nextStep = () => {
    if (!validateStep()) {
      addToast('Please fix errors before proceeding', 'error');
      return;
    }
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) {
      addToast('Please fix errors before submitting', 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://blocmeds-backend-production.up.railway.app/api/drugs/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      addToast('Batch uploaded successfully!', 'success');
    } catch (error) {
      setResult(`Error: ${error.message}`);
      addToast('Upload failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter(t => t.id !== id)), 5000);
  };

  const reset = () => {
    setCurrentStep(1);
    setFormData({ drugName: '', manufacturer: '', batchId: '', expiry: '' });
    setErrors({});
    setResult(null);
    addToast('Form reset', 'info');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        reset();
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (currentStep < totalSteps) nextStep();
        else if (currentStep === totalSteps) handleSubmit(e);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, totalSteps]);

  useEffect(() => {
    window.addDemoData = () => {
      setFormData({
        drugName: 'Paracetamol 500mg',
        manufacturer: 'PharmaCorp Ltd.',
        batchId: 'PC-PAR-2024-001',
        expiry: '2026-12-31',
      });
      addToast('Demo data loaded', 'info');
    };
    window.resetForm = reset;
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', background: '#f0f0f0', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Drug Batch Upload</h1>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ width: '33.33%', textAlign: 'center', color: currentStep === 1 ? '#007bff' : '#666' }}>Step 1: Drug Info</div>
          <div style={{ width: '33.33%', textAlign: 'center', color: currentStep === 2 ? '#007bff' : '#666' }}>Step 2: Batch Details</div>
          <div style={{ width: '33.33%', textAlign: 'center', color: currentStep === 3 ? '#007bff' : '#666' }}>Step 3: Confirmation</div>
        </div>
        <div style={{ height: '4px', background: '#ccc', position: 'relative' }}>
          <div style={{ height: '100%', background: '#007bff', width: `${(currentStep / totalSteps) * 100}%`, transition: 'width 0.3s' }}></div>
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {currentStep === 1 && (
          <>
            <div>
              <label>Drug Name:</label>
              <input
                type="text"
                name="drugName"
                value={formData.drugName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{ width: '100%', padding: '8px', marginTop: '5px', border: errors.drugName ? '2px solid #dc3545' : '1px solid #ccc', borderRadius: '4px' }}
              />
              {errors.drugName && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>{errors.drugName}</p>}
            </div>
            <div>
              <label>Manufacturer:</label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{ width: '100%', padding: '8px', marginTop: '5px', border: errors.manufacturer ? '2px solid #dc3545' : '1px solid #ccc', borderRadius: '4px' }}
              />
              {errors.manufacturer && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>{errors.manufacturer}</p>}
            </div>
          </>
        )}
        {currentStep === 2 && (
          <>
            <div>
              <label>Batch ID:</label>
              <input
                type="text"
                name="batchId"
                value={formData.batchId}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{ width: '100%', padding: '8px', marginTop: '5px', border: errors.batchId ? '2px solid #dc3545' : '1px solid #ccc', borderRadius: '4px' }}
              />
              {errors.batchId && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>{errors.batchId}</p>}
            </div>
            <div>
              <label>Expiry Date:</label>
              <input
                type="date"
                name="expiry"
                value={formData.expiry}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{ width: '100%', padding: '8px', marginTop: '5px', border: errors.expiry ? '2px solid #dc3545' : '1px solid #ccc', borderRadius: '4px' }}
              />
              {errors.expiry && <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>{errors.expiry}</p>}
            </div>
          </>
        )}
        {currentStep === 3 && (
          <div style={{ background: '#e9ecef', padding: '15px', borderRadius: '4px' }}>
            <h3>Review Your Information</h3>
            <p>Drug Name: {formData.drugName}</p>
            <p>Manufacturer: {formData.manufacturer}</p>
            <p>Batch ID: {formData.batchId}</p>
            <p>Expiry Date: {formData.expiry ? new Date(formData.expiry).toLocaleDateString() : ''}</p>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            style={{ padding: '10px 20px', background: currentStep === 1 ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: currentStep === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '10px 20px', background: loading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Uploading...' : 'Submit'}
            </button>
          )}
        </div>
      </form>
      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: result.includes('Error') ? '#f8d7da' : '#d4edda', color: result.includes('Error') ? '#721c24' : '#155724', borderRadius: '4px', textAlign: 'center' }}>
          {result}
        </div>
      )}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              background: '#fff',
              padding: '10px',
              marginBottom: '10px',
              borderLeft: `4px solid ${toast.type === 'success' ? '#28a745' : '#dc3545'}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderRadius: '4px'
            }}
          >
            <strong>{toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}:</strong> {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;