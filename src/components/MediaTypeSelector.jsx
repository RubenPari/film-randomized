import React from 'react';

const MediaTypeSelector = ({ mediaType, setMediaType }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Tipo di Media</h2>
      <div className="flex space-x-4">
        <button
          onClick={() => setMediaType(true)}
          className={`px-4 py-2 rounded ${mediaType ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Film
        </button>
        <button
          onClick={() => setMediaType(false)}
          className={`px-4 py-2 rounded ${!mediaType ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Serie TV
        </button>
      </div>
    </div>
  );
};

export default MediaTypeSelector;
