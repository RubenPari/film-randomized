import React from 'react';

/**
 * Component for filtering media by release year range
 * @param {Object} props - Component props
 * @param {number} props.releaseYearFrom - Start year for filtering
 * @param {number} props.releaseYearTo - End year for filtering
 * @param {Function} props.setReleaseYearFrom - Function to update start year
 * @param {Function} props.setReleaseYearTo - Function to update end year
 */
function YearFilter({ releaseYearFrom, releaseYearTo, setReleaseYearFrom, setReleaseYearTo }) {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <h2 className="filter-title">Anno di Uscita</h2>
      <p className="text-sm text-gray-400 mb-3">
        Scegli un intervallo di anni per limitare la ricerca.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-gray-300">Da</label>
          <input
            type="number"
            min="1900"
            max={currentYear}
            value={releaseYearFrom}
            onChange={function(e) { setReleaseYearFrom(parseInt(e.target.value)); }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-300">A</label>
          <input
            type="number"
            min="1900"
            max={currentYear}
            value={releaseYearTo}
            onChange={function(e) { setReleaseYearTo(parseInt(e.target.value)); }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mt-2 flex justify-between text-sm text-gray-400">
        <span>1900</span>
        <span>{releaseYearFrom} - {releaseYearTo}</span>
        <span>{currentYear}</span>
      </div>
    </div>
  );
}

export default YearFilter;
