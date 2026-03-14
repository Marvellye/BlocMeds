import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faUpload } from '@fortawesome/free-solid-svg-icons';

const Navigation = ({ currentStep, totalSteps, prevStep, nextStep, handleSubmit, loading }) => {
  return (
    <div className="form-navigation">
      <button 
        type="button" 
        className="nav-btn prev-btn" 
        onClick={prevStep} 
        style={{ display: currentStep > 1 ? 'flex' : 'none' }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Previous
      </button>
      <button 
        type="button" 
        className="nav-btn next-btn" 
        onClick={nextStep} 
        style={{ display: currentStep < totalSteps ? 'flex' : 'none' }}
      >
        Next
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
      <button 
        type="submit" 
        className={`nav-btn submit-btn ${loading ? 'loading' : ''}`} 
        onClick={handleSubmit}
        disabled={loading}
        style={{ display: currentStep === totalSteps ? 'flex' : 'none' }}
      >
        <FontAwesomeIcon icon={faUpload} />
        <span className="btn-text">{loading ? 'Uploading...' : 'Upload Batch'}</span>
        <div className="loading-spinner"></div>
      </button>
    </div>
  );
};

export default Navigation;