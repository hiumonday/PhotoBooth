import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const CameraView = forwardRef(({ filter }, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [stickers, setStickers] = useState([]);
  const [draggedSticker, setDraggedSticker] = useState(null);

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle stickers drop
  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const stickerData = JSON.parse(
        e.dataTransfer.getData("application/json")
      );
      const rect = e.currentTarget.getBoundingClientRect();

      // Calculate position relative to the camera view
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setStickers([
        ...stickers,
        {
          ...stickerData,
          x,
          y,
          id: `${stickerData.id}-${Date.now()}`,
        },
      ]);
    } catch (error) {
      console.error("Failed to add sticker:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle sticker movement
  const handleStickerMouseDown = (e, index) => {
    e.stopPropagation();
    setDraggedSticker({
      index,
      offsetX: e.clientX - stickers[index].x,
      offsetY: e.clientY - stickers[index].y,
    });
  };

  const handleMouseMove = (e) => {
    if (draggedSticker !== null) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - draggedSticker.offsetX;
      const y = e.clientY - rect.top - draggedSticker.offsetY;

      setStickers((prevStickers) => {
        const newStickers = [...prevStickers];
        newStickers[draggedSticker.index] = {
          ...newStickers[draggedSticker.index],
          x,
          y,
        };
        return newStickers;
      });
    }
  };

  const handleMouseUp = () => {
    setDraggedSticker(null);
  };

  // Expose the capturePhoto method to parent components
  useImperativeHandle(ref, () => ({
    capturePhoto: () => {
      if (!canvasRef.current || !videoRef.current) return null;

      const canvas = canvasRef.current;
      const video = videoRef.current;

      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Apply selected filter
      if (filter !== "none") {
        applyFilter(ctx, filter, canvas.width, canvas.height);
      }

      // Draw stickers
      stickers.forEach((sticker) => {
        ctx.font = "80px serif";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(sticker.emoji, sticker.x, sticker.y);
      });

      // Convert to data URL and return
      return canvas.toDataURL("image/jpeg");
    },
    removeSticker: (index) => {
      setStickers(stickers.filter((_, i) => i !== index));
    },
  }));

  // Apply filter effect
  const applyFilter = (ctx, filter, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    switch (filter) {
      case "grayscale":
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }
        break;
      case "sepia":
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        }
        break;
      case "warm":
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.1); // Increase red
          data[i + 2] = Math.max(0, data[i + 2] * 0.9); // Decrease blue
        }
        break;
      case "cool":
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.max(0, data[i] * 0.9); // Decrease red
          data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Increase blue
        }
        break;
      case "blur":
        // Simple blur implementation - in a real app you'd use a convolution filter
        ctx.filter = "blur(5px)";
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        ctx.filter = "none";
        return; // Skip putting image data since we've already drawn with filter
      default:
        break;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Get CSS filter style based on selected filter
  const getFilterStyle = () => {
    switch (filter) {
      case "grayscale":
        return { filter: "grayscale(100%)" };
      case "sepia":
        return { filter: "sepia(100%)" };
      case "warm":
        return { filter: "saturate(150%) hue-rotate(10deg)" };
      case "cool":
        return { filter: "saturate(120%) hue-rotate(-10deg)" };
      case "blur":
        return { filter: "blur(5px)" };
      default:
        return {};
    }
  };

  return (
    <div
      className="camera-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={getFilterStyle()}
        className="camera-view"
      />

      {stickers.map((sticker, index) => (
        <div
          key={sticker.id}
          className="placed-sticker"
          style={{
            position: "absolute",
            left: `${sticker.x}px`,
            top: `${sticker.y}px`,
            fontSize: "80px",
            cursor: "move",
            userSelect: "none",
            transform: "translate(-50%, -50%)",
          }}
          onMouseDown={(e) => handleStickerMouseDown(e, index)}
        >
          <span role="img" aria-label={sticker.id}>
            {sticker.emoji}
          </span>
        </div>
      ))}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
});

export default CameraView;
