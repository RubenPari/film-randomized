import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWatchlist, removeFromWatchlist } from '../services/watchlistApi.js';
import { IMAGE_BASE_URL } from '../constants/api.js';

/**
 * Dedicated watchlist page component
 */
function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'movies', 'tv'

  useEffect(function() {
    loadWatchlist();
  }, []);

  const loadWatchlist = async function() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getWatchlist();
      setWatchlist(data);
    } catch (err) {
      setError('Errore nel caricamento della watchlist');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async function(tmdbId) {
    try {
      await removeFromWatchlist(tmdbId);
      setWatchlist(function(prev) {
        return prev.filter(function(item) {
          return item.tmdb_id !== tmdbId;
        });
      });
    } catch (err) {
      console.error('Errore nella rimozione:', err);
    }
  };

  const filteredWatchlist = watchlist.filter(function(item) {
    if (filter === 'movies') return item.media_type === true;
    if (filter === 'tv') return item.media_type === false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-gray-400 hover:text-white transition-colors"
                title="Torna alla home"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-white">La mia Watchlist</h1>
            </div>
            
            {/* Filter tabs */}
            <div className="flex gap-2">
              <button
                onClick={function() { setFilter('all'); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Tutti
              </button>
              <button
                onClick={function() { setFilter('movies'); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'movies'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Film
              </button>
              <button
                onClick={function() { setFilter('tv'); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'tv'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Serie TV
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
            <span className="text-gray-400 text-lg">Caricamento...</span>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-900/50 text-red-200 rounded-xl border border-red-700/50 max-w-2xl mx-auto">
            <div className="font-bold mb-2 text-xl">Errore</div>
            <div>{error}</div>
          </div>
        ) : filteredWatchlist.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-400 text-2xl font-semibold mb-2">
              {filter === 'all' ? 'La tua watchlist è vuota' : `Nessun ${filter === 'movies' ? 'film' : 'serie TV'} nella watchlist`}
            </p>
            <p className="text-gray-500 mb-6">Torna alla home e aggiungi contenuti da guardare!</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Scopri nuovi contenuti
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-400">
                {filteredWatchlist.length} {filteredWatchlist.length === 1 ? 'contenuto' : 'contenuti'}
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredWatchlist.map(function(item) {
                const genres = item.genres ? JSON.parse(item.genres) : [];
                
                return (
                  <div
                    key={item.id}
                    className="group bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600 hover:scale-105 transition-all duration-200"
                  >
                    {/* Poster */}
                    <div className="relative">
                      <a
                        href={`https://www.themoviedb.org/${item.media_type ? 'movie' : 'tv'}/${item.tmdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative aspect-[2/3] bg-gray-800 hover:opacity-90 transition-opacity"
                        title={`Visualizza ${item.title} su TMDB`}
                      >
                        {item.poster_path ? (
                          <img
                            src={`${IMAGE_BASE_URL}${item.poster_path}`}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}

                        {/* Media type badge */}
                        <div className="absolute top-2 right-2 px-2 py-1 bg-gray-900/90 backdrop-blur-sm rounded text-xs font-medium text-white">
                          {item.media_type ? 'Film' : 'TV'}
                        </div>
                      </a>

                      {/* Remove button - fixed position outside image */}
                      <button
                        onClick={function() { handleRemove(item.tmdb_id); }}
                        className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 z-10"
                        title="Rimuovi dalla watchlist"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        {item.release_date && (
                          <span>{new Date(item.release_date).getFullYear()}</span>
                        )}
                        {item.vote_average && (
                          <span className="text-yellow-400 flex items-center gap-1">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                            {item.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>

                      {genres.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {genres.slice(0, 2).map(function(genre) {
                            return (
                              <span
                                key={genre.id}
                                className="text-xs px-2 py-0.5 bg-gray-700/50 text-gray-300 rounded"
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
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default WatchlistPage;
