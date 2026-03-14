import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const Result = ({ show, type, result }) => {
  return (
    <div id="result" className={`result-container ${show ? 'show' : ''}`}>
      <div className="result-content">
        <div className="result-icon" style={{ background: type === 'success' ? 'var(--success-color)' : 'var(--error-color)' }}>
          <FontAwesomeIcon icon={type === 'success' ? faCheckCircle : faExclamationTriangle} />
        </div>
        <h3 className="result-title">{type === 'success' ? 'Upload Successful!' : 'Upload Failed'}</h3>
        <div className="result-message">
          {JSON.stringify(result, null, 2)}
        </div>
      </div>
    </div>
  );
};

export default Result;