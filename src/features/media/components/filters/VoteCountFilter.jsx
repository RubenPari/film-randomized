/**
 * Vote count filter component.
 * Allows users to filter media by minimum number of votes.
 */
import React from 'react';

/**
 * Component for filtering media by minimum vote count.
 * Provides preset ranges for common vote count thresholds.
 * 
 * @param {Object} props - Component props
 * @param {number} props.minVoteCount - Minimum vote count value
 * @param {Function} props.setMinVoteCount - Function to update minimum vote count
 * @returns {JSX.Element} Vote count filter component
 */
function VoteCountFilter({ minVoteCount, setMinVoteCount }) {
  const voteCountRanges = [
    { value: 0, label: 'All' },
    { value: 1000, label: '1,000+' },
    { value: 10000, label: '10,000+' },
    { value: 50000, label: '50,000+' },
    { value: 75000, label: '75,000+' }
  ];

  return (
    <div>
      <label className="filter-label">
        Minimum Number of Votes
      </label>
      <div className="flex flex-wrap gap-2">
        {voteCountRanges.map(function(range) {
          return (
            <button
              key={range.value}
              onClick={function() { setMinVoteCount(range.value); }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                minVoteCount === range.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {range.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VoteCountFilter;
