import React from 'react';

const ProgressBar = ({ currentStep }) => {
  return (
    <div className="progress-bar" data-progress={currentStep}>
      <div className={`progress-step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`} data-step="1">
        <div className="step-number">1</div>
        <div className="step-label">Drug Info</div>
      </div>
      <div className={`progress-step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`} data-step="2">
        <div className="step-number">2</div>
        <div className="step-label">Batch Details</div>
      </div>
      <div className={`progress-step ${currentStep === 3 ? 'active' : ''}`} data-step="3">
        <div className="step-number">3</div>
        <div className="step-label">Confirmation</div>
      </div>
    </div>
  );
};

export default ProgressBar;