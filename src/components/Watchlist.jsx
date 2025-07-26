import React, { useState, useEffect } from 'react';
import * as watchlistService from '../services/watchlistService.js';
import { IMAGE_BASE_URL } from '../constants/api.js';

/**
 * Component for displaying saved watchlist and watched media
 */
function Watchlist({ onClose }) {
  const [activeTab, setActiveTab] = useState('TO_WATCH');
  const [toWatchList, setToWatchList] = useState([]);
  const [watchedList, setWatchedList] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load lists when component mounts
  useEffect(function () {
    loadLists();
  }, []);

  const loadLists = async function () {
    try {
      setIsLoading(true);
      setError(null);

      // Load both lists
      const [toWatch, watched, stats] = await Promise.all([
        watchlistService.getList('TO_WATCH'),
        watchlistService.getList('WATCHED'),
        watchlistService.getStatistics()
      ]);

      // Ensure we have arrays
      setToWatchList(Array.isArray(toWatch) ? toWatch : []);
      setWatchedList(Array.isArray(watched) ? watched : []);
      setStatistics(stats);
    } catch (err) {
      console.error('Error loading watchlist:', err);
      setError('Errore nel caricamento delle liste');
      setToWatchList([]);
      setWatchedList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async function (mediaId, listType) {
    try {
      const success = await watchlistService.removeFromList(mediaId, listType);
      if (success) {
        await loadLists();
      }
    } catch (err) {
      console.error('Error removing from list:', err);
    }
  };

  const handleMarkAsWatched = async function (mediaId) {
    try {
      const success = await watchlistService.markAsWatched(mediaId);
      if (success) {
        await loadLists();
      }
    } catch (err) {
      console.error('Error marking as watched:', err);
    }
  };

  const currentList = activeTab === 'TO_WATCH' ? toWatchList : watchedList;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Le mie liste
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="px-6 py-4 bg-gray-900/50 border-b border-gray-700">
            <div className="flex gap-6 text-sm">
              <span className="text-yellow-400">
                Da guardare: <strong>{statistics.toWatchCount}</strong>
              </span>
              <span className="text-green-400">
                Guardati: <strong>{statistics.watchedCount}</strong>
              </span>
              <span className="text-blue-400">
                Totale: <strong>{statistics.totalCount}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={function () { setActiveTab('TO_WATCH'); }}
            className={`flex-1 py-3 px-6 font-medium transition-colors ${activeTab === 'TO_WATCH'
                ? 'bg-yellow-600/20 text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            Da guardare ({toWatchList.length})
          </button>
          <button
            onClick={function () { setActiveTab('WATCHED'); }}
            className={`flex-1 py-3 px-6 font-medium transition-colors ${activeTab === 'WATCHED'
                ? 'bg-green-600/20 text-green-400 border-b-2 border-green-400'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            Guardati ({watchedList.length})
          </button>
        </div>

        {/* List content */}
        <div className="overflow-y-auto max-h-[calc(90vh-240px)]">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-gray-400">Caricamento...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">
              <p>{error}</p>
              <button
                onClick={loadLists}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Riprova
              </button>
            </div>
          ) : currentList.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
              </svg>
              <p>Nessun contenuto in questa lista</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {currentList.map(function (item) {
                // Handle both old structure (media.title) and new structure (title directly)
                const media = item.media || item;
                const mediaId = item.media_id || item.id || media.id;
                const title = media.title || media.name;
                const releaseDate = media.release_date || media.first_air_date;
                const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

                return (
                  <div key={item.watchlist_id || mediaId} className="bg-gray-700/50 rounded-lg p-4 flex gap-4 hover:bg-gray-700 transition-colors">
                    {/* Poster */}
                    <div className="w-20 flex-shrink-0">
                      {media.poster_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}${media.poster_path}`}
                          alt={title}
                          className="w-full rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-28 bg-gray-600 rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">
                        {title}
                        {year && <span className="ml-2 text-gray-400 font-normal">({year})</span>}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        Voto: {media.vote_average && !isNaN(parseFloat(media.vote_average))
                          ? parseFloat(media.vote_average).toFixed(1)
                          : 'N/D'}/10
                      </p>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {media.overview || 'Nessuna descrizione disponibile'}
                      </p>
                      {item.added_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          Aggiunto il {new Date(item.added_at).toLocaleDateString('it-IT')}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {activeTab === 'TO_WATCH' && (
                        <button
                          onClick={function () { handleMarkAsWatched(mediaId); }}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                        >
                          Visto
                        </button>
                      )}
                      <button
                        onClick={function () { handleRemove(mediaId, activeTab); }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                      >
                        Rimuovi
                      </button>
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