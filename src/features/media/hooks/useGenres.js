import { useState, useEffect } from 'react';
import { fetchGenres } from '../../../shared/services/tmdbApi';

/**
 * Custom hook for fetching and managing genres.
 * Implements a simple cache mechanism to avoid redundant network requests.
 * Uses the centralized cache logic from tmdbApi.js for efficient loading.
 */
export function useGenres() {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadGenres = async () => {
      try {
        const data = await fetchGenres(); // Uses optimized caching from API
        if (isMounted) {
          setGenres(data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch genres. Please try again later.');
          console.error(err);
        }
      }
    };

    loadGenres();

    return () => {
      isMounted = false;
    };
  }, []);

  return { genres, error };
}
