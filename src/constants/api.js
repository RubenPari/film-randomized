// API configuration constants for The Movie Database (TMDb)

// API key for accessing TMDb API
export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Base URL for all API requests
export const BASE_URL = 'https://api.themoviedb.org/3';

// Base URL for image assets
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// API endpoint URLs
export const API_ENDPOINTS = {
    // Endpoint for movie genres
    movieGenres: `${BASE_URL}/genre/movie/list`,
    
    // Endpoint for TV show genres
    tvGenres: `${BASE_URL}/genre/tv/list`,
    
    // Endpoint for discovering media (movies or TV shows)
    discover: function(mediaTypes) { 
        return `${BASE_URL}/discover/${mediaTypes}`; 
    },
    
    // Endpoint for media details
    details: function(mediaType, id) { 
        return `${BASE_URL}/${mediaType}/${id}`; 
    },
    
    // Endpoint for media videos/trailers
    videos: function(mediaType, id) { 
        return `${BASE_URL}/${mediaType}/${id}/videos`; 
    }
};
