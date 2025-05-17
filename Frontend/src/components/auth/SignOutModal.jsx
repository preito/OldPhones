import React from 'react';
import './SignOutModal.css';

export default function SignOutModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="signout-modal-overlay">
      <div className="signout-modal-card">
        <h2 className="signout-modal-title">Confirm Sign Out</h2>
        <p className="signout-modal-message">
          Are you sure you want to sign out?
        </p>
        <div className="signout-modal-buttons">
          <button
            className="signout-modal-button cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="signout-modal-button confirm-button"
            onClick={onConfirm}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
