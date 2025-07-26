/**
 * Service for managing the watchlist and watched
 * media Uses localStorage for persistence
 */

const STORAGE_KEYS = {
  TO_WATCH: 'media_to_watch',
  WATCHED: 'media_watched',
};

/**
 * Get items from a specific list
 * @param {string} listType - Either 'TO_WATCH' or 'WATCHED'
 * @returns {Array} Array of media items
 */
export function getList(listType) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS[listType]);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from local storage:', error);
    return [];
  }
}

/**
 * Add a media item to a specific list
 * @param {Object} media - Media object to add
 * @param {string} listType - Either 'TO_WATCH' or 'WATCHED'
 * @returns {boolean} Success status
 */
export function addToList(media, listType) {
  try {
    const list = getList(listType);

    // CHeck if already exists
    if (list.some((item) => item.id === media.id)) {
      return false;
    }

    // Add timestamp and save essential data
    const mediaToSave = {
      id: media.id,
      title: media.title || media.name,
      poster_path: media.poster_path,
      overview: media.overview,
      vote_average: media.vote_average,
      release_date: media.release_date || media.first_air_date,
      genres: media.genres,
      mediaType: media.title ? 'movie' : 'tv',
      addedAt: new Date().toISOString(),
    };

    list.push(mediaToSave);
    localStorage.setItem(STORAGE_KEYS[listType], JSON.stringify(list));
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
 * @returns {boolean} Success status
 */
export function removeFromList(mediaId, listType) {
  try {
    const list = getList(listType);
    const filteredList = list.filter((item) => item.id !== mediaId);
    localStorage.setItem(STORAGE_KEYS[listType], JSON.stringify(filteredList));
    return true;
  } catch (error) {
    console.error(`Error removing from ${listType} list:`, error);
    return false;
  }
}

/**
 * Move a media item from "to watch" to "watched"
 * @param {number} mediaId - ID of the media to move
 * @returns {boolean} Success status
 */
export function markAsWatched(mediaId) {
  try {
    const toWatchList = getList('TO_WATCH');
    const media = toWatchList.find((item) => item.id === mediaId);

    if (!media) {
      return false;
    }

    // Remove from "to watch"
    removeFromList(mediaId, 'TO_WATCH');

    // Add to "watched" with watched date
    media.watchedAt = new Date().toISOString();
    addToList(media, 'WATCHED');

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
 * @returns {boolean} True if media is in the list
 */
export function isInList(mediaId, listType) {
  const list = getList(listType);
  return list.some((item) => item.id === mediaId);
}

/**
 * Get statistics about the lists
 * @returns {Object} Statistics object
 */
export function getStatistics() {
  const toWatch = getList('TO_WATCH');
  const watched = getList('WATCHED');

  return {
    toWatchCount: toWatch.length,
    watchedCount: watched.length,
    totalCount: toWatch.length + watched.length,
    genres: getGenreStatistics([...toWatch, ...watched]),
  };
}

/**
 * Get genre statistics from a list of media
 * @param {Array} mediaList - List of media items
 * @returns {Object} Genre statistics
 */
function getGenreStatistics(mediaList) {
  const genreCounts = {};

  mediaList.forEach((media) => {
    if (media.genres) {
      media.genres.forEach((genre) => {
        genreCounts[genre.name] = (genreCounts[genre.name] || 0) + 1;
      });
    }
  });

  return genreCounts;
}

/**
 * Clear all data from both lists
 * @returns {boolean} Success status
 */
export function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.TO_WATCH);
    localStorage.removeItem(STORAGE_KEYS.WATCHED);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
}
