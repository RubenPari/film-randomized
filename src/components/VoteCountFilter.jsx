import React from 'react';

/**
 * Component for filtering media by minimum vote count
 * @param {Object} props - Component props
 * @param {number} props.minVoteCount - Minimum vote count value
 * @param {Function} props.setMinVoteCount - Function to update minimum vote count
 */
function VoteCountFilter({ minVoteCount, setMinVoteCount }) {
  const voteCountRanges = [
    { value: 0, label: 'Tutte' },
    { value: 1000, label: '1.000+' },
    { value: 10000, label: '10.000+' },
    { value: 100000, label: '100.000+' }
  ];

  return (
    <div>
      <label className="filter-label">
        Numero Minimo di Valutazioni
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
