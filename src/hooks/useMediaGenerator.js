import { useState, useEffect } from 'react';
import { fetchGenres, discoverMedia, fetchMediaPage, fetchMediaDetails } from '../services/tmdbApi.js';
import { filterValidMedia, hasValidDescription, getRandomPage, getRandomMedia } from '../utils/mediaUtils.js';

/**
 * Custom hook that manages the state and logic for generating random media
 * Handles API calls, filtering, and user interactions
 */
export function useMediaGenerator() {
    // State declarations
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

    /**
     * Load genres when the component mounts
     */
    useEffect(function() {
        const loadGenres = async function() {
            try {
                const genresData = await fetchGenres();
                setGenres(genresData);
                console.log('Ottenuti i generi');
            } catch (err) {
                setError('Errore nel caricamento dei generi');
                console.error(err);
            }
        };

        loadGenres().then(r => console.log(r));
    }, []);

    /**
     * Generate a random media item based on current filters
     * Makes API calls to TMDB and filters results
     */
    const generateRandomMedia = async function() {
        setIsLoading(true);
        setError(null);

        try {
            // Prepare filters for API request
            const filters = {
                minRating,
                maxRating,
                selectedGenres,
                releaseYearFrom,
                releaseYearTo
            };

            // Get discovery URL and total pages from TMDB API
            const { discoverUrl, totalPages } = await discoverMedia(mediaType, filters);

            // Select a random page to get varied results
            const randomPage = getRandomPage(totalPages);

            // Fetch media from the random page
            const pageData = await fetchMediaPage(discoverUrl, randomPage);

            // Filter out already viewed media and items without valid descriptions
            const filteredResults = filterValidMedia(pageData.results, viewedMedia);

            // If all results have been viewed, try again (with a reset if too many viewed)
            if (filteredResults.length === 0) {
                if (viewedMedia.length > 500) {
                    setViewedMedia([]);
                }
                setIsLoading(false);
                await generateRandomMedia();
                return;
            }

            // Select a random media item from filtered results
            const selectedMedia = getRandomMedia(filteredResults);

            // Fetch full details for the selected media
            const detailsData = await fetchMediaDetails(mediaType, selectedMedia.id);

            // Final check for valid description in Italian
            if (!hasValidDescription(detailsData)) {
                setIsLoading(false);
                await generateRandomMedia();
                return;
            }

            // Update state with the new media item
            setRandomMedia(detailsData);
            setViewedMedia(function(prev) { 
                return [...prev, detailsData]; 
            });
        } catch (err) {
            setError(err.message || 'Si è verificato un errore. Riprova più tardi.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Toggle genre selection (add or remove from selected genres)
     * @param {number} genreId - ID of the genre to toggle
     */
    const handleGenreToggle = function(genreId) {
        setSelectedGenres(function(prevSelected) {
            return prevSelected.includes(genreId)
                ? prevSelected.filter(function(id) { 
                    return id !== genreId; 
                })
                : [...prevSelected, genreId];
        });
    };

    // Return all state values and functions for use in components
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
