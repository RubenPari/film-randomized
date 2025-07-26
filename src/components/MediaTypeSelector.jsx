import React from 'react';

/**
 * Component for selecting between movies and TV shows
 * @param {Object} props - Component props
 * @param {boolean} props.mediaType - Current media type (true for movie, false for TV)
 * @param {Function} props.setMediaType - Function to update media type
 */
function MediaTypeSelector({ mediaType, setMediaType }) {
  return (
    <div>
      <h2 className="filter-title">Tipo di Media</h2>
      <div className="flex space-x-3">
        <button
          onClick={function() { setMediaType(true); }}
          className={`btn-secondary flex-1 ${mediaType ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Film
        </button>
        <button
          onClick={function() { setMediaType(false); }}
          className={`btn-secondary flex-1 ${!mediaType ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Serie TV
        </button>
      </div>
    </div>
  );
}

export default MediaTypeSelector;
