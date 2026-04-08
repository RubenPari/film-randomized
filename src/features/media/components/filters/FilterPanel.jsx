/**
 * Filter panel component.
 * Contains all filter controls for media generation.
 */
import React from 'react';
import MediaTypeSelector from './MediaTypeSelector.jsx';
import RatingFilter from './RatingFilter.jsx';
import YearFilter from './YearFilter.jsx';
import VoteCountFilter from './VoteCountFilter.jsx';
import GenreFilter from './GenreFilter.jsx';

/**
 * Filter panel component.
 * Displays all filter controls for media type, rating, year, vote count, and genres.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.mediaType - True for movies, false for TV shows
 * @param {Function} props.setMediaType - Function to set media type
 * @param {number} props.minRating - Minimum rating filter
 * @param {number} props.maxRating - Maximum rating filter
 * @param {Function} props.setMinRating - Function to set minimum rating
 * @param {Function} props.setMaxRating - Function to set maximum rating
 * @param {number|null} props.releaseYearFrom - Release year from filter
 * @param {number|null} props.releaseYearTo - Release year to filter
 * @param {Function} props.setReleaseYearFrom - Function to set release year from
 * @param {Function} props.setReleaseYearTo - Function to set release year to
 * @param {number} props.minVoteCount - Minimum vote count filter
 * @param {Function} props.setMinVoteCount - Function to set minimum vote count
 * @param {Array} props.genres - Available genres
 * @param {Array} props.selectedGenres - Selected genres
 * @param {Function} props.handleGenreToggle - Function to toggle genre selection
 * @returns {JSX.Element} Filter panel component
 */
function FilterPanel({
  mediaType,
  setMediaType,
  minRating,
  maxRating,
  setMinRating,
  setMaxRating,
  releaseYearFrom,
  releaseYearTo,
  setReleaseYearFrom,
  setReleaseYearTo,
  minVoteCount,
  setMinVoteCount,
  genres,
  selectedGenres,
  handleGenreToggle,
}) {
  return (
    <div className="space-y-6">
      <div className="filter-section">
        <MediaTypeSelector mediaType={mediaType} setMediaType={setMediaType} />
      </div>

      <div className="filter-section">
        <RatingFilter
          minRating={minRating}
          maxRating={maxRating}
          setMinRating={setMinRating}
          setMaxRating={setMaxRating}
        />
      </div>

      <div className="filter-section">
        <YearFilter
          releaseYearFrom={releaseYearFrom}
          releaseYearTo={releaseYearTo}
          setReleaseYearFrom={setReleaseYearFrom}
          setReleaseYearTo={setReleaseYearTo}
        />
      </div>

      <div className="filter-section">
        <VoteCountFilter minVoteCount={minVoteCount} setMinVoteCount={setMinVoteCount} />
      </div>

      <div className="filter-section">
        <GenreFilter
          genres={genres}
          selectedGenres={selectedGenres}
          handleGenreToggle={handleGenreToggle}
        />
      </div>
    </div>
  );
}

export default FilterPanel;
