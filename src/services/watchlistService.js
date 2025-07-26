/**
 * Service for managing the watchlist and watched media
 * Now uses backend API instead of localStorage
 */

import { api } from './api.js';

// Cache for optimization
let cache = {
  toWatch: null,
  watched: null,
  lastFetch: null,
};

const CACHE_DURATION = 30000; // 30 seconds

/**
 * Clear cache
 */
function clearCache() {
  cache = {
    toWatch: null,
    watched: null,
    lastFetch: null,
  };
}

/**
 * Get items from a specific list
 * @param {string} listType - Either 'TO_WATCH' or 'WATCHED'
 * @returns {Promise<Array>} Array of media items
 */
export async function getList(listType) {
  try {
    const status = listType === 'TO_WATCH' ? 'to_watch' : 'watched';

    // Check cache
    if (cache.lastFetch && Date.now() - cache.lastFetch < CACHE_DURATION) {
      if (listType === 'TO_WATCH' && cache.toWatch) return cache.toWatch;
      if (listType === 'WATCHED' && cache.watched) return cache.watched;
    }

    const watchlist = await api.getWatchlist(status);

    // Update cache
    if (listType === 'TO_WATCH') {
      cache.toWatch = watchlist;
    } else {
      cache.watched = watchlist;
    }
    cache.lastFetch = Date.now();

    return watchlist;
  } catch (error) {
    console.error(`Error reading ${listType} list:`, error);
    return [];
  }
}

/**
 * Add a media item to a specific list
 * @param {Object} media - Media object to add
 * @param {string} listType - Either 'TO_WATCH' or 'WATCHED'
 * @returns {Promise<boolean>} Success status
 */
export async function addToList(media, listType) {
  try {
    const status = listType === 'TO_WATCH' ? 'to_watch' : 'watched';
    await api.addToWatchlist(media, status);
    clearCache();
    return true;
  } catch (error) {
    console.error(`Error adding to ${listType} list:`, error);
    return false;
  }
}

/**
 * Remove a media item from a specific list
 * @param {number} mediaId - ID of the media to remove
 * @param {string} listType - Either 'TO_WATCH' or 'WATCHED'
 * @returns {Promise<boolean>} Success status
 */
export async function removeFromList(mediaId, listType) {
  try {
    await api.removeFromWatchlist(mediaId);
    clearCache();
    return true;
  } catch (error) {
    console.error(`Error removing from ${listType} list:`, error);
    return false;
  }
}

/**
 * Move a media item from "to watch" to "watched"
 * @param {number} mediaId - ID of the media to move
 * @returns {Promise<boolean>} Success status
 */
export async function markAsWatched(mediaId) {
  try {
    await api.updateStatus(mediaId, 'watched');
    clearCache();
    return true;
  } catch (error) {
    console.error('Error marking as watched:', error);
    return false;
  }
}

/**
 * Check if a media item is in a specific list
 * @param {number} mediaId - ID of the media to check
 * @param {string} listType - Either 'TO_WATCH' or 'WATCHED'
 * @returns {Promise<boolean>} True if media is in the list
 */
export async function isInList(mediaId, listType) {
  const list = await getList(listType);
  return list.some((item) => item.media_id === mediaId);
}

/**
 * Get statistics about the lists
 * @returns {Promise<Object>} Statistics object
 */
export async function getStatistics() {
  try {
    const stats = await api.getStatistics();
    return {
      toWatchCount: parseInt(stats.to_watch_count) || 0,
      watchedCount: parseInt(stats.watched_count) || 0,
      totalCount: parseInt(stats.total_count) || 0,
      genres:
        stats.genres?.reduce((acc, genre) => {
          acc[genre.genre_name] = parseInt(genre.count);
          return acc;
        }, {}) || {},
    };
  } catch (error) {
    console.error('Error getting statistics:', error);
    return {
      toWatchCount: 0,
      watchedCount: 0,
      totalCount: 0,
      genres: {},
    };
  }
}

/**
 * Clear all data from both lists
 * @returns {Promise<boolean>} Success status
 */
export async function clearAllData() {
  try {
    // Get all items and remove them one by one
    const toWatch = await getList('TO_WATCH');
    const watched = await getList('WATCHED');

    const allItems = [...toWatch, ...watched];

    for (const item of allItems) {
      await api.removeFromWatchlist(item.media_id);
    }

    clearCache();
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
}
