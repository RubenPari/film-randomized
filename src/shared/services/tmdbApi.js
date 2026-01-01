/**
 * The Movie Database (TMDb) API service.
 * Handles all API calls to TMDb for fetching media data.
 */

import {API_ENDPOINTS, API_KEY} from "../constants/api.js";

/**
 * Fetches all available genres for movies and TV shows.
 * Combines movie and TV genres, removing duplicates.
 * 
 * @returns {Promise<Array<Object>>} Promise that resolves to an array of unique genres
 * @throws {Error} If the API request fails
 */
export async function fetchGenres() {
    try {
        // Fetch both movie and TV genres in parallel
        const [movieGenresResponse, tvGenresResponse] = await Promise.all([
            fetch(`${API_ENDPOINTS.movieGenres}?api_key=${API_KEY}&language=it-IT`),
            fetch(`${API_ENDPOINTS.tvGenres}?api_key=${API_KEY}&language=it-IT`)
        ]);

        // Parse both responses
        const [movieGenresData, tvGenresData] = await Promise.all([
            movieGenresResponse.json(),
            tvGenresResponse.json()
        ]);

        // Combine genres from both responses
        const allGenres = [...movieGenresData.genres, ...tvGenresData.genres];

        // Remove duplicate genres by ID and return unique list
        return Array.from(new Set(allGenres.map(function(g) { 
            return g.id; 
        }))).map(function(id) {
            return allGenres.find(function(g) { 
                return g.id === id; 
            });
        });
    } catch (error) {
        throw new Error("Unable to retrieve genres: " + error.message);
    }
}

/**
 * Discovers media based on filters.
 * 
 * @param {boolean} mediaType - true for movies, false for TV shows
 * @param {Object} filters - Object containing filter parameters
 * @param {number} filters.minRating - Minimum vote average
 * @param {number} filters.maxRating - Maximum vote average
 * @param {Array<number>} filters.selectedGenres - Array of genre IDs
 * @param {number} filters.releaseYearFrom - Start year for release date
 * @param {number} filters.releaseYearTo - End year for release date
 * @param {number} filters.minVoteCount - Minimum number of votes
 * @returns {Promise<Object>} Promise that resolves to an object with discovery URL and total pages
 * @throws {Error} If no results are found with the given filters
 */
export async function discoverMedia(mediaType, filters) {
    const {minRating, maxRating, selectedGenres, releaseYearFrom, releaseYearTo, minVoteCount} = filters;

    // Build genre parameter string if genres are selected
    const genreParam = selectedGenres.length > 0 ? `&with_genres=${selectedGenres.join(",")}` : "";
    
    // Determine media type parameter for API
    const mediaTypeParam = mediaType ? 'movie' : 'tv';

    // Construct the discovery URL with all filters
    const discoverUrl = `${API_ENDPOINTS.discover(mediaTypeParam)}?api_key=${API_KEY}&language=it-IT&vote_average.gte=${minRating}&vote_average.lte=${maxRating}&vote_count.gte=${minVoteCount}${genreParam}&primary_release_date.gte=${releaseYearFrom}-01-01&primary_release_date.lte=${releaseYearTo}-12-31`;

    // Fetch first page to get total pages count
    const response = await fetch(`${discoverUrl}&page=1`);
    const data = await response.json();

    // Throw error if no results found
    if (data.results.length === 0) {
        throw new Error('No results found with these filters');
    }

    // Return URL and limited total pages (max 500 to avoid excessive API calls)
    return {discoverUrl, totalPages: Math.min(data.total_pages, 500)};
}

/**
 * Fetches a specific page of media from the discovery API.
 * 
 * @param {string} discoverUrl - Base discovery URL
 * @param {number} page - Page number to fetch
 * @returns {Promise<Object>} Promise that resolves to the page data
 */
export async function fetchMediaPage(discoverUrl, page) {
    const response = await fetch(`${discoverUrl}&page=${page}`);
    return response.json();
}

/**
 * Fetches detailed information about a specific media item.
 * 
 * @param {boolean} mediaType - true for movies, false for TV shows
 * @param {number} mediaId - ID of the media item
 * @returns {Promise<Object>} Promise that resolves to detailed media information
 */
export async function fetchMediaDetails(mediaType, mediaId) {
    const mediaTypeParam = mediaType ? 'movie' : 'tv';
    const response = await fetch(`${API_ENDPOINTS.details(mediaTypeParam, mediaId)}?api_key=${API_KEY}&language=it-IT`);
    return response.json();
}

/**
 * Fetches videos/trailers for a specific media item.
 * Tries Italian first, falls back to English if no Italian videos are found.
 * 
 * @param {boolean} mediaType - true for movies, false for TV shows
 * @param {number} mediaId - ID of the media item
 * @returns {Promise<Object>} Promise that resolves to videos data
 */
export async function fetchMediaVideos(mediaType, mediaId) {
    const mediaTypeParam = mediaType ? 'movie' : 'tv';
    const response = await fetch(`${API_ENDPOINTS.videos(mediaTypeParam, mediaId)}?api_key=${API_KEY}&language=it-IT`);
    const data = await response.json();
    
    // If no Italian videos found, try with English
    if (!data.results || data.results.length === 0) {
        const responseEn = await fetch(`${API_ENDPOINTS.videos(mediaTypeParam, mediaId)}?api_key=${API_KEY}&language=en-US`);
        return responseEn.json();
    }
    
    return data;
}
