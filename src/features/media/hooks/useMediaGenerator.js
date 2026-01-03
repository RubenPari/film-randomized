import { useMediaFilters } from './useMediaFilters';
import { useGenres } from './useGenres';
import { useMediaFetcher } from './useMediaFetcher';

/**
 * Custom hook for managing media generation state and logic.
 * Aggregates smaller hooks to provide a unified interface.
 */
export function useMediaGenerator() {
  const {
    mediaType, setMediaType,
    minRating, setMinRating,
    maxRating, setMaxRating,
    releaseYearFrom, setReleaseYearFrom,
    releaseYearTo, setReleaseYearTo,
    minVoteCount, setMinVoteCount,
    selectedGenres, handleGenreToggle,
  } = useMediaFilters();

  const { genres, error: genresError } = useGenres();
  
  const {
    randomMedia,
    isLoading,
    error: fetchError,
    viewedMedia,
    generateRandomMedia: fetchRandomMedia,
  } = useMediaFetcher();

  const generateRandomMedia = () => {
    const filters = {
      minRating,
      maxRating,
      selectedGenres,
      releaseYearFrom,
      releaseYearTo,
      minVoteCount,
    };
    fetchRandomMedia(filters, mediaType);
  };

  return {
    mediaType, setMediaType,
    minRating, setMinRating,
    maxRating, setMaxRating,
    releaseYearFrom, setReleaseYearFrom,
    releaseYearTo, setReleaseYearTo,
    minVoteCount, setMinVoteCount,
    selectedGenres, handleGenreToggle,
    genres,
    randomMedia,
    isLoading,
    error: fetchError || genresError,
    viewedMedia,
    generateRandomMedia,
  };
}
