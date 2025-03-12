import React from "react";

const FILTERS = {
  none: "None",
  grayscale: "Grayscale",
  sepia: "Sepia",
  warm: "Warm",
  cool: "Cool",
  blur: "Blur",
};

function Filters({ currentFilter, onFilterChange }) {
  return (
    <div className="filters-menu">
      {Object.entries(FILTERS).map(([key, label]) => (
        <button
          key={key}
          className={`filter-option ${currentFilter === key ? "active" : ""}`}
          onClick={() => onFilterChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default Filters;
