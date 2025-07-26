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

  // Load lists when component mounts
  useEffect(function () {
    loadLists();
  }, []);

  const loadLists = function () {
    setToWatchList(watchlistService.getList('TO_WATCH'));
    setWatchedList(watchlistService.getList('WATCHED'));
    setStatistics(watchlistService.getStatistics());
  };

  const handleRemove = function (mediaId, listType) {
    if (watchlistService.removeFromList(mediaId, listType)) {
      loadLists();
    }
  };

  const handleMarkAsWatched = function (mediaId) {
    if (watchlistService.markAsWatched(mediaId)) {
      loadLists();
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
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
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
            onClick={function () {
              setActiveTab('TO_WATCH');
            }}
            className={`flex-1 py-3 px-6 font-medium transition-colors ${
              activeTab === 'TO_WATCH'
                ? 'bg-yellow-600/20 text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Da guardare ({toWatchList.length})
          </button>
          <button
            onClick={function () {
              setActiveTab('WATCHED');
            }}
            className={`flex-1 py-3 px-6 font-medium transition-colors ${
              activeTab === 'WATCHED'
                ? 'bg-green-600/20 text-green-400 border-b-2 border-green-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Guardati ({watchedList.length})
          </button>
        </div>

        {/* List content */}
        <div className="overflow-y-auto max-h-[calc(90vh-240px)]">
          {currentList.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 4v16M17 4v16M3 8h18M3 16h18"
                />
              </svg>
              <p>Nessun contenuto in questa lista</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {currentList.map(function (media) {
                return (
                  <div
                    key={media.id}
                    className="bg-gray-700/50 rounded-lg p-4 flex gap-4 hover:bg-gray-700 transition-colors"
                  >
                    {/* Poster */}
                    <div className="w-20 flex-shrink-0">
                      {media.poster_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}${media.poster_path}`}
                          alt={media.title}
                          className="w-full rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-28 bg-gray-600 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
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
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{media.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">
                        Voto: {media.vote_average.toFixed(1)}/10
                        {media.release_date && ` • ${new Date(media.release_date).getFullYear()}`}
                      </p>
                      <p className="text-sm text-gray-300 line-clamp-2">{media.overview}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {activeTab === 'TO_WATCH' && (
                        <button
                          onClick={function () {
                            handleMarkAsWatched(media.id);
                          }}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                        >
                          Visto
                        </button>
                      )}
                      <button
                        onClick={function () {
                          handleRemove(media.id, activeTab);
                        }}
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
