import React from 'react';

/**
 * Component for filtering media by rating (min and max)
 * @param {Object} props - Component props
 * @param {number} props.minRating - Minimum rating value
 * @param {number} props.maxRating - Maximum rating value
 * @param {Function} props.setMinRating - Function to update minimum rating
 * @param {Function} props.setMaxRating - Function to update maximum rating
 */
function RatingFilter({ minRating, maxRating, setMinRating, setMaxRating }) {
  return (
    <div>
      <h2 className="filter-title">Voto (1-10)</h2>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm mb-1 text-gray-300">Minimo</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={minRating}
            onChange={function(e) { setMinRating(parseFloat(e.target.value)); }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1 text-gray-300">Massimo</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={maxRating}
            onChange={function(e) { setMaxRating(parseFloat(e.target.value)); }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className="text-sm text-gray-400 mr-3">0</span>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={minRating}
          onChange={function(e) { setMinRating(parseFloat(e.target.value)); }}
          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
        />
        <span className="text-sm text-gray-400 ml-3">10</span>
      </div>
      <div className="mt-2 flex items-center">
        <span className="text-sm text-gray-400 mr-3">0</span>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={maxRating}
          onChange={function(e) { setMaxRating(parseFloat(e.target.value)); }}
          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
        />
        <span className="text-sm text-gray-400 ml-3">10</span>
      </div>
    </div>
  );
}

export default RatingFilter;
