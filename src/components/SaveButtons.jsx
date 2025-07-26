import React, { useState, useEffect } from 'react';
import * as watchlistService from '../services/watchlistService.js';

/**
 * Component for saving media to watchlist or marking as watched
 * @param {Object} props - Component props
 * @param {Object} props.media - Media object to save
 */
function SaveButtons({ media }) {
  const [isInToWatch, setIsInToWatch] = useState(false);
  const [isInWatched, setIsInWatched] = useState(false);
  const [showMessage, setShowMessage] = useState('');

  // Check if media is already in lists when component mounts or media changes
  useEffect(
    function () {
      if (media && media.id) {
        setIsInToWatch(watchlistService.isInList(media.id, 'TO_WATCH'));
        setIsInWatched(watchlistService.isInList(media.id, 'WATCHED'));
      }
    },
    [media]
  );

  // Show temporary message
  const showTempMessage = function (message) {
    setShowMessage(message);
    setTimeout(function () {
      setShowMessage('');
    }, 3000);
  };

  // Handle adding to watchlist
  const handleAddToWatchlist = function () {
    if (watchlistService.addToList(media, 'TO_WATCH')) {
      setIsInToWatch(true);
      showTempMessage('Aggiunto alla lista "Da guardare"!');
    } else {
      showTempMessage('Già presente nella lista');
    }
  };

  // Handle marking as watched
  const handleMarkAsWatched = function () {
    if (isInToWatch) {
      // If in watchlist, move to watched
      if (watchlistService.markAsWatched(media.id)) {
        setIsInToWatch(false);
        setIsInWatched(true);
        showTempMessage('Spostato in "Guardati"!');
      }
    } else {
      // Otherwise, add directly to watched
      if (watchlistService.addToList(media, 'WATCHED')) {
        setIsInWatched(true);
        showTempMessage('Aggiunto alla lista "Guardati"!');
      } else {
        showTempMessage('Già presente nella lista');
      }
    }
  };

  // Handle removing from lists
  const handleRemoveFromToWatch = function () {
    if (watchlistService.removeFromList(media.id, 'TO_WATCH')) {
      setIsInToWatch(false);
      showTempMessage('Rimosso dalla lista "Da guardare"');
    }
  };

  const handleRemoveFromWatched = function () {
    if (watchlistService.removeFromList(media.id, 'WATCHED')) {
      setIsInWatched(false);
      showTempMessage('Rimosso dalla lista "Guardati"');
    }
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-3">
        {/* To Watch Button */}
        {!isInWatched && (
          <button
            onClick={isInToWatch ? handleRemoveFromToWatch : handleAddToWatchlist}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isInToWatch
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isInToWatch ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              )}
            </svg>
            {isInToWatch ? 'Nella lista' : 'Da guardare'}
          </button>
        )}

        {/* Watched Button */}
        <button
          onClick={isInWatched ? handleRemoveFromWatched : handleMarkAsWatched}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isInWatched
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          }`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          {isInWatched ? 'Già visto' : 'Guardato'}
        </button>
      </div>

      {/* Message display */}
      {showMessage && (
        <div className="mt-3 px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg text-sm animate-fade-in">
          {showMessage}
        </div>
      )}
    </div>
  );
}

export default SaveButtons;
