import React, { useState, useRef } from "react";
import "./App.css";
import CameraView from "./components/CameraView";
import Controls from "./components/Controls";
import PhotoGallery from "./components/PhotoGallery";
import Filters from "./components/Filters";
import Stickers from "./components/Stickers";
//sakdjkasdhjksadjksadjkasdhjkasdhjksadhka
function App() {
  const [photos, setPhotos] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("none");
  const [showStickers, setShowStickers] = useState(true);
  const cameraRef = useRef(null);

  const handleCapture = (photoUrl) => {
    setPhotos((prev) => [photoUrl, ...prev]);
  };

  const handleDelete = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const toggleStickers = () => {
    setShowStickers((prev) => !prev);
  };

  const handleDownload = () => {
    if (photos.length > 0) {
      // Create a download link for the most recent photo
      const link = document.createElement("a");
      link.href = photos[0];
      link.download = `photobooth-${new Date().toISOString()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="App">
      <div className="photobooth-container">
        {showStickers && (
          <div className="stickers-sidebar">
            <Stickers />
          </div>
        )}
        <div className="booth-main">
          <CameraView ref={cameraRef} filter={currentFilter} />
          <div className="controls-container">
            <Controls
              onCapture={handleCapture}
              cameraRef={cameraRef}
              onToggleStickers={toggleStickers}
              onDownload={handleDownload}
            />
            <Filters
              currentFilter={currentFilter}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
        <PhotoGallery photos={photos} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default App;
