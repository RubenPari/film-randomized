/**
 * TMDB API Service
 * Handles all interactions with The Movie Database API
 */
import { API_KEY, API_ENDPOINTS } from '../constants/api.js';

/**
 * Discovers media based on provided filters.
 */
export const discoverMedia = async (mediaType, filters) => {
  const mediaTypeParam = mediaType ? 'movie' : 'tv';
  const endpoint = API_ENDPOINTS.discover(mediaTypeParam);
  const urlParams = new URLSearchParams();

  urlParams.append('api_key', API_KEY);
  urlParams.append('language', 'it-IT');
  urlParams.append('vote_average.gte', filters.minRating);
  urlParams.append('vote_average.lte', filters.maxRating);

  if (filters.selectedGenres && filters.selectedGenres.length > 0) {
    urlParams.append('with_genres', filters.selectedGenres.join(','));
  }

  if (filters.releaseYearFrom) {
    urlParams.append(mediaType ? 'primary_release_date.gte' : 'first_air_date.gte', `${filters.releaseYearFrom}-01-01`);
  }

  if (filters.releaseYearTo) {
    urlParams.append(mediaType ? 'primary_release_date.lte' : 'first_air_date.lte', `${filters.releaseYearTo}-12-31`);
  }

  if (filters.minVoteCount > 0) {
    urlParams.append('vote_count.gte', filters.minVoteCount);
  }

  const response = await fetch(`${endpoint}?${urlParams.toString()}`);
  const data = await response.json();

  if (data.results.length === 0) {
    throw new Error('No results found with these filters');
  }

  return {
    discoverUrl: `${endpoint}?${urlParams.toString()}`,
    totalPages: Math.min(data.total_pages, 500),
  };
};

/**
 * Fetches a specific page of media results.
 */
export const fetchMediaPage = async (discoverUrl, pageNumber) => {
  const response = await fetch(`${discoverUrl}&page=${pageNumber}`);
  return response.json();
};

/**
 * Fetches detailed information for a specific media item.
 */
export const fetchMediaDetails = async (mediaType, mediaId) => {
  const mediaTypeParam = mediaType ? 'movie' : 'tv';
  const endpoint = API_ENDPOINTS.details(mediaTypeParam, mediaId);
  const response = await fetch(`${endpoint}?api_key=${API_KEY}&language=it-IT`);
  return response.json();
};

/**
 * Fetches videos (trailers, teasers) for a specific media item.
 */
export const fetchMediaVideos = async (mediaType, mediaId) => {
  const mediaTypeParam = mediaType ? 'movie' : 'tv';
  const endpoint = API_ENDPOINTS.videos(mediaTypeParam, mediaId);
  const response = await fetch(`${endpoint}?api_key=${API_KEY}&language=it-IT`);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    const responseEn = await fetch(`${endpoint}?api_key=${API_KEY}&language=en-US`);
    return responseEn.json();
  }

  return data;
};

// Global cache for genres to avoid repetitive network requests across components
let cachedGenres = null;
let cachedGenresPromise = null;

/**
 * Fetches the list of all available genres.
 * Implements an aggressive in-memory caching mechanism to optimize repeated loads
 * (e.g., when toggling between movies and TV).
 */
export const fetchGenres = async () => {
  if (cachedGenres) return cachedGenres;
  
  if (!cachedGenresPromise) {
    cachedGenresPromise = (async () => {
      try {
        const [movieGenresResponse, tvGenresResponse] = await Promise.all([
          fetch(`${API_ENDPOINTS.movieGenres}?api_key=${API_KEY}&language=it-IT`),
          fetch(`${API_ENDPOINTS.tvGenres}?api_key=${API_KEY}&language=it-IT`)
        ]);

        const [movieData, tvData] = await Promise.all([
          movieGenresResponse.json(),
          tvGenresResponse.json()
        ]);

        const uniqueGenresMap = new Map();
        
        movieData.genres.forEach((genre) => {
          uniqueGenresMap.set(genre.id, genre);
        });

        tvData.genres.forEach((genre) => {
          if (!uniqueGenresMap.has(genre.id)) {
            uniqueGenresMap.set(genre.id, genre);
          }
        });

        cachedGenres = Array.from(uniqueGenresMap.values()).sort((a, b) => a.name.localeCompare(b.name));
        return cachedGenres;
      } catch (error) {
        cachedGenresPromise = null; // Reset promise on error so it can be retried
        throw error;
      }
    })();
  }
  
  return cachedGenresPromise;
};
