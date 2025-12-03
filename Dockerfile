# Multi-stage Dockerfile for Film Randomized Full-Stack Application

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source (exclude backend)
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY eslint.config.js ./

# Build frontend
RUN npm run build

# Stage 2: Backend with Frontend Static Files
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/dist ./frontend/dist

# Expose port
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Change to backend directory
WORKDIR /app/backend

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
