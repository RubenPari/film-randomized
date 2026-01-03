/**
 * Watchlist page component.
 * Displays and manages the user's watchlist with filtering capabilities.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext.jsx';
import { getWatchlist, removeFromWatchlist } from '../../shared/services/watchlistApi.js';
import { IMAGE_BASE_URL } from '../../shared/constants/api.js';

/**
 * Watchlist item card component.
 * Displays a single watchlist item with poster, title, and remove button.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.item - Watchlist item data
 * @param {Function} props.onRemove - Callback function when item is removed
 * @returns {JSX.Element} Watchlist item card
 */
export function WatchlistItemCard({ item, onRemove }) {
  const genres = item.genres ? JSON.parse(item.genres) : [];

  return (
    <div className="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-cyan-500/40 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
      {/* Poster */}
      <div className="relative">
        <a
          href={`https://www.themoviedb.org/${item.media_type ? 'movie' : 'tv'}/${item.tmdb_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative aspect-[2/3] bg-slate-900 overflow-hidden group/poster"
          title={`View ${item.title} on TMDB`}
        >
          {item.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${item.poster_path}`}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/poster:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <svg
                className="w-16 h-16 text-slate-600"
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

          {/* Media type badge */}
          <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-cyan-600/90 to-blue-600/90 backdrop-blur-xl rounded-lg text-xs font-bold text-white shadow-lg border border-cyan-400/30">
            {item.media_type ? 'Movie' : 'TV'}
          </div>
        </a>

        {/* Remove button */}
        <button
          onClick={function () {
            onRemove(item.tmdb_id);
          }}
          className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-2.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl z-10 transform hover:scale-110"
          title="Remove from watchlist"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-white text-sm mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-cyan-300 transition-colors duration-300">
          {item.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 space-x-2">
          {item.release_date && (
            <span className="px-2 py-1 bg-slate-700/40 rounded-md font-medium">
              {new Date(item.release_date).getFullYear()}
            </span>
          )}
          {item.vote_average && (
            <span className="text-amber-400 flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 rounded-md font-semibold">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              {item.vote_average.toFixed(1)}
            </span>
          )}
        </div>

        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {genres.slice(0, 2).map(function (genre) {
              return (
                <span
                  key={genre.id}
                  className="text-xs px-2.5 py-1 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 rounded-lg border border-cyan-500/30 hover:border-cyan-500/60 transition-colors duration-300 font-medium backdrop-blur-sm"
                >
                  {genre.name}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Dedicated watchlist page component.
 * Displays user's watchlist with filtering by media type.
 * 
 * @returns {JSX.Element} Watchlist page
 */
function WatchlistPage() {
  const { token } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'movies', 'tv'

  /**
   * Loads watchlist when component mounts or token changes.
   */
  useEffect(function () {
    if (token) {
      loadWatchlist();
    }
  }, [token]);

  /**
   * Loads watchlist from API.
   */
  const loadWatchlist = async function () {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await getWatchlist(token);
      setWatchlist(data);
    } catch (err) {
      setError('Error loading watchlist');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles removal of item from watchlist.
   * 
   * @param {number} tmdbId - TMDB ID of item to remove
   */
  const handleRemove = async function (tmdbId) {
    if (!token) return;
    
    try {
      await removeFromWatchlist(tmdbId, token);
      setWatchlist(function (prev) {
        return prev.filter(function (item) {
          return item.tmdb_id !== tmdbId;
        });
      });
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  /**
   * Filters watchlist based on selected filter.
   */
  const filteredWatchlist = watchlist.filter(function (item) {
    if (filter === 'movies') return item.media_type === true;
    if (filter === 'tv') return item.media_type === false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="glass-effect border-b border-slate-700/50 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110 transform"
                title="Back to home"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                My Watchlist
              </h1>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2">
              <button
                onClick={function () {
                  setFilter('all');
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/60 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                All
              </button>
              <button
                onClick={function () {
                  setFilter('movies');
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                  filter === 'movies'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/60 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                Movies
              </button>
              <button
                onClick={function () {
                  setFilter('tv');
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                  filter === 'tv'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/60 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                TV Shows
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="loading-spinner mr-3"></div>
            <span className="text-slate-300 text-lg font-medium">Loading your watchlist...</span>
          </div>
        ) : error ? (
          <div className="p-8 bg-gradient-to-r from-red-900/40 to-red-800/40 text-red-200 rounded-2xl border border-red-700/50 max-w-2xl mx-auto backdrop-blur-sm shadow-lg">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 6v2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <div className="font-bold mb-2 text-xl">Error Loading Watchlist</div>
                <div className="text-red-100">{error}</div>
              </div>
            </div>
          </div>
        ) : filteredWatchlist.length === 0 ? (
          <div className="text-center py-24 px-6">
            <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
              <svg
                className="w-16 h-16 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h2 className="text-slate-200 text-3xl font-bold mb-3">
              {filter === 'all'
                ? 'Your watchlist is empty'
                : `No ${filter === 'movies' ? 'movies' : 'TV shows'} yet`}
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
              {filter === 'all'
                ? 'Start building your watchlist by adding movies and TV shows you want to watch.'
                : `You haven't added any ${filter === 'movies' ? 'movies' : 'TV shows'} to your watchlist yet.`}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Discover new content
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8 px-6 py-4 rounded-2xl glass-effect border border-slate-700/50">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-1">Total Items</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    {filteredWatchlist.length}
                  </p>
                </div>
                <div className="hidden md:block text-slate-600">
                  <p className="text-sm">{filteredWatchlist.length === 1 ? 'item' : 'items'} in your watchlist</p>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in">
              {filteredWatchlist.map(function (item) {
                return <WatchlistItemCard key={item.id} item={item} onRemove={handleRemove} />;
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default WatchlistPage;
