import React, { useState, useEffect } from 'react';
import { addToWatchlist, removeFromWatchlist, checkInWatchlist } from '../services/watchlistApi.js';

/**
 * Component for saving media items to watchlist
 * @param {Object} props - Component props
 * @param {Object} props.media - Media object to save
 */
function SaveButtons({ media }) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine media type based on available properties
  const mediaType = media.title !== undefined; // true = movie, false = TV show

  // Check if media is already in watchlist on mount
  useEffect(function() {
    const checkStatus = async function() {
      try {
        const inWatchlist = await checkInWatchlist(media.id);
        setIsInWatchlist(inWatchlist);
      } catch (err) {
        console.error('Errore nel controllo della watchlist:', err);
      }
    };

    checkStatus();
  }, [media.id]);

  const handleAddToWatchlist = async function() {
    setIsLoading(true);
    setError(null);

    try {
      await addToWatchlist(media, mediaType);
      setIsInWatchlist(true);
    } catch (err) {
      setError(err.message);
      console.error('Errore nell\'aggiunta alla watchlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async function() {
    setIsLoading(true);
    setError(null);

    try {
      await removeFromWatchlist(media.id);
      setIsInWatchlist(false);
    } catch (err) {
      setError(err.message);
      console.error('Errore nella rimozione dalla watchlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {error && (
        <div className="mb-3 p-3 bg-red-900/50 text-red-200 rounded-lg text-sm border border-red-700/50">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        {!isInWatchlist ? (
          <button
            onClick={handleAddToWatchlist}
            disabled={isLoading}
            className="btn-primary flex items-center justify-center gap-2 flex-1"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Aggiunta...
              </>
            ) : (
              <>
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Aggiungi alla Watchlist
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleRemoveFromWatchlist}
            disabled={isLoading}
            className="btn-secondary flex items-center justify-center gap-2 flex-1 bg-green-600 hover:bg-green-700 border-green-500 text-white"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Rimozione...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                Nella Watchlist
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default SaveButtons;
