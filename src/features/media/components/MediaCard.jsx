/**
 * Media card component.
 * Displays detailed information about a media item including poster, title, description, and trailer.
 */
import React, { useState, useEffect } from 'react';
import { IMAGE_BASE_URL } from '../../../shared/constants/api.js';
import { fetchMediaVideos } from '../../../shared/services/tmdbApi.js';
import SaveButtons from './SaveButtons.jsx';

/**
 * Component for displaying detailed information about a media item.
 * Shows poster, title, description, rating, genres, and optional trailer video.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.media - Media object with details to display
 * @param {number} props.media.id - TMDB ID of the media
 * @param {string} props.media.title - Title (for movies)
 * @param {string} props.media.name - Title (for TV shows)
 * @param {string} props.media.overview - Description/overview
 * @param {string} props.media.poster_path - Poster image path
 * @param {number} props.media.vote_average - Average vote rating
 * @param {Array<Object>} props.media.genres - Array of genre objects
 * @param {boolean} props.mediaType - Type of media (true for movie, false for TV show)
 * @returns {JSX.Element} Media card component
 */
function MediaCard({ media, mediaType }) {
  // Extract title based on media type (movie or TV show)
  const title = media.title || media.name;

  // Extract release date and year
  const releaseDate = media.release_date || media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  // State for trailer video
  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerCollapsed, setIsTrailerCollapsed] = useState(false);

  // State for description expansion
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  const hasLongOverview = Boolean(media.overview && media.overview.length > 280);

  /**
   * Fetches trailer video when component mounts or media changes.
   */
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
          }
        } catch (error) {
          console.error('Error loading trailer:', error);
          setTrailerKey(null);
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
                <span className="mt-2 text-gray-500">No image available</span>
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
            <span className="rating-badge">Rating: {media.vote_average.toFixed(1)}/10</span>
            {media.genres && media.genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {media.genres.slice(0, 3).map(function (genre) {
                  return (
                    <span key={genre.id} className="genre-badge">
                      {genre.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Description with expand/collapse */}
          {media.overview && (
            <div className="mb-4">
              <p className="text-gray-300 leading-relaxed">
                {isOverviewExpanded || !hasLongOverview
                  ? media.overview
                  : `${media.overview.substring(0, 280)}...`}
              </p>
              {hasLongOverview && (
                <button
                  onClick={function () {
                    setIsOverviewExpanded(function (prev) {
                      return !prev;
                    });
                  }}
                  className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  {isOverviewExpanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          )}

          {/* Trailer section */}
          {trailerKey && (
            <div className="mb-4">
              <button
                onClick={function () {
                  setIsTrailerCollapsed(function (prev) {
                    return !prev;
                  });
                }}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium mb-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                {isTrailerCollapsed ? 'Show Trailer' : 'Hide Trailer'}
              </button>
              {!isTrailerCollapsed && (
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title="Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              )}
            </div>
          )}

          {/* Save buttons */}
          <SaveButtons media={media} mediaType={mediaType} />
        </div>
      </div>
    </div>
  );
}

export default MediaCard;
