import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [mediaType, setMediaType] = useState(true); // true = film, false = serie TV
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);
  const [minVoteCount, setMinVoteCount] = useState(0); // Nuovo stato per il numero minimo di valutazioni
  const [releaseYearFrom, setReleaseYearFrom] = useState(1900);
  const [releaseYearTo, setReleaseYearTo] = useState(new Date().getFullYear());
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [randomMedia, setRandomMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewedMedia, setViewedMedia] = useState([]);

  const API_KEY = 'd8d1e982f6cd7a2fe927be7ba4c903f1';
  const BASE_URL = 'https://api.themoviedb.org/3';

  // Carica i generi quando il componente viene montato
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const movieGenresResponse = await fetch(
          `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=it-IT`
        );
        const tvGenresResponse = await fetch(
          `${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=it-IT`
        );

        const movieGenresData = await movieGenresResponse.json();
        const tvGenresData = await tvGenresResponse.json();

        // Combina i generi unici da film e serie TV
        const allGenres = [...movieGenresData.genres, ...tvGenresData.genres];
        const uniqueGenres = Array.from(new Set(allGenres.map((g) => g.id))).map((id) => {
          return allGenres.find((g) => g.id === id);
        });

        setGenres(uniqueGenres);
      } catch (err) {
        setError('Errore nel caricamento dei generi');
        console.error(err);
      }
    };

    fetchGenres().then(() => console.log('Ottenuti i generi'));
  }, []);

  // Genera un film o serie TV casuale in base ai filtri
  async function generateRandomMedia() {
    setIsLoading(true);
    setError(null);

    try {
      const mediaTypeStr = mediaType ? 'movie' : 'tv';
      const genreParam =
        selectedGenres.length > 0 ? `&with_genres=${selectedGenres.join(',')}` : '';

      // Ottieni il numero totale di pagine per la ricerca
      // Aggiungiamo with_original_language=it per prioritizzare contenuti italiani
      const discoverUrl = `${BASE_URL}/discover/${mediaTypeStr}?api_key=${API_KEY}&language=it-IT&vote_average.gte=${minRating}&vote_average.lte=${maxRating}&vote_count.gte=${minVoteCount}${genreParam}&primary_release_date.gte=${releaseYearFrom}-01-01&primary_release_date.lte=${releaseYearTo}-12-31`;

      const response = await fetch(`${discoverUrl}&page=1`);
      const data = await response.json();

      if (data.total_results === 0) {
        setError('Nessun risultato trovato con questi filtri');
        setIsLoading(false);
        return;
      }

      // Scegli una pagina casuale (TMDB limita a 1000 pagine max)
      const totalPages = Math.min(data.total_pages, 500);
      const randomPage = Math.floor(Math.random() * totalPages) + 1;

      // Ottieni i media dalla pagina casuale
      const pageResponse = await fetch(`${discoverUrl}&page=${randomPage}`);
      const pageData = await pageResponse.json();

      // Filtra i media che non sono già stati visualizzati
      // E aggiungiamo un filtro per contenuti con overview in italiano
      const filteredResults = pageData.results.filter(
        (media) =>
          !viewedMedia.some((viewed) => viewed.id === media.id) &&
          media.overview &&
          media.overview.trim() !== '' &&
          media.overview !== 'Nessuna descrizione disponibile in italiano.'
      );

      if (filteredResults.length === 0) {
        // Se tutti i risultati in questa pagina sono già stati visti o non hanno descrizione italiana, riprova
        if (viewedMedia.length > 500) {
          // Reset della cronologia se abbiamo visto troppi media
          setViewedMedia([]);
        }
        setIsLoading(false);
        await generateRandomMedia();
        return;
      }

      // Seleziona un media casuale dai risultati filtrati
      const randomIndex = Math.floor(Math.random() * filteredResults.length);
      const selectedMedia = filteredResults[randomIndex];

      // Ottieni i dettagli completi del media selezionato
      const detailsResponse = await fetch(
        `${BASE_URL}/${mediaTypeStr}/${selectedMedia.id}?api_key=${API_KEY}&language=it-IT`
      );
      const detailsData = await detailsResponse.json();

      // Verifica finale che il contenuto abbia una descrizione in italiano
      if (
        !detailsData.overview ||
        detailsData.overview.trim() === '' ||
        detailsData.overview === 'Nessuna descrizione disponibile in italiano.'
      ) {
        // Se non ha descrizione, riprova con un altro media
        setIsLoading(false);
        await generateRandomMedia();
        return;
      }

      setRandomMedia(detailsData);
      setViewedMedia((prevViewedMedia) => [...prevViewedMedia, detailsData]);
    } catch (err) {
      setError('Si è verificato un errore. Riprova più tardi.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  // Gestisce il toggle dei generi selezionati
  function handleGenreToggle(genreId) {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genreId)
        ? prevSelected.filter((id) => id !== genreId)
        : [...prevSelected, genreId]
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Generatore Random di {mediaType ? 'Film' : 'Serie TV'}
        </h1>

        {/* Selezione del tipo di media */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Tipo di Media</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setMediaType(true)}
              className={`px-4 py-2 rounded ${mediaType ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Film
            </button>
            <button
              onClick={() => setMediaType(false)}
              className={`px-4 py-2 rounded ${!mediaType ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Serie TV
            </button>
          </div>
        </div>

        {/* Filtro per voto */}
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

        {/* Filtro per numero minimo di valutazioni */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Numero minimo di valutazioni</h2>
          <div className="flex items-center">
            <select
              value={minVoteCount}
              onChange={(e) => setMinVoteCount(parseInt(e.target.value))}
              className="border rounded px-3 py-2 w-32"
            >
              <option value="0">0 (nessun limite)</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
              <option value="2500">2500</option>
              <option value="5000">5000</option>
              <option value="10000">10000</option>
            </select>
            <span className="ml-2 text-sm text-gray-600">
              (valori più alti = film/serie più popolari)
            </span>
          </div>
        </div>

        {/* Filtro per anno di uscita */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Anno di Uscita</h2>
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm mb-1">Da:</label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
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
                max={new Date().getFullYear()}
                value={releaseYearTo}
                onChange={(e) => setReleaseYearTo(parseInt(e.target.value))}
                className="border rounded px-3 py-2 w-24"
              />
            </div>
          </div>
        </div>

        {/* Filtro per generi */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Generi</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {genres.map((genre) => (
              <label key={genre.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleGenreToggle(genre.id)}
                  className="mr-2"
                />
                {genre.name}
              </label>
            ))}
          </div>
        </div>

        {/* Bottone per generare */}
        <div className="mt-6 text-center">
          <button
            onClick={generateRandomMedia}
            disabled={isLoading}
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Caricamento...' : 'Genera Casualmente'}
          </button>
        </div>

        {/* Messaggio di errore */}
        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        {/* Card del risultato */}
        {randomMedia && !isLoading && (
          <div className="mt-8 border rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Poster */}
              <div className="md:w-1/3">
                {randomMedia.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${randomMedia.poster_path}`}
                    alt={randomMedia.title || randomMedia.name}
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
                  {randomMedia.title || randomMedia.name}
                  {randomMedia.release_date && (
                    <span className="text-gray-600 font-normal ml-2">
                      ({new Date(randomMedia.release_date).getFullYear()})
                    </span>
                  )}
                  {randomMedia.first_air_date && (
                    <span className="text-gray-600 font-normal ml-2">
                      ({new Date(randomMedia.first_air_date).getFullYear()})
                    </span>
                  )}
                </h2>

                <div className="flex items-center mb-3">
                  <span className="inline-block bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded mr-2">
                    Voto: {randomMedia.vote_average.toFixed(1)}/10
                  </span>

                  <span className="inline-block bg-green-100 text-green-800 font-semibold px-2 py-1 rounded mr-2">
                    Valutazioni: {randomMedia.vote_count}
                  </span>

                  {randomMedia.genres && randomMedia.genres.length > 0 && (
                    <span className="text-gray-600">
                      {randomMedia.genres.map((g) => g.name).join(', ')}
                    </span>
                  )}
                </div>

                <p className="text-gray-700 mb-4">
                  {randomMedia.overview || 'Nessuna descrizione disponibile in italiano.'}
                </p>

                {/* Dettagli aggiuntivi */}
                {mediaType ? (
                  <div className="text-sm text-gray-600">
                    <p>Durata: {randomMedia.runtime ? `${randomMedia.runtime} min` : 'N/D'}</p>
                    <p>
                      Produzione:{' '}
                      {randomMedia.production_companies?.map((p) => p.name).join(', ') || 'N/D'}
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    <p>Stagioni: {randomMedia.number_of_seasons || 'N/D'}</p>
                    <p>Episodi: {randomMedia.number_of_episodes || 'N/D'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contatore di media visti */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Media visualizzati in questa sessione: {viewedMedia.length}
        </div>
      </div>
    </div>
  );
}

export default App;
