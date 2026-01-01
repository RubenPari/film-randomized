/**
 * Custom hook for managing media generation state and logic.
 * Handles API calls, filtering, and user interactions for random media generation.
 */
import { useState, useEffect } from 'react';
import {
  fetchGenres,
  discoverMedia,
  fetchMediaPage,
  fetchMediaDetails,
} from '../../../shared/services/tmdbApi.js';
import {
  filterValidMedia,
  hasValidDescription,
  getRandomPage,
  getRandomMedia,
} from '../../../shared/utils/mediaUtils.js';

/**
 * Maximum number of attempts to generate valid media before giving up.
 * @type {number}
 */
const MAX_GENERATION_ATTEMPTS = 5;

/**
 * Custom hook that manages the state and logic for generating random media.
 * Handles API calls, filtering, and user interactions.
 * 
 * @returns {Object} Object containing state values and action functions
 * @returns {boolean} returns.mediaType - Current media type (true = movie, false = TV show)
 * @returns {number} returns.minRating - Minimum rating filter
 * @returns {number} returns.maxRating - Maximum rating filter
 * @returns {number} returns.releaseYearFrom - Start year filter
 * @returns {number} returns.releaseYearTo - End year filter
 * @returns {number} returns.minVoteCount - Minimum vote count filter
 * @returns {Array<number>} returns.selectedGenres - Array of selected genre IDs
 * @returns {Array<Object>} returns.genres - Available genres list
 * @returns {Object|null} returns.randomMedia - Currently generated random media
 * @returns {boolean} returns.isLoading - Loading state
 * @returns {string|null} returns.error - Error message if any
 * @returns {Array<Object>} returns.viewedMedia - Array of previously viewed media
 * @returns {Function} returns.setMediaType - Function to set media type
 * @returns {Function} returns.setMinRating - Function to set minimum rating
 * @returns {Function} returns.setMaxRating - Function to set maximum rating
 * @returns {Function} returns.setReleaseYearFrom - Function to set start year
 * @returns {Function} returns.setReleaseYearTo - Function to set end year
 * @returns {Function} returns.setMinVoteCount - Function to set minimum vote count
 * @returns {Function} returns.generateRandomMedia - Function to generate random media
 * @returns {Function} returns.handleGenreToggle - Function to toggle genre selection
 */
export function useMediaGenerator() {
  // State declarations
  const [mediaType, setMediaType] = useState(true); // true = movie, false = TV show
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);
  const [releaseYearFrom, setReleaseYearFrom] = useState(1900);
  const [releaseYearTo, setReleaseYearTo] = useState(new Date().getFullYear());
  const [minVoteCount, setMinVoteCount] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [randomMedia, setRandomMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewedMedia, setViewedMedia] = useState([]);

  /**
   * Load genres when the component mounts.
   */
  useEffect(function () {
    const loadGenres = async function () {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData);
      } catch (err) {
        setError('Error loading genres');
        console.error(err);
      }
    };

    loadGenres();
  }, []);

  /**
   * Generates a random media item based on current filters.
   * Makes API calls to TMDB and filters results.
   * 
   * @returns {Promise<void>} Promise that resolves when media is generated
   */
  const generateRandomMedia = async function () {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare filters for API request
      const filters = {
        minRating,
        maxRating,
        selectedGenres,
        releaseYearFrom,
        releaseYearTo,
        minVoteCount,
      };

      // Get discovery URL and total pages from TMDB API
      const { discoverUrl, totalPages } = await discoverMedia(mediaType, filters);

      /**
       * Recursive function to attempt media generation.
       * 
       * @param {number} attempt - Current attempt number
       * @returns {Promise<void>} Promise that resolves when valid media is found
       */
      const attemptGenerate = async function (attempt) {
        if (attempt >= MAX_GENERATION_ATTEMPTS) {
          throw new Error('No content found. Try modifying the filters.');
        }

        // Select a random page to get varied results
        const randomPage = getRandomPage(totalPages);

        // Fetch media from the random page
        const pageData = await fetchMediaPage(discoverUrl, randomPage);

        // Filter out already viewed media and items without valid descriptions
        const filteredResults = filterValidMedia(pageData.results, viewedMedia);

        // If all results have been viewed, try again (with a reset if too many viewed)
        if (filteredResults.length === 0) {
          if (viewedMedia.length > 500) {
            setViewedMedia([]);
          }
          return attemptGenerate(attempt + 1);
        }

        // Select a random media item from filtered results
        const selectedMedia = getRandomMedia(filteredResults);

        // Fetch full details for the selected media
        const detailsData = await fetchMediaDetails(mediaType, selectedMedia.id);

        // Final check for valid description in Italian
        if (!hasValidDescription(detailsData)) {
          return attemptGenerate(attempt + 1);
        }

        // Update state with the new media item
        setRandomMedia(detailsData);
        setViewedMedia(function (prev) {
          return [...prev, detailsData];
        });
      };

      await attemptGenerate(0);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggles genre selection (add or remove from selected genres).
   * 
   * @param {number} genreId - ID of the genre to toggle
   */
  const handleGenreToggle = function (genreId) {
    setSelectedGenres(function (prevSelected) {
      return prevSelected.includes(genreId)
        ? prevSelected.filter(function (id) {
            return id !== genreId;
          })
        : [...prevSelected, genreId];
    });
  };

  // Return all state values and functions for use in components
  return {
    // State
    mediaType,
    minRating,
    maxRating,
    releaseYearFrom,
    releaseYearTo,
    minVoteCount,
    selectedGenres,
    genres,
    randomMedia,
    isLoading,
    error,
    viewedMedia,
    // Actions
    setMediaType,
    setMinRating,
    setMaxRating,
    setReleaseYearFrom,
    setReleaseYearTo,
    setMinVoteCount,
    generateRandomMedia,
    handleGenreToggle,
  };
}
