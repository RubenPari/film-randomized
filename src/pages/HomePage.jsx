/**
 * Home page component with media generator.
 * Main page where users can generate random media based on filters.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../shared/context/AuthContext.jsx';
import { useMediaGenerator } from '../features/media/hooks/useMediaGenerator.js';
import FilterPanel from '../features/media/components/filters/FilterPanel.jsx';
import SessionControls from '../features/media/components/SessionControls.jsx';
import MediaCard from '../features/media/components/MediaCard.jsx';
import LanguageSwitcher from '../shared/components/LanguageSwitcher.jsx';

/**
 * Home page component.
 * Displays media generator with filters and generated media results.
 * 
 * @returns {JSX.Element} Home page with media generator
 */
function HomePage() {
  const { t } = useTranslation();
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
    exportViewedMedia,
    importViewedMedia,
  } = useMediaGenerator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 pb-24 md:p-8 md:pb-8">
      <div className="max-w-6xl mx-auto">
        {/* User header */}
        <div className="flex justify-between items-center mb-4">
          <LanguageSwitcher />
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
              title={t('common.watchlist')}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="hidden md:inline">{t('common.watchlist')}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 border-red-500 text-white hover:scale-105 transition-transform duration-200"
              title={t('common.logout')}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden md:inline">{t('common.logout')}</span>
            </button>
          </div>
        </div>

        {/* Header section with title and description */}
        <header className="text-center mb-10 py-8">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
            {t('home.title', { type: mediaType ? t('home.movie') : t('home.tvShow') })}
          </h1>
          <p className="mt-3 text-gray-300 text-lg max-w-2xl mx-auto">
            {t('home.description')}
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
                {filtersOpen ? t('home.hideFilters') : t('home.showFilters')}
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
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t('home.generate')}
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
                  <div className="font-bold mb-1">{t('common.error')}</div>
                  <div>{error}</div>
                </div>
              </div>
            )}

            {/* Media card display */}
            {randomMedia && !isLoading && <MediaCard media={randomMedia} mediaType={mediaType} />}

            {/* Viewed media counter and session management */}
            <SessionControls
              viewedMedia={viewedMedia}
              exportViewedMedia={exportViewedMedia}
              importViewedMedia={importViewedMedia}
            />
          </div>

          {/* Filter section - left column */}
          <div
            className={
              'lg:col-span-1 space-y-6 order-2 lg:order-1 ' +
              (filtersOpen ? 'block ' : 'hidden ') +
              'lg:block'
            }
          >
            <FilterPanel
              mediaType={mediaType}
              setMediaType={setMediaType}
              minRating={minRating}
              maxRating={maxRating}
              setMinRating={setMinRating}
              setMaxRating={setMaxRating}
              releaseYearFrom={releaseYearFrom}
              releaseYearTo={releaseYearTo}
              setReleaseYearFrom={setReleaseYearFrom}
              setReleaseYearTo={setReleaseYearTo}
              minVoteCount={minVoteCount}
              setMinVoteCount={setMinVoteCount}
              genres={genres}
              selectedGenres={selectedGenres}
              handleGenreToggle={handleGenreToggle}
            />
          </div>
        </div>
      </div>

      {/* Mobile sticky generate button */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-cyan-500/30 px-4 py-3 flex items-center justify-between lg:hidden backdrop-blur-md">
        <span className="text-sm text-gray-300">
          {t('home.generateMobile', { type: mediaType ? t('home.movieMobile') : t('home.tvMobile') })}
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
              {t('common.loading')}
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {t('home.generate')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default HomePage;
