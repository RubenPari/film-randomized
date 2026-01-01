# Frontend Dockerfile for Film Randomized React/Vite app
# Multi-stage build for optimized image size

# Build stage
FROM node:20-alpine AS build

# Build-time TMDb API key for Vite
ARG VITE_TMDB_API_KEY
ENV VITE_TMDB_API_KEY=${VITE_TMDB_API_KEY}

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY film-randomized/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY film-randomized/ ./

# Build Vite frontend (uses VITE_TMDB_API_KEY)
RUN npm run build

# Production stage - use Vite preview server
FROM node:20-alpine AS production

# Install wget for healthcheck
RUN apk add --no-cache wget

WORKDIR /app

# Copy package files and install all dependencies (Vite preview needs devDependencies)
COPY film-randomized/package*.json ./
RUN npm ci && \
    npm cache clean --force

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose Vite preview port
EXPOSE 4173

# Start Vite preview server
CMD ["sh", "-c", "npm run preview -- --host 0.0.0.0 --port ${PORT:-4173}"]

