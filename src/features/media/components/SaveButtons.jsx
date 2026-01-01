/**
 * Component for saving media items to watchlist.
 * Handles adding and removing items from the user's watchlist.
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext.jsx';
import {
  addToWatchlist,
  removeFromWatchlist,
  checkInWatchlist,
} from '../../../shared/services/watchlistApi.js';

/**
 * Save buttons component for watchlist management.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.media - Media object to save
 * @param {number} props.media.id - TMDB ID of the media
 * @param {boolean} props.mediaType - true for movie, false for TV show
 * @returns {JSX.Element} Save buttons component
 */
function SaveButtons({ media, mediaType }) {
  const { token } = useAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Checks if media is already in watchlist on mount.
   */
  useEffect(
    function () {
      if (!token) return;
      
      const checkStatus = async function () {
        try {
          const inWatchlist = await checkInWatchlist(media.id, token);
          setIsInWatchlist(inWatchlist);
        } catch (err) {
          console.error('Error checking watchlist status:', err);
        }
      };

      checkStatus();
    },
    [media.id, token]
  );

  /**
   * Handles adding media to watchlist.
   */
  const handleAddToWatchlist = async function () {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await addToWatchlist(media, mediaType, token);
      setIsInWatchlist(true);
    } catch (err) {
      setError(err.message);
      console.error('Error adding to watchlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles removing media from watchlist.
   */
  const handleRemoveFromWatchlist = async function () {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await removeFromWatchlist(media.id, token);
      setIsInWatchlist(false);
    } catch (err) {
      setError(err.message);
      console.error('Error removing from watchlist:', err);
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
                Adding...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add to Watchlist
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
                Removing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                In Watchlist
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default SaveButtons;
