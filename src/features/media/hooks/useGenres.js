import { useState, useEffect } from 'react';
import { fetchGenres } from '../../../shared/services/tmdbApi';

/**
 * Custom hook for fetching genres.
 */
export function useGenres() {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGenres = async () => {
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

  return { genres, error };
}
