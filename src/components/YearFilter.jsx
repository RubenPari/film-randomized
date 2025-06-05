import React from 'react';

const YearFilter = ({ releaseYearFrom, releaseYearTo, setReleaseYearFrom, setReleaseYearTo }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Anno di Uscita</h2>
      <div className="flex items-center space-x-4">
        <div>
          <label className="block text-sm mb-1">Da:</label>
          <input
            type="number"
            min="1900"
            max={currentYear}
            value={releaseYearFrom}
            onChange={(e) => setReleaseYearFrom(parseInt(e.target.value))}
            className="border rounded px-3 py-2 w-24"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">A:</label>
          <input
            type="number"
            min="1900"
            max={currentYear}
            value={releaseYearTo}
            onChange={(e) => setReleaseYearTo(parseInt(e.target.value))}
            className="border rounded px-3 py-2 w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default YearFilter;
