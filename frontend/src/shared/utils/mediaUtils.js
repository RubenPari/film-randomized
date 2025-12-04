/**
 * Filter out media that has already been viewed or doesn't have a valid description
 * @param {Array} results - Array of media items from API
 * @param {Array} viewedMedia - Array of already viewed media items
 * @returns {Array} Filtered array of valid media items
 */
export function filterValidMedia(results, viewedMedia) {
    return results.filter(
        function(media) {
            return !viewedMedia.some(function(viewed) { 
                return viewed.id === media.id; 
            }) &&
            media.overview &&
            media.overview.trim() !== '' &&
            media.overview !== 'Nessuna descrizione disponibile in italiano.';
        }
    );
}

/**
 * Check if a media item has a valid description in Italian
 * @param {Object} media - Media object to check
 * @returns {boolean} True if media has a valid description
 */
export function hasValidDescription(media) {
    return media.overview &&
        media.overview.trim() !== '' &&
        media.overview !== 'Nessuna descrizione disponibile in italiano.';
}

/**
 * Generate a random page number within the total pages
 * @param {number} totalPages - Total number of pages available
 * @returns {number} Random page number
 */
export function getRandomPage(totalPages) {
    return Math.floor(Math.random() * totalPages) + 1;
}

/**
 * Select a random media item from an array
 * @param {Array} mediaArray - Array of media items
 * @returns {Object} Randomly selected media item
 */
export function getRandomMedia(mediaArray) {
    const randomIndex = Math.floor(Math.random() * mediaArray.length);
    return mediaArray[randomIndex];
}