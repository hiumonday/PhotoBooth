import React, { useState } from "react";

function Controls({ onCapture, cameraRef, onToggleStickers, onDownload }) {
  const [isCapturing, setIsCapturing] = useState(false);

  const capturePhoto = async () => {
    if (isCapturing) return;

    setIsCapturing(true);
    try {
      const photoUrl = cameraRef.current.capturePhoto();
      onCapture(photoUrl);
    } catch (error) {
      console.error("Photo capture error:", error);
      alert("Failed to take photo. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="controls">
      <button
        className="capture-btn"
        onClick={capturePhoto}
        disabled={isCapturing}
      >
        {isCapturing ? "Processing..." : "Take Photo"}
      </button>
      <div className="options-buttons">
        <button className="sticker-btn" onClick={onToggleStickers}>
          Toggle Stickers
        </button>
        <button className="download-btn" onClick={onDownload}>
          Download
        </button>
      </div>
    </div>
  );
}

export default Controls;
