import React from 'react';

const RatingFilter = ({ minRating, maxRating, setMinRating, setMaxRating }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Voto (1-10)</h2>
      <div className="flex items-center space-x-4">
        <div>
          <label className="block text-sm mb-1">Min:</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="border rounded px-3 py-2 w-20"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Max:</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={maxRating}
            onChange={(e) => setMaxRating(parseFloat(e.target.value))}
            className="border rounded px-3 py-2 w-20"
          />
        </div>
      </div>
    </div>
  );
};

export default RatingFilter;
