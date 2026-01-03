/**
 * Home page component with media generator.
 * Main page where users can generate random media based on filters.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext.jsx';
import { useMediaGenerator } from '../features/media/hooks/useMediaGenerator.js';
import MediaTypeSelector from '../features/media/components/filters/MediaTypeSelector.jsx';
import RatingFilter from '../features/media/components/filters/RatingFilter.jsx';
import YearFilter from '../features/media/components/filters/YearFilter.jsx';
import VoteCountFilter from '../features/media/components/filters/VoteCountFilter.jsx';
import GenreFilter from '../features/media/components/filters/GenreFilter.jsx';
import MediaCard from '../features/media/components/MediaCard.jsx';

/**
 * Home page component.
 * Displays media generator with filters and generated media results.
 * 
 * @returns {JSX.Element} Home page with media generator
 */
function HomePage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles user logout and redirects to login page.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        {/* User header */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-4 glass-effect rounded-xl border border-cyan-500/20 px-5 py-3 shadow-lg shadow-cyan-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-200 font-semibold">{user?.username}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <Link
              to="/watchlist"
              className="btn-secondary flex items-center gap-2 px-3 py-1.5 text-sm hover:scale-105 transition-transform duration-200"
              title="Go to Watchlist"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="hidden md:inline">Watchlist</span>
            </Link>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 border-red-500 text-white hover:scale-105 transition-transform duration-200"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Header section with title and description */}
        <header className="text-center mb-10 py-8">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
            Random {mediaType ? 'Movie' : 'TV Show'} Generator
          </h1>
          <p className="mt-3 text-gray-300 text-lg max-w-2xl mx-auto">
            Discover random movies and TV shows based on your preferences. Filter by genre, year, and
            rating to find your next favorite entertainment.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Results section - right column (mobile-first) */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Mobile filters toggle */}
            <div className="flex justify-end mb-4 lg:hidden">
              <button
                type="button"
                onClick={function () {
                  setFiltersOpen(function (prev) {
                    return !prev;
                  });
                }}
                className="inline-flex items-center px-3 py-2 text-sm rounded-lg border border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
              >
                {filtersOpen ? 'Hide filters' : 'Show filters'}
              </button>
            </div>

            {/* Generate button (desktop/tablet) */}
            <div className="text-center mb-8 hidden lg:block">
              <button
                onClick={generateRandomMedia}
                disabled={isLoading}
                className="btn-primary flex items-center mx-auto gap-2 px-8 py-4 text-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30"
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Random Content
                  </>
                )}
              </button>
            </div>

            {/* Error message display */}
            {error && (
              <div className="mt-4 p-4 bg-red-900/50 text-red-200 rounded-xl border border-red-700/50 backdrop-blur-sm flex items-start gap-3">
                <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-bold mb-1">Error</div>
                  <div>{error}</div>
                </div>
              </div>
            )}

            {/* Media card display */}
            {randomMedia && !isLoading && <MediaCard media={randomMedia} mediaType={mediaType} />}

            {/* Viewed media counter and list */}
            {viewedMedia.length > 0 && (
              <div className="mt-6 p-6 glass-effect rounded-xl border border-cyan-500/20 backdrop-blur-sm">
                <div className="text-center mb-4">
                  <span className="text-cyan-400 font-bold text-lg">
                    You've discovered {viewedMedia.length} content items
                  </span>
                  <span className="text-gray-400 text-sm ml-2">in this session</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {viewedMedia.map(function (media, index) {
                    const title = media.title || media.name;
                    const posterPath = media.poster_path;
                    return (
                      <div
                        key={media.id || index}
                        className="flex flex-col items-center gap-2 text-sm text-white font-semibold p-3 bg-slate-800/80 rounded-lg border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                      >
                        {posterPath ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                            alt={title}
                            className="w-full h-auto object-cover rounded shadow-md"
                          />
                        ) : (
                          <div className="w-full aspect-[2/3] bg-slate-700 rounded flex items-center justify-center">
                            <svg
                              className="w-12 h-12 text-slate-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
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
              <VoteCountFilter minVoteCount={minVoteCount} setMinVoteCount={setMinVoteCount} />
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
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-cyan-500/30 px-4 py-3 flex items-center justify-between lg:hidden backdrop-blur-md">
        <span className="text-sm text-gray-300">
          Generate a new {mediaType ? 'movie' : 'TV content'}
        </span>
        <button
          type="button"
          onClick={generateRandomMedia}
          disabled={isLoading}
          className="btn-primary flex items-center px-4 py-2 text-sm gap-2 shadow-lg shadow-cyan-500/30"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner mr-2"></div>
              Loading...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default HomePage;
