export const filterValidMedia = (results, viewedMedia) => {
    return results.filter(
        (media) =>
            !viewedMedia.some((viewed) => viewed.id === media.id) &&
            media.overview &&
            media.overview.trim() !== '' &&
            media.overview !== 'Nessuna descrizione disponibile in italiano.'
    );
};

export const hasValidDescription = (media) => {
    return media.overview &&
        media.overview.trim() !== '' &&
        media.overview !== 'Nessuna descrizione disponibile in italiano.';
};

export const getRandomPage = (totalPages) => {
    return Math.floor(Math.random() * totalPages) + 1;
};

export const getRandomMedia = (mediaArray) => {
    const randomIndex = Math.floor(Math.random() * mediaArray.length);
    return mediaArray[randomIndex];
};