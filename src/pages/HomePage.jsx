import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMediaGenerator } from '../hooks/useMediaGenerator.js';
import MediaTypeSelector from '../components/MediaTypeSelector.jsx';
import RatingFilter from '../components/RatingFilter.jsx';
import YearFilter from '../components/YearFilter.jsx';
import VoteCountFilter from '../components/VoteCountFilter.jsx';
import GenreFilter from '../components/GenreFilter.jsx';
import MediaCard from '../components/MediaCard.jsx';

/**
 * Home page component with media generator
 */
function HomePage() {
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
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Generatore Random di {mediaType ? 'Film' : 'Serie TV'}
            </h1>
            <Link
              to="/watchlist"
              className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
              title="Vai alla Watchlist"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="hidden md:inline">Watchlist</span>
            </Link>
          </div>
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

            {/* Viewed media counter and list */}
            {viewedMedia.length > 0 && (
              <div className="mt-6 p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                <div className="text-center text-gray-400 mb-4">
                  Hai scoperto {viewedMedia.length} contenuti in questa sessione
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {viewedMedia.map(function(media, index) {
                    const title = media.title || media.name;
                    const posterPath = media.poster_path;
                    return (
                      <div
                        key={media.id || index}
                        className="flex flex-col items-center gap-2 text-sm text-white font-semibold p-3 bg-gray-800/50 rounded-lg border border-gray-700/30"
                      >
                        {posterPath ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                            alt={title}
                            className="w-full h-auto object-cover rounded"
                          />
                        ) : (
                          <div className="w-full aspect-[2/3] bg-gray-700 rounded flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <span className="text-center text-xs line-clamp-2">{title}</span>
                      </div>
                    );
                  })}
                </div>
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

export default HomePage;
