# Backend API - Film Randomized

Backend FastAPI per gestire la watchlist di film e serie TV con database Neon PostgreSQL.

## Setup

### 1. Installazione dipendenze

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configurazione Database Neon

1. Crea un account su [Neon](https://neon.tech)
2. Crea un nuovo progetto
3. Copia la stringa di connessione PostgreSQL
4. Crea un file `.env` nella cartella `backend`:

```bash
DATABASE_URL=postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
```

### 3. Avvio del server

```bash
python main.py
```

Oppure con uvicorn direttamente:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Il server sarà disponibile su `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /` - Verifica che l'API sia attiva

### Watchlist

- `POST /api/watchlist` - Aggiungi un contenuto alla watchlist
  - Body: oggetto JSON con i dettagli del media (vedi schema `WatchlistItemCreate`)
  
- `GET /api/watchlist` - Ottieni tutti i contenuti della watchlist
  
- `GET /api/watchlist/{tmdb_id}` - Verifica se un contenuto è nella watchlist
  
- `DELETE /api/watchlist/{tmdb_id}` - Rimuovi un contenuto dalla watchlist

### Documentazione Interattiva

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Struttura del Database

La tabella `watchlist` contiene:
- `id` - ID auto-incrementale
- `tmdb_id` - ID del contenuto su TMDB (univoco)
- `media_type` - Tipo di media (true = film, false = serie TV)
- `title` - Titolo
- `original_title` - Titolo originale
- `overview` - Descrizione
- `poster_path` - Path del poster
- `backdrop_path` - Path del backdrop
- `vote_average` - Voto medio
- `vote_count` - Numero di voti
- `release_date` - Data di rilascio
- `genres` - Generi (JSON string)
- `runtime` - Durata (solo film)
- `number_of_seasons` - Numero di stagioni (solo serie TV)
- `number_of_episodes` - Numero di episodi (solo serie TV)
- `created_at` - Data di creazione

## Note

- Il database viene creato automaticamente all'avvio dell'applicazione
- CORS è configurato per accettare richieste da `localhost:5173` (Vite) e `localhost:3000`
