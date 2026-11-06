# Frontend Dockerfile for Film Randomized React/Vite app
# Multi-stage build: Vite build -> Nginx static server + /api reverse proxy.
# Works on Google Cloud Run (PORT injected) and locally with docker-compose (defaults).

# Build stage
FROM node:20-alpine AS build

# Build-time TMDb API key for Vite
ARG VITE_TMDB_API_KEY
ENV VITE_TMDB_API_KEY=${VITE_TMDB_API_KEY}

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage - nginx serves static files and proxies /api
FROM nginx:alpine AS production

# Runtime defaults (docker-compose). Cloud Run overrides PORT and sets BACKEND_URL.
ENV PORT=80 \
    BACKEND_URL=http://backend:8000

COPY --from=build /app/dist /usr/share/nginx/html

# Rendered by the official entrypoint via envsubst at startup
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 8080
