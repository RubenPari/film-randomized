import React, { useState } from 'react';
import './App.css';
import { useMediaGenerator } from './hooks/useMediaGenerator.js';
import MediaTypeSelector from './components/MediaTypeSelector.jsx';
import RatingFilter from './components/RatingFilter.jsx';
import YearFilter from './components/YearFilter.jsx';
import VoteCountFilter from './components/VoteCountFilter.jsx';
import GenreFilter from './components/GenreFilter.jsx';
import MediaCard from './components/MediaCard.jsx';

/**
 * Main application component
 */
function App() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    mediaType,
    minRating,
    maxRating,
    releaseYearFrom,
    releaseYearTo,
    minVoteCount,
    selectedGenres,
    genres,
    randomMedia,
    isLoading,
    error,
    viewedMedia,
    setMediaType,
    setMinRating,
    setMaxRating,
    setReleaseYearFrom,
    setReleaseYearTo,
    setMinVoteCount,
    generateRandomMedia,
    handleGenreToggle,
  } = useMediaGenerator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 pb-24 md:p-8 md:pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header section with title and description */}
        <header className="text-center mb-10 py-8">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Generatore Random di {mediaType ? 'Film' : 'Serie TV'}
          </h1>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            Scopri film e serie TV casuali in base ai tuoi gusti. Filtra per genere, anno e valutazione per trovare il tuo prossimo intrattenimento preferito.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Results section - right column (mobile-first) */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Mobile filters toggle */}
            <div className="flex justify-end mb-4 lg:hidden">
              <button
                type="button"
                onClick={function() {
                  setFiltersOpen(function(prev) {
                    return !prev;
                  });
                }}
                className="inline-flex items-center px-3 py-2 text-sm rounded-lg border border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
              >
                {filtersOpen ? 'Nascondi filtri' : 'Mostra filtri'}
              </button>
            </div>

            {/* Generate button (desktop/tablet) */}
            <div className="text-center mb-8 hidden lg:block">
              <button
                onClick={generateRandomMedia}
                disabled={isLoading}
                className="btn-primary flex items-center mx-auto"
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    Caricamento...
                  </>
                ) : (
                  'Genera Contenuto Casuale'
                )}
              </button>
            </div>

            {/* Error message display */}
            {error && (
              <div className="mt-4 p-4 bg-red-900/50 text-red-200 rounded-xl border border-red-700/50 backdrop-blur-sm">
                <div className="font-bold mb-1">Errore</div>
                <div>{error}</div>
              </div>
            )}

            {/* Media card display */}
            {randomMedia && !isLoading && (
              <MediaCard media={randomMedia} mediaType={mediaType} />
            )}

            {/* Viewed media counter */}
            {viewedMedia.length > 0 && (
              <div className="mt-6 text-center text-gray-400">
                Hai scoperto {viewedMedia.length} contenuti in questa sessione
              </div>
            )}
          </div>

          {/* Filter section - left column */}
          <div
            className={
              'lg:col-span-1 space-y-6 order-2 lg:order-1 ' +
              (filtersOpen ? 'block ' : 'hidden ') +
              'lg:block'
            }
          >
            <div className="filter-section">
              <MediaTypeSelector mediaType={mediaType} setMediaType={setMediaType} />
            </div>

            <div className="filter-section">
              <RatingFilter
                minRating={minRating}
                maxRating={maxRating}
                setMinRating={setMinRating}
                setMaxRating={setMaxRating}
              />
            </div>

            <div className="filter-section">
              <YearFilter
                releaseYearFrom={releaseYearFrom}
                releaseYearTo={releaseYearTo}
                setReleaseYearFrom={setReleaseYearFrom}
                setReleaseYearTo={setReleaseYearTo}
              />
            </div>

            <div className="filter-section">
              <VoteCountFilter
                minVoteCount={minVoteCount}
                setMinVoteCount={setMinVoteCount}
              />
            </div>

            <div className="filter-section">
              <GenreFilter
                genres={genres}
                selectedGenres={selectedGenres}
                handleGenreToggle={handleGenreToggle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky generate button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 border-t border-gray-800 px-4 py-3 flex items-center justify-between lg:hidden">
        <span className="text-sm text-gray-300">
          Genera un nuovo {mediaType ? 'film' : 'contenuto TV'}
        </span>
        <button
          type="button"
          onClick={generateRandomMedia}
          disabled={isLoading}
          className="btn-primary flex items-center px-4 py-2 text-sm"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner mr-2"></div>
              Caricamento...
            </>
          ) : (
            'Genera'
          )}
        </button>
      </div>
    </div>
  );
}

export default App;
