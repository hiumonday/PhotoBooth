import React from "react";

const STICKERS = [
  { id: "heart", emoji: "❤️" },
  { id: "star", emoji: "⭐" },
  { id: "crown", emoji: "👑" },
  { id: "sparkles", emoji: "✨" },
  { id: "rainbow", emoji: "🌈" },
  { id: "unicorn", emoji: "🦄" },
  { id: "cat", emoji: "😺" },
  { id: "dog", emoji: "🐶" },
];

function Stickers() {
  const handleDragStart = (e, sticker) => {
    e.dataTransfer.setData("application/json", JSON.stringify(sticker));
  };

  return (
    <div className="stickers-panel">
      <h3>Stickers</h3>
      <div className="stickers-grid">
        {STICKERS.map((sticker) => (
          <div
            key={sticker.id}
            className="sticker-item"
            draggable
            onDragStart={(e) => handleDragStart(e, sticker)}
          >
            <span role="img" aria-label={sticker.id}>
              {sticker.emoji}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stickers;
