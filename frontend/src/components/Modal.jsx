import React from "react";
import './Modal.css'
import {startRecording, mediaRecorder, mediaStream, saveAudio, recordedChunks} from "../App.jsx";

// Modal
const Modal = ({ setIsOpen }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Record Audio</h3>
        </div>
        <div className="modal-body">
          <button id="record" onClick={() => {
            startRecording();
          }}
          >Record</button>
          <button id="stop" onClick={() => {
            setIsOpen(false);
            // stop the recording
            mediaRecorder.stop();
            // stop media stream
            if (mediaStream) {
              mediaStream.getTracks().forEach((track) => track.stop());
            }
            // get last recorded audio blob ( if any ) and call function to save
            if (recordedChunks) {
              const recordedBlob = new Blob(recordedChunks, { type: "audio/wav" });
              saveAudio(recordedBlob);
            }
          }}>
            Stop
          </button>
        </div>
        <button id="close" onClick={() => setIsOpen(false)}>
          X
        </button>
      </div>
    </div>
  );
};

export default Modal;