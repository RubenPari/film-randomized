/**
 * Rating filter component.
 * Allows users to filter media by minimum and maximum rating.
 */
import React from 'react';

/**
 * Component for filtering media by rating range (min and max).
 * 
 * @param {Object} props - Component props
 * @param {number} props.minRating - Minimum rating value (0-10)
 * @param {number} props.maxRating - Maximum rating value (0-10)
 * @param {Function} props.setMinRating - Function to update minimum rating
 * @param {Function} props.setMaxRating - Function to update maximum rating
 * @returns {JSX.Element} Rating filter component
 */
function RatingFilter({ minRating, maxRating, setMinRating, setMaxRating }) {
  return (
    <div>
      <h2 className="filter-title">Rating (1-10)</h2>
      <p className="text-sm text-gray-400 mb-3">
        Select the minimum and maximum rating range.
      </p>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-300 mb-1">
            <span>Minimum</span>
            <span className="font-semibold">{minRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-3">0</span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={minRating}
              onChange={function(e) { setMinRating(parseFloat(e.target.value)); }}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
            />
            <span className="text-xs text-gray-500 ml-3">10</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-300 mb-1">
            <span>Maximum</span>
            <span className="font-semibold">{maxRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-3">0</span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={maxRating}
              onChange={function(e) { setMaxRating(parseFloat(e.target.value)); }}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
            />
            <span className="text-xs text-gray-500 ml-3">10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RatingFilter;
