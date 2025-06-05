import React from 'react';
import './App.css';
import { useMediaGenerator } from './hooks/useMediaGenerator.js';
import MediaTypeSelector from './components/MediaTypeSelector.jsx';
import RatingFilter from './components/RatingFilter.jsx';
import YearFilter from './components/YearFilter.jsx';
import GenreFilter from './components/GenreFilter.jsx';
import MediaCard from './components/MediaCard.jsx';

function App() {
  const {
    // State
    mediaType,
    minRating,
    maxRating,
    releaseYearFrom,
    releaseYearTo,
    selectedGenres,
    genres,
    randomMedia,
    isLoading,
    error,
    viewedMedia,
    // Actions
    setMediaType,
    setMinRating,
    setMaxRating,
    setReleaseYearFrom,
    setReleaseYearTo,
    generateRandomMedia,
    handleGenreToggle,
  } = useMediaGenerator();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Generatore Random di {mediaType ? 'Film' : 'Serie TV'}
        </h1>

        <MediaTypeSelector mediaType={mediaType} setMediaType={setMediaType} />

        <RatingFilter
          minRating={minRating}
          maxRating={maxRating}
          setMinRating={setMinRating}
          setMaxRating={setMaxRating}
        />

        <YearFilter
          releaseYearFrom={releaseYearFrom}
          releaseYearTo={releaseYearTo}
          setReleaseYearFrom={setReleaseYearFrom}
          setReleaseYearTo={setReleaseYearTo}
        />

        <GenreFilter
          genres={genres}
          selectedGenres={selectedGenres}
          handleGenreToggle={handleGenreToggle}
        />

        {/* Bottone per generare */}
        <div className="mt-6 text-center">
          <button
            onClick={generateRandomMedia}
            disabled={isLoading}
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Caricamento...' : 'Genera Casualmente'}
          </button>
        </div>

        {/* Messaggio di errore */}
        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        {/* Card del risultato */}
        {randomMedia && !isLoading && <MediaCard media={randomMedia} mediaType={mediaType} />}

        {/* Contatore di media visti */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Media visualizzati in questa sessione: {viewedMedia.length}
        </div>
      </div>
    </div>
  );
}

export default App;
