/**
 * Genre filter component.
 * Allows users to select multiple genres to filter media.
 */
import React from 'react';

/**
 * Component for selecting genres to filter media.
 * Displays all available genres as checkboxes.
 * 
 * @param {Object} props - Component props
 * @param {Array<Object>} props.genres - List of all available genres
 * @param {Array<number>} props.selectedGenres - List of currently selected genre IDs
 * @param {Function} props.handleGenreToggle - Function to toggle genre selection
 * @returns {JSX.Element} Genre filter component
 */
function GenreFilter({ genres, selectedGenres, handleGenreToggle }) {
  return (
    <div>
      <h2 className="filter-title">Genres</h2>
      <div className="max-h-64 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {genres.map(function(genre) {
            return (
              <label 
                key={genre.id} 
                className={`inline-flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedGenres.includes(genre.id)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre.id)}
                  onChange={function() { handleGenreToggle(genre.id); }}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">{genre.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GenreFilter;
