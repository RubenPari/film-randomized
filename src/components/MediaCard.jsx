import React from 'react';
import { IMAGE_BASE_URL } from '../constants/api.js';

const MediaCard = ({ media, mediaType }) => {
  const title = media.title || media.name;
  const releaseDate = media.release_date || media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <div className="mt-8 border rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Poster */}
        <div className="md:w-1/3">
          {media.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${media.poster_path}`}
              alt={title}
              className="w-full h-auto"
            />
          ) : (
            <div className="bg-gray-200 h-full flex items-center justify-center">
              <span className="text-gray-500">Nessuna immagine disponibile</span>
            </div>
          )}
        </div>

        {/* Informazioni */}
        <div className="md:w-2/3 p-4">
          <h2 className="text-xl font-bold mb-2">
            {title}
            {year && <span className="text-gray-600 font-normal ml-2">({year})</span>}
          </h2>

          <div className="flex items-center mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded mr-2">
              Voto: {media.vote_average.toFixed(1)}/10
            </span>

            {media.genres && media.genres.length > 0 && (
              <span className="text-gray-600">{media.genres.map((g) => g.name).join(', ')}</span>
            )}
          </div>

          <p className="text-gray-700 mb-4">
            {media.overview || 'Nessuna descrizione disponibile in italiano.'}
          </p>

          {/* Dettagli aggiuntivi */}
          {mediaType ? (
            <div className="text-sm text-gray-600">
              <p>Durata: {media.runtime ? `${media.runtime} min` : 'N/D'}</p>
              <p>
                Produzione: {media.production_companies?.map((p) => p.name).join(', ') || 'N/D'}
              </p>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              <p>Stagioni: {media.number_of_seasons || 'N/D'}</p>
              <p>Episodi: {media.number_of_episodes || 'N/D'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
