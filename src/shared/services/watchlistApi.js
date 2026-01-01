/**
 * Watchlist API service.
 * Handles all watchlist-related API calls to the backend.
 */

/**
 * Base URL for API requests.
 * Uses relative path in production, localhost in development.
 * @type {string}
 */
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000/api';

/**
 * Gets authorization headers with token.
 * 
 * @param {string} token - JWT authentication token
 * @returns {Object} Headers object with Content-Type and Authorization
 */
function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * Adds a media item to the watchlist.
 * 
 * @param {Object} media - Media object with all details from TMDb
 * @param {number} media.id - TMDB ID
 * @param {string} media.title - Title (for movies)
 * @param {string} media.name - Title (for TV shows)
 * @param {boolean} mediaType - true for movie, false for TV show
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} Promise that resolves to the created watchlist item
 * @throws {Error} If the request fails
 */
export async function addToWatchlist(media, mediaType, token) {
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
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.detail || 'Error adding to watchlist');
  }

  return await response.json();
}

/**
 * Gets all items from the watchlist.
 * 
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Array<Object>>} Promise that resolves to array of watchlist items
 * @throws {Error} If the request fails
 */
export async function getWatchlist(token) {
  const response = await fetch(`${API_BASE_URL}/watchlist`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Error retrieving watchlist');
  }

  return await response.json();
}

/**
 * Checks if a media item is in the watchlist.
 * 
 * @param {number} tmdbId - TMDB ID of the media
 * @param {string} token - JWT token for authentication
 * @returns {Promise<boolean>} Promise that resolves to true if item is in watchlist
 */
export async function checkInWatchlist(tmdbId, token) {
  const response = await fetch(`${API_BASE_URL}/watchlist/${tmdbId}`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.in_watchlist;
}

/**
 * Removes a media item from the watchlist.
 * 
 * @param {number} tmdbId - TMDB ID of the media to remove
 * @param {string} token - JWT token for authentication
 * @returns {Promise<void>} Promise that resolves when item is removed
 * @throws {Error} If the request fails
 */
export async function removeFromWatchlist(tmdbId, token) {
  const response = await fetch(`${API_BASE_URL}/watchlist/${tmdbId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.detail || 'Error removing from watchlist');
  }
}
