import React from "react";
import './Modal.css'

// Modal
const Modal = ({setIsOpen}) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Record Audio</h3>
        </div>
        <div className="modal-body">
          <button id="record" onclikc = {() => getAudio()}>Record</button>
          <button id="stop" onClick = {() => setIsOpen(false)}>
            Stop
          </button>
        </div>
        <button id="close" onClick = {() => setIsOpen(false)}>
            X
          </button>
      </div>
    </div>
  );
};

export default Modal;