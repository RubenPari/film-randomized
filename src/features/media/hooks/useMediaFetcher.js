import { useState } from 'react';
import {
  discoverMedia,
  fetchMediaPage,
  fetchMediaDetails,
} from '../../../shared/services/tmdbApi';
import {
  filterValidMedia,
  hasValidDescription,
  getRandomPage,
  getRandomMedia,
} from '../../../shared/utils/mediaUtils';

const MAX_GENERATION_ATTEMPTS = 5;

/**
 * Custom hook for media generation logic.
 */
export function useMediaFetcher() {
  const [randomMedia, setRandomMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewedMedia, setViewedMedia] = useState([]);

  /**
   * Generates a random media item based on filters.
   * @param {Object} filters - Filter configuration
   * @param {boolean} mediaType - true = movie, false = tv
   */
  const generateRandomMedia = async (filters, mediaType) => {
    setIsLoading(true);
    setError(null);

    try {
      const { discoverUrl, totalPages } = await discoverMedia(mediaType, filters);

      const attemptGenerate = async (attempt) => {
        if (attempt >= MAX_GENERATION_ATTEMPTS) {
          throw new Error('No content found. Try modifying the filters.');
        }

        const randomPage = getRandomPage(totalPages);
        const pageData = await fetchMediaPage(discoverUrl, randomPage);
        const filteredResults = filterValidMedia(pageData.results, viewedMedia);

        if (filteredResults.length === 0) {
          if (viewedMedia.length > 500) {
            setViewedMedia([]);
          }
          return attemptGenerate(attempt + 1);
        }

        const selectedMedia = getRandomMedia(filteredResults);
        const detailsData = await fetchMediaDetails(mediaType, selectedMedia.id);

        if (!hasValidDescription(detailsData)) {
          return attemptGenerate(attempt + 1);
        }

        setRandomMedia(detailsData);
        setViewedMedia((prev) => [...prev, detailsData]);
      };

      await attemptGenerate(0);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    randomMedia,
    isLoading,
    error,
    viewedMedia,
    generateRandomMedia,
  };
}
