import React, { useEffect, useState } from "react";

const Modal = ({ isOpen, onClose, children, searchQuery, handleSearch }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button
          className="material-symbols-rounded icon-button icon-button-absolute close-button"
          onClick={onClose}
        >
          close
        </button>
        <div className="modal">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
