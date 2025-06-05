import React from 'react';

const GenreFilter = ({ genres, selectedGenres, handleGenreToggle }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Generi</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {genres.map((genre) => (
          <label key={genre.id} className="inline-flex items-center">
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre.id)}
              onChange={() => handleGenreToggle(genre.id)}
              className="mr-2"
            />
            {genre.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;
