const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Add a media item to the watchlist
 * @param {Object} media - Media object with all details
 * @param {boolean} mediaType - true for movie, false for TV show
 * @returns {Promise<Object>} - The created watchlist item
 */
export async function addToWatchlist(media, mediaType) {
  const payload = {
    tmdb_id: media.id,
    media_type: mediaType,
    title: media.title || media.name,
    original_title: media.original_title || media.original_name,
    overview: media.overview,
    poster_path: media.poster_path,
    backdrop_path: media.backdrop_path,
    vote_average: media.vote_average,
    vote_count: media.vote_count,
    release_date: media.release_date || media.first_air_date,
    genres: JSON.stringify(media.genres || []),
    runtime: media.runtime || null,
    number_of_seasons: media.number_of_seasons || null,
    number_of_episodes: media.number_of_episodes || null
  };

  const response = await fetch(`${API_BASE_URL}/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Errore nell\'aggiunta alla watchlist');
  }

  return await response.json();
}

/**
 * Get all items from the watchlist
 * @returns {Promise<Array>} - Array of watchlist items
 */
export async function getWatchlist() {
  const response = await fetch(`${API_BASE_URL}/watchlist`);

  if (!response.ok) {
    throw new Error('Errore nel recupero della watchlist');
  }

  return await response.json();
}

/**
 * Check if a media item is in the watchlist
 * @param {number} tmdbId - TMDB ID of the media
 * @returns {Promise<boolean>} - True if item is in watchlist
 */
export async function checkInWatchlist(tmdbId) {
  const response = await fetch(`${API_BASE_URL}/watchlist/${tmdbId}`);

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.in_watchlist;
}

/**
 * Remove a media item from the watchlist
 * @param {number} tmdbId - TMDB ID of the media to remove
 * @returns {Promise<void>}
 */
export async function removeFromWatchlist(tmdbId) {
  const response = await fetch(`${API_BASE_URL}/watchlist/${tmdbId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Errore nella rimozione dalla watchlist');
  }
}
