import React, { useState, useEffect } from 'react';
import { useAuth } from '../../shared/context/AuthContext.jsx';
import { getWatchlist, removeFromWatchlist } from '../../shared/services/watchlistApi.js';
import { WatchlistItemCard } from './WatchlistPage.jsx';

/**
 * Component to display and manage the user's watchlist
 */
function Watchlist({ isOpen, onClose }) {
  const { token } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(
    function () {
      if (isOpen && token) {
        loadWatchlist();
      }
    },
    [isOpen, token]
  );

  const loadWatchlist = async function () {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await getWatchlist(token);
      setWatchlist(data);
    } catch (err) {
      setError('Errore nel caricamento della watchlist');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
      console.error('Errore nella rimozione:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">La mia Watchlist</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner mr-3"></div>
              <span className="text-gray-400">Caricamento...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-700/50">
              {error}
            </div>
          ) : watchlist.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-400 text-lg">La tua watchlist è vuota</p>
              <p className="text-gray-500 text-sm mt-2">Aggiungi contenuti per iniziare!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {watchlist.map(function (item) {
                return (
                  <WatchlistItemCard key={item.id} item={item} onRemove={handleRemove} />
                );
              })}
            </div>
          )}

                      </div>

                      {/* Info */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-gray-400">
                                {item.media_type ? 'Film' : 'Serie TV'}
                              </span>
                              {item.vote_average && (
                                <span className="text-yellow-400">
                                  ★ {item.vote_average.toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={function () {
                              handleRemove(item.tmdb_id);
                            }}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Rimuovi dalla watchlist"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>

                        {genres.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {genres.slice(0, 3).map(function (genre) {
                              return (
                                <span
                                  key={genre.id}
                                  className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded"
                                >
                                  {genre.name}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Watchlist;
