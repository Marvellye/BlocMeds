import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCapsules, faIndustry } from '@fortawesome/free-solid-svg-icons';

const FormStep1 = ({ active, formData, errors, handleInputChange, handleBlur }) => {
  return (
    <div className={`form-step ${active ? 'active' : ''}`} data-step="1">
      <div className="input-group">
        <label htmlFor="drugName">Drug Name</label>
        <div className={`input-wrapper ${errors.drugName ? 'error' : ''}`}>
          <FontAwesomeIcon icon={faCapsules} />
          <input
            type="text"
            id="drugName"
            name="drugName"
            placeholder="Enter drug name"
            value={formData.drugName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
          />
          <div className="input-border"></div>
        </div>
        <div className={`error-message ${errors.drugName ? 'show' : ''}`}>{errors.drugName}</div>
      </div>
      <div className="input-group">
        <label htmlFor="manufacturer">Manufacturer</label>
        <div className={`input-wrapper ${errors.manufacturer ? 'error' : ''}`}>
          <FontAwesomeIcon icon={faIndustry} />
          <input
            type="text"
            id="manufacturer"
            name="manufacturer"
            placeholder="Enter manufacturer name"
            value={formData.manufacturer}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
          />
          <div className="input-border"></div>
        </div>
        <div className={`error-message ${errors.manufacturer ? 'show' : ''}`}>{errors.manufacturer}</div>
      </div>
    </div>
  );
};

export default FormStep1;