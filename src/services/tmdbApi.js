import {API_ENDPOINTS, API_KEY} from "../constants/api.js";

export const fetchGenres = async () => {
    try {
        const [movieGenresResponse, tvGenresResponse] = await Promise.all([
            fetch(`${API_ENDPOINTS.movieGenres}?api_key=${API_KEY}&language=it-IT`),
            fetch(`${API_ENDPOINTS.tvGenres}?api_key=${API_KEY}&language=it-IT`)
        ]);

        const [movieGenresData, tvGenresData] = await Promise.all([
            movieGenresResponse.json(),
            tvGenresResponse.json()
        ]);

        const allGenres = [...movieGenresData.genres, ...tvGenresData.genres];

        return Array.from(new Set(allGenres.map((g) => g.id))).map((id) => {
            return allGenres.find((g) => g.id === id);
        });
    } catch (error) {
        throw new Error("Impossibile recuperare i generi: " + error.message);
    }
};

export const discoverMedia = async (mediaType, filters) => {
    const {minRating, maxRating, selectedGenres, releaseYearFrom, releaseYearTo} = filters;

    const genreParam = selectedGenres.length > 0 ? `&with_genres=${selectedGenres.join(",")}` : "";
    const mediaTypeParam = mediaType ? 'movie' : 'tv';

    const discoverUrl = `${API_ENDPOINTS.discover(mediaTypeParam)}?api_key=${API_KEY}&language=it-IT&vote_average.gte=${minRating}&vote_average.lte=${maxRating}${genreParam}&primary_release_date.gte=${releaseYearFrom}-01-01&primary_release_date.lte=${releaseYearTo}-12-31`;

    const response = await fetch(`${discoverUrl}&page=1`);
    const data = await response.json();

    if (data.results.length === 0) {
        throw new Error('Nessun risultato trovato con questi filtri');
    }

    return {discoverUrl, totalPages: Math.min(data.total_pages, 500)};
};

export const fetchMediaPage = async (discoverUrl, page) => {
    const response = await fetch(`${discoverUrl}&page=${page}`);
    return response.json();
};

export const fetchMediaDetails = async (mediaType, mediaId) => {
    const mediaTypeParam = mediaType ? 'movie' : 'tv';
    const response = await fetch(`${API_ENDPOINTS.details(mediaTypeParam, mediaId)}?api_key=${API_KEY}&language=it-IT`);
    return response.json();
};