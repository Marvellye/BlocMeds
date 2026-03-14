import React from 'react';

const ToastContainer = ({ toasts }) => {
  return (
    <div className="toast-container" id="toastContainer">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <div className="toast-title">
            {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
          </div>
          <div className="toast-message">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;