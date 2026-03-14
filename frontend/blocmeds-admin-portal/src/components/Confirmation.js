import React from 'react';

const Confirmation = ({ active, formData }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`form-step ${active ? 'active' : ''}`} data-step="3">
      <div className="confirmation-card">
        <h3>Review Your Information</h3>
        <div className="confirmation-details">
          <div className="detail-row">
            <span className="detail-label">Drug Name:</span>
            <span className="detail-value">{formData.drugName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Manufacturer:</span>
            <span className="detail-value">{formData.manufacturer}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Batch ID:</span>
            <span className="detail-value">{formData.batchId}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Expiry Date:</span>
            <span className="detail-value">{formatDate(formData.expiry)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;