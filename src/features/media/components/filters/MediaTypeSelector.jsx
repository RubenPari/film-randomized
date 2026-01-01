/**
 * Media type selector component.
 * Allows users to switch between movies and TV shows.
 */
import React from 'react';

/**
 * Component for selecting between movies and TV shows.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.mediaType - Current media type (true for movie, false for TV show)
 * @param {Function} props.setMediaType - Function to update media type
 * @returns {JSX.Element} Media type selector component
 */
function MediaTypeSelector({ mediaType, setMediaType }) {
  return (
    <div>
      <h2 className="filter-title">Media Type</h2>
      <div className="flex space-x-3">
        <button
          onClick={function() { setMediaType(true); }}
          className={`btn-secondary flex-1 ${mediaType ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Movies
        </button>
        <button
          onClick={function() { setMediaType(false); }}
          className={`btn-secondary flex-1 ${!mediaType ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          TV Shows
        </button>
      </div>
    </div>
  );
}

export default MediaTypeSelector;
