import React from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
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
          {/* Filter section - left column */}
          <div className="lg:col-span-1 space-y-6">
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

          {/* Results section - right column */}
          <div className="lg:col-span-2">
            {/* Generate button */}
            <div className="text-center mb-8">
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
        </div>
      </div>
    </div>
  );
}

export default App;