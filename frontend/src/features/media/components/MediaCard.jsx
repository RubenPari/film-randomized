import React, { useState, useEffect } from 'react';
import { IMAGE_BASE_URL } from '../../../shared/constants/api.js';
import { fetchMediaVideos } from '../../../shared/services/tmdbApi.js';
import SaveButtons from './SaveButtons.jsx';

/**
 * Component for displaying detailed information about a media item
 * @param {Object} props - Component props
 * @param {Object} props.media - Media object with details to display
 * @param {boolean} props.mediaType - Type of media (true for movie, false for TV)
 */
function MediaCard({ media, mediaType }) {
  // Extract title based on media type (movie or TV show)
  const title = media.title || media.name;

  // Extract release date and year
  const releaseDate = media.release_date || media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  // State for trailer video
  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);

  // State for description expansion
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  const hasLongOverview = Boolean(media.overview && media.overview.length > 280);

  // Fetch trailer when component mounts or media changes
  useEffect(
    function () {
      const loadTrailer = async function () {
        try {
          const videosData = await fetchMediaVideos(mediaType, media.id);
          // Find the first YouTube trailer
          const trailer = videosData.results?.find(function (video) {
            return (
              video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
            );
          });
          if (trailer) {
            setTrailerKey(trailer.key);
          } else {
            setTrailerKey(null);
            setIsTrailerVisible(false);
          }
        } catch (error) {
          console.error('Errore nel caricamento del trailer:', error);
          setTrailerKey(null);
          setIsTrailerVisible(false);
        }
      };

      loadTrailer();
    },
    [media.id, mediaType]
  );

  return (
    <div className="media-card">
      <div className="flex flex-col md:flex-row">
        {/* Poster section */}
        <div className="md:w-2/5">
          {media.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${media.poster_path}`}
              alt={title}
              className="media-poster"
            />
          ) : (
            // Display placeholder when no poster is available
            <div className="bg-gray-800 h-full flex items-center justify-center p-8">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="mt-2 text-gray-500">Nessuna immagine disponibile</span>
              </div>
            </div>
          )}
        </div>

        {/* Information section */}
        <div className="md:w-3/5 p-6">
          <h2 className="media-title">
            {title}
            {year && <span className="ml-2 text-gray-400 font-normal">({year})</span>}
          </h2>

          {/* Rating and genres display */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rating-badge">Voto: {media.vote_average.toFixed(1)}/10</span>
            <span className="inline-block bg-gray-800 text-gray-200 text-sm font-medium px-3 py-1 rounded-full border border-gray-700">
              {media.vote_count.toLocaleString('it-IT')} voti
            </span>

            {media.genres && media.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                {media.genres.map(function (g) {
                  return (
                    <span
                      key={g.id}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {g.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Overview/description */}
          <div className="mb-6">
            <p
              className={
                'text-gray-300 leading-relaxed ' +
                (!isOverviewExpanded && hasLongOverview ? 'overview-clamped' : '')
              }
            >
              {media.overview || 'Nessuna descrizione disponibile in italiano.'}
            </p>
            {hasLongOverview && (
              <button
                type="button"
                onClick={function () {
                  setIsOverviewExpanded(function (prev) {
                    return !prev;
                  });
                }}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                {isOverviewExpanded ? 'Mostra meno' : 'Mostra di più'}
              </button>
            )}
          </div>

          {/* Trailer video player */}
          {trailerKey && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-white">Trailer</h3>
              {!isTrailerVisible ? (
                <button
                  type="button"
                  onClick={function () {
                    setIsTrailerVisible(true);
                  }}
                  className="btn-secondary bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700"
                >
                  Guarda il trailer
                </button>
              ) : (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title={`Trailer di ${title}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          )}

          {/* Additional details based on media type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediaType ? (
              // Movie-specific details
              <>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm">Durata</div>
                  <div className="text-lg font-semibold">
                    {media.runtime ? `${media.runtime} min` : 'N/D'}
                  </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm">Produzione</div>
                  <div className="text-lg font-semibold truncate">
                    {media.production_companies?.length > 0
                      ? media.production_companies[0].name
                      : 'N/D'}
                  </div>
                </div>
              </>
            ) : (
              // TV show-specific details
              <>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm">Stagioni</div>
                  <div className="text-lg font-semibold">{media.number_of_seasons || 'N/D'}</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm">Episodi</div>
                  <div className="text-lg font-semibold">{media.number_of_episodes || 'N/D'}</div>
                </div>
              </>
            )}
          </div>

          {/* Save buttons */}
          <SaveButtons media={media} mediaType={mediaType} />
        </div>
      </div>
    </div>
  );
}

export default MediaCard;
