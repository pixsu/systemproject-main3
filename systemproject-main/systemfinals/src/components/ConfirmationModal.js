import React from 'react';
import './components_css/modalstyle.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confmodal-content">
        <h2>Confirmation</h2>
        <p>Are you sure you want to proceed?</p>
        <div className="modal-actions">
          <button className='cancelbtn' onClick={onClose}>Cancel</button>
          <button className='confirmbtn' onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;