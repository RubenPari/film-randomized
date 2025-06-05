import { useState, useEffect } from 'react';
import { fetchGenres, discoverMedia, fetchMediaPage, fetchMediaDetails } from '../services/tmdbApi.js';
import { filterValidMedia, hasValidDescription, getRandomPage, getRandomMedia } from '../utils/mediaUtils.js';

export const useMediaGenerator = () => {
    const [mediaType, setMediaType] = useState(true); // true = film, false = serie TV
    const [minRating, setMinRating] = useState(0);
    const [maxRating, setMaxRating] = useState(10);
    const [releaseYearFrom, setReleaseYearFrom] = useState(1900);
    const [releaseYearTo, setReleaseYearTo] = useState(new Date().getFullYear());
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [genres, setGenres] = useState([]);
    const [randomMedia, setRandomMedia] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [viewedMedia, setViewedMedia] = useState([]);

    // Carica i generi quando il componente viene montato
    useEffect(() => {
        const loadGenres = async () => {
            try {
                const genresData = await fetchGenres();
                setGenres(genresData);
                console.log('Ottenuti i generi');
            } catch (err) {
                setError('Errore nel caricamento dei generi');
                console.error(err);
            }
        };

        loadGenres();
    }, []);

    // Genera un film o serie TV casuale in base ai filtri
    const generateRandomMedia = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const filters = {
                minRating,
                maxRating,
                selectedGenres,
                releaseYearFrom,
                releaseYearTo
            };

            const { discoverUrl, totalPages } = await discoverMedia(mediaType, filters);

            // Scegli una pagina casuale
            const randomPage = getRandomPage(totalPages);

            // Ottieni i media dalla pagina casuale
            const pageData = await fetchMediaPage(discoverUrl, randomPage);

            // Filtra i media che non sono già stati visualizzati
            const filteredResults = filterValidMedia(pageData.results, viewedMedia);

            if (filteredResults.length === 0) {
                // Se tutti i risultati sono già stati visti, riprova
                if (viewedMedia.length > 500) {
                    setViewedMedia([]);
                }
                setIsLoading(false);
                await generateRandomMedia();
                return;
            }

            // Seleziona un media casuale dai risultati filtrati
            const selectedMedia = getRandomMedia(filteredResults);

            // Ottieni i dettagli completi del media selezionato
            const detailsData = await fetchMediaDetails(mediaType, selectedMedia.id);

            // Verifica finale che il contenuto abbia una descrizione in italiano
            if (!hasValidDescription(detailsData)) {
                setIsLoading(false);
                await generateRandomMedia();
                return;
            }

            setRandomMedia(detailsData);
            setViewedMedia((prev) => [...prev, detailsData]);
        } catch (err) {
            setError(err.message || 'Si è verificato un errore. Riprova più tardi.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Gestisce il toggle dei generi selezionati
    const handleGenreToggle = (genreId) => {
        setSelectedGenres((prevSelected) =>
            prevSelected.includes(genreId)
                ? prevSelected.filter((id) => id !== genreId)
                : [...prevSelected, genreId]
        );
    };

    return {
        // State
        mediaType,
        minRating,
        maxRating,
        releaseYearFrom,
        releaseYearTo,
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
        generateRandomMedia,
        handleGenreToggle
    };
};
