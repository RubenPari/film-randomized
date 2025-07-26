import React from 'react';

/**
 * Component for selecting genres to filter media
 * @param {Object} props - Component props
 * @param {Array} props.genres - List of all available genres
 * @param {Array} props.selectedGenres - List of currently selected genre IDs
 * @param {Function} props.handleGenreToggle - Function to toggle genre selection
 */
function GenreFilter({ genres, selectedGenres, handleGenreToggle }) {
  return (
    <div>
      <h2 className="filter-title">Generi</h2>
      <div className="grid grid-cols-2 gap-3">
        {genres.map(function(genre) {
          return (
            <label 
              key={genre.id} 
              className={`inline-flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedGenres.includes(genre.id)
                  ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-md'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre.id)}
                onChange={function() { handleGenreToggle(genre.id); }}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{genre.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default GenreFilter;
