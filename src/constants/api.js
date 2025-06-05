export const API_KEY = import.meta.env.VITE_API_KEY;
export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

export const API_ENDPOINTS = {
    movieGenres: `${BASE_URL}/genre/movie/list`,
    tvGenres: `${BASE_URL}/genre/tv/list`,
    discover: (mediaTypes) => `${BASE_URL}/discover/${mediaTypes}`,
    details: (mediaType, id) => `${BASE_URL}/${mediaType}/${id}`
};
