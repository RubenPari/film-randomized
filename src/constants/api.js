export const API_KEY = 'd8d1e982f6cd7a2fe927be7ba4c903f1';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const API_ENDPOINTS = {
    movieGenres: `${BASE_URL}/genre/movie/list`,
    tvGenres: `${BASE_URL}/genre/tv/list`,
    discover: (mediaTypes) => `${BASE_URL}/discover/${mediaTypes}`,
    details: (mediaType, id) => `${BASE_URL}/${mediaType}/${id}`
};
