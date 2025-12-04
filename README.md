# 🎬 Film Randomized - Generatore Random di Film e Serie TV

Un'applicazione web moderna che ti aiuta a scoprire film e serie TV casuali in base ai tuoi gusti personali. Utilizza l'API di The Movie Database (TMDb) per fornire raccomandazioni personalizzate.

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?style=flat&logo=tailwindcss)

## ✨ Caratteristiche

### 🎯 Funzionalità Principali

- **Generazione Casuale Intelligente**: Scopri film e serie TV casuali con un algoritmo che evita ripetizioni
- **Filtri Avanzati**: Filtra per genere, valutazione (0-10), e anno di uscita
- **Doppia Modalità**: Passa facilmente tra film e serie TV
- **Interfaccia Italiana**: Tutte le descrizioni e i contenuti sono in italiano
- **Design Moderno**: Interfaccia pulita e responsive con TailwindCSS

## 🚀 Quick Start

### Prerequisiti

- **Node.js**: versione 18.0.0 o superiore
- **npm**: versione 9.0.0 o superiore

### Installazione

1. **Clona il repository**

```bash
git clone <repository-url>
cd film-randomized
```

2. **Installa le dipendenze**

```bash
npm install
```

3. **Avvia il server di sviluppo**

```bash
npm run dev
```

4. **Apri il browser**

```
http://localhost:5173
```

## 🐳 Docker Compose (Full Stack)

### Prerequisiti

- **Docker** installato e in esecuzione
- **Docker Compose v2** (integrato in Docker Desktop recente)

### Configurazione variabili d'ambiente

Nella root del progetto crea un file `.env` (non viene committato) con almeno la chiave TMDb per il frontend:

```env
VITE_TMDB_API_KEY=la_tua_chiave_tmdb
```

> Nota: nello stack Docker Compose il backend usa automaticamente un database PostgreSQL in container (servizio `db`), **non** Neon. La stringa di connessione è già configurata nel `docker-compose.yml`.

### Avvio dello stack completo

Dalla root del progetto (`film-randomized/`):

```bash
docker compose up --build
```

Questo comando:

- avvia PostgreSQL (`db`)
- avvia il backend FastAPI (`backend`)
- builda e avvia il frontend React/Vite (`frontend`)
- avvia Nginx come reverse proxy (`proxy`)

### URL di accesso

- Applicazione web: `http://localhost`
- API backend dirette: `http://localhost:8000`
- Documentazione API (Swagger): `http://localhost:8000/docs`

Per fermare tutto:

```bash
docker compose down
```

## 📋 Comandi Disponibili

### Sviluppo

```bash
npm run dev          # Avvia il server di sviluppo (http://localhost:5173)
npm run build        # Crea la build di produzione
npm run preview      # Anteprima della build di produzione
```

### Qualità del Codice

```bash
npm run lint         # Esegue ESLint su tutti i file
npm run format       # Formatta il codice con Prettier
npm run format:check # Verifica la formattazione senza modificare
```

## 🏗️ Architettura

### Stack Tecnologico

#### Frontend

- **React 19.0.0**: Framework UI con le ultime funzionalità
- **Vite 6.2.0**: Build tool ultra-veloce con HMR
- **TailwindCSS 3.4.17**: Framework CSS utility-first
- **ESLint 9.21.0**: Linting con regole per React Hooks e React Refresh
- **Prettier 3.5.3**: Formattazione automatica del codice

#### APIs

- **TMDb API**: Database di film e serie TV

### Struttura del Progetto

```
film-randomized/
├── src/
│   ├── components/           # Componenti React UI
│   │   ├── GenreFilter.jsx   # Filtro per generi
│   │   ├── MediaCard.jsx     # Card per visualizzare film/serie
│   │   ├── MediaTypeSelector.jsx  # Selettore film/serie
│   │   ├── RatingFilter.jsx  # Filtro per valutazione
│   │   └── YearFilter.jsx    # Filtro per anno di uscita
│   │
│   ├── hooks/
│   │   └── useMediaGenerator.js  # Hook principale per generazione media
│   │
│   ├── services/
│   │   └── tmdbApi.js        # API TMDb per film/serie
│   │
│   ├── utils/
│   │   └── mediaUtils.js     # Utility per filtri e validazione media
│   │
│   ├── constants/
│   │   └── api.js            # Costanti API (chiave TMDb, endpoints)
│   │
│   ├── App.jsx               # Componente principale
│   ├── main.jsx              # Entry point dell'app
│   ├── App.css               # Stili globali
│   └── index.css             # Stili base e Tailwind
│
├── public/                   # Asset statici
├── index.html                # HTML principale
├── vite.config.js            # Configurazione Vite
├── eslint.config.js          # Configurazione ESLint
├── tailwind.config.js        # Configurazione TailwindCSS
├── postcss.config.js         # Configurazione PostCSS
├── .prettierrc               # Configurazione Prettier
├── package.json              # Dipendenze e script
└── README.md                 # Questo file
```

### Flusso di Dati

```
Filtri → useMediaGenerator → tmdbApi.discoverMedia()
                                              ↓
                    Selezione pagina casuale + fetchMediaDetails()
                                              ↓
                    Validazione descrizione italiana + controllo duplicati
                                              ↓
                              Display MediaCard
```

### Pattern Architetturali

#### 1. Custom Hook Pattern

`useMediaGenerator` incapsula tutta la logica di generazione media, inclusi:

- Gestione stato filtri
- Chiamate API TMDb
- Tracking media visualizzati
- Algoritmo di randomizzazione

#### 2. Service Layer

I servizi API sono isolati nel modulo `tmdbApi.js` che gestisce tutte le interazioni con The Movie Database.

#### 3. Component Composition

Componenti piccoli e riutilizzabili per filtri e UI elements, garantendo manutenibilità e riusabilità del codice.

## 🔧 Configurazione

### TMDb API Key

Attenzione: **non inserire mai la tua API key TMDb direttamente nel codice sorgente** e non committarla nel repository.

In questo progetto la chiave è letta tramite variabile d'ambiente in `frontend/src/shared/constants/api.js`:

```javascript
export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
```

Per configurarla in locale (senza Docker):

1. Ottieni una chiave API gratuita da [TMDb](https://www.themoviedb.org/settings/api)
2. Nella root del progetto crea/modifica il file `.env` (già ignorato da Git) con:

```env
VITE_TMDB_API_KEY=la_tua_chiave_tmdb
```
3. Riavvia il server di sviluppo (`npm run dev`) se era già in esecuzione.

Quando usi Docker Compose, questo stesso valore viene passato automaticamente al container del frontend leggendo il file `.env` nella root.

## 🎨 Personalizzazione

### Aggiungere Nuovi Filtri

1. **Aggiungi stato in `useMediaGenerator.js`**:

```javascript
const [nuovoFiltro, setNuovoFiltro] = useState(defaultValue);
```

2. **Includi nel filters object**:

```javascript
const filters = {
  minRating,
  maxRating,
  nuovoFiltro, // Aggiungi qui
  // ...
};
```

3. **Aggiorna `tmdbApi.discoverMedia()`** per costruire il parametro query

4. **Crea componente UI** in `src/components/`

5. **Aggiungi alla sezione filtri** in `App.jsx`

### Modificare Stili

L'applicazione usa TailwindCSS. Per personalizzare:

- **Colori/temi**: Modifica `tailwind.config.js`
- **Stili globali**: Modifica `src/App.css` o `src/index.css`
- **Componenti**: Usa classi Tailwind direttamente nei componenti

## 🧪 Testing

### Testare l'Applicazione Manualmente

1. **Test Generazione Media**:

   - Clicca "Genera Contenuto Casuale"
   - Verifica che il media mostrato sia diverso ogni volta
   - Testa i filtri per genere, rating, anno

2. **Test Filtri**:
   - Prova diverse combinazioni di filtri
   - Verifica che i risultati rispettino i criteri impostati
   - Testa il passaggio tra modalità Film e Serie TV

## 🐛 Troubleshooting

### Problemi Comuni

**Errore: "Nessun risultato trovato"**

- I filtri sono troppo restrittivi
- Prova ad ampliare l'intervallo di anni o rimuovere filtri genere
- Verifica la connessione a Internet (necessaria per TMDb API)

**Media senza descrizione italiana**

- L'algoritmo filtra automaticamente questi casi
- Clicca "Genera Contenuto Casuale" per ottenere un altro suggerimento

**Errore API TMDb**

- Verifica che la chiave API sia valida
- Controlla di non aver superato il rate limit (40 richieste ogni 10 secondi)

## 📝 Note di Sviluppo

### Code Style

- **Line width**: 100 caratteri (Prettier)
- **Quotes**: Single quotes
- **Indentazione**: 2 spazi
- **Semicoloni**: Obbligatori
- **Function style**: Function expressions per componenti, function declarations per utility
- **Imports**: Sempre con estensioni `.jsx` o `.js`

### Best Practices

- Usa sempre i servizi API invece di fetch diretto
- Valida descrizioni italiane con `hasValidDescription()`
- Gestisci errori con try/catch e mostra messaggi utente-friendly
- Mantieni componenti piccoli e focalizzati
- Evita di fare troppe richieste consecutive all'API TMDb

## 🔐 Sicurezza

⚠️ **Attenzione**: non esporre mai l'API key di TMDb nel codice sorgente committato.

Per un'applicazione in produzione:

1. Usa sempre variabili d'ambiente per la chiave API (non committare il file `.env`)
2. Considera di creare un backend proxy per le chiamate TMDb
3. Mantieni le chiavi solo in sistemi di secret management o variabili d'ambiente del provider
4. Implementa rate limiting lato client per evitare di superare i limiti TMDb

## 🚀 Deploy

### Build per Produzione

```bash
npm run build
```

I file ottimizzati saranno generati nella cartella `dist/`.

### Deploy su Vercel/Netlify

1. Connetti il repository GitHub
2. Configura build command: `npm run build`
3. Configura output directory: `dist`
4. Aggiungi variabili d'ambiente se necessario
5. Deploy!

### Note Importanti

- Assicurati di configurare la chiave API TMDb come variabile d'ambiente
- Verifica che le richieste all'API TMDb siano ottimizzate per evitare rate limiting

## 📄 Licenza

Questo progetto è sviluppato per scopi educativi.

## 🙏 Riconoscimenti

- **TMDb API**: Dati su film e serie TV forniti da [The Movie Database](https://www.themoviedb.org/)
- **React Team**: Per il framework incredibile
- **Vite Team**: Per la developer experience eccezionale
- **TailwindCSS**: Per lo styling utility-first

## 📞 Supporto

Per domande o problemi, apri una issue nel repository.

---

**Sviluppato con ❤️ e ☕**
