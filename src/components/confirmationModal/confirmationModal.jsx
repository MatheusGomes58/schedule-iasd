import React from 'react';
import './form.css'; // Estilize seu modal como preferir

const ConfirmationModal = ({ message, onConfirm, onCancel, status }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmação</h2>
        <p>{message}</p>
        <div className="form-group">
          <button onClick={onConfirm} className={"btn btn-" + status}>Sim</button>
          <button onClick={onCancel} className="btn btn-secondary">Não</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
