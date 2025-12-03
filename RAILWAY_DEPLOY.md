# Film Randomized - Railway Deployment Guide

## Prerequisites

1. A [Railway](https://railway.app) account
2. A [Neon](https://neon.tech) PostgreSQL database (or Railway PostgreSQL)
3. A [TMDB API Key](https://www.themoviedb.org/settings/api)

## Deployment Steps

### 1. Prepare Your Repository

Make sure all changes are committed:

```bash
git add .
git commit -m "chore: add Railway deployment configuration"
git push
```

### 2. Create a New Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `film-randomized` repository

### 3. Configure Environment Variables

In Railway project settings, add these environment variables:

#### Required Variables:

- `DATABASE_URL` - Your Neon PostgreSQL connection string
  ```
  postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
  ```

- `VITE_TMDB_API_KEY` - Your TMDB API key
  ```
  your_tmdb_api_key_here
  ```

- `PORT` - Railway will set this automatically, but you can set it to `8000`

### 4. Deploy

Railway will automatically:
1. Detect the Dockerfile
2. Build the Docker image
3. Deploy the application

The build process:
- Builds the React frontend with Vite
- Installs Python dependencies
- Copies the built frontend to be served by FastAPI
- Starts the FastAPI server

### 5. Configure Custom Domain (Optional)

1. Go to your Railway project settings
2. Click on "Domains"
3. Add a custom domain or use the Railway-provided domain

## Architecture

The deployment uses a **single container** that serves both:
- **Backend API** (FastAPI) on all `/api/*` routes
- **Frontend** (React SPA) for all other routes

### How it works:

1. **Build Stage**: Frontend is built with Vite to static files
2. **Runtime**: FastAPI serves:
   - API endpoints at `/api/*`
   - Static frontend files (CSS, JS, images) at `/assets/*`
   - `index.html` for all other routes (SPA routing support)

## Local Docker Testing

Test the Docker build locally before deploying:

```bash
# Build the image
docker build -t film-randomized .

# Run with environment variables
docker run -p 8000:8000 \
  -e DATABASE_URL="your_database_url" \
  -e VITE_TMDB_API_KEY="your_api_key" \
  film-randomized
```

Visit `http://localhost:8000` to test the application.

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string from Neon | Yes |
| `VITE_TMDB_API_KEY` | TMDB API key for fetching movie data | Yes |
| `PORT` | Port for the application (default: 8000) | No (Railway sets it) |

## Troubleshooting

### Build fails
- Check that all dependencies are listed in `package.json` and `requirements.txt`
- Verify the Dockerfile syntax

### Database connection issues
- Ensure `DATABASE_URL` is correctly formatted
- Check that Neon database allows connections from Railway IPs
- Verify SSL mode is set to `require` in the connection string

### Frontend not loading
- Check Railway logs for any errors
- Verify the build completed successfully
- Ensure CORS is configured correctly in `backend/main.py`

### API calls failing
- Update `src/services/watchlistApi.js` if needed to use relative URLs
- Check that environment variables are set in Railway

## Monitoring

- **Logs**: Available in Railway dashboard
- **Metrics**: CPU, Memory usage visible in Railway
- **Health Check**: The root endpoint `/` returns API status

## Cost Considerations

Railway pricing:
- **Hobby Plan**: $5/month for 500 hours
- **Pro Plan**: $20/month for more resources

Consider:
- Using Railway's PostgreSQL instead of Neon (included in Pro plan)
- Monitoring usage to avoid overages
- Setting up deployment notifications

## Updates

To deploy updates:

```bash
git add .
git commit -m "your changes"
git push
```

Railway will automatically rebuild and redeploy.
