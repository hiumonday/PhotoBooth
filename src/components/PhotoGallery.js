import React from "react";

function PhotoGallery({ photos, onDelete }) {
  return (
    <div className="photo-gallery">
      <h3>Your Photos</h3>
      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <div key={index} className="gallery-item-container">
            <img
              src={photo}
              alt={`Captured ${index + 1}`}
              className="gallery-item"
            />
            <button
              className="delete-btn"
              onClick={() => onDelete(index)}
              title="Delete photo"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoGallery;
