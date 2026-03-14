import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const FormStep2 = ({ active, formData, errors, handleInputChange, handleBlur }) => {
  return (
    <div className={`form-step ${active ? 'active' : ''}`} data-step="2">
      <div className="input-group">
        <label htmlFor="batchId">Batch ID</label>
        <div className={`input-wrapper ${errors.batchId ? 'error' : ''}`}>
          <FontAwesomeIcon icon={faBarcode} />
          <input
            type="text"
            id="batchId"
            name="batchId"
            placeholder="Enter batch identifier"
            value={formData.batchId}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
          />
          <div className="input-border"></div>
        </div>
        <div className={`error-message ${errors.batchId ? 'show' : ''}`}>{errors.batchId}</div>
      </div>
      <div className="input-group">
        <label htmlFor="expiry">Expiry Date</label>
        <div className={`input-wrapper ${errors.expiry ? 'error' : ''}`}>
          <FontAwesomeIcon icon={faCalendarAlt} />
          <input
            type="date"
            id="expiry"
            name="expiry"
            value={formData.expiry}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
          />
          <div className="input-border"></div>
        </div>
        <div className={`error-message ${errors.expiry ? 'show' : ''}`}>{errors.expiry}</div>
      </div>
    </div>
  );
};

export default FormStep2;