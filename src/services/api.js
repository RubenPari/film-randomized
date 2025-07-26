// src/services/api.js

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get auth headers
 */
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Helper function to handle API responses
 */
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  // Handle 204 No Content response
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * API service for backend communication
 */
export const api = {
  // Get watchlist
  async getWatchlist(status = null) {
    const url = status
      ? `${API_BASE_URL}/watchlist?status=${status}`
      : `${API_BASE_URL}/watchlist`;

    const response = await fetch(url, {
      headers: {
        ...getAuthHeaders()
      }
    });
    return handleResponse(response);
  },

  // Add to watchlist
  async addToWatchlist(media, status = 'to_watch') {
    const response = await fetch(`${API_BASE_URL}/watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ media, status })
    });

    return handleResponse(response);
  },

  // Update status
  async updateStatus(mediaId, status) {
    const response = await fetch(`${API_BASE_URL}/watchlist/${mediaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ status })
    });

    return handleResponse(response);
  },

  // Remove from watchlist
  async removeFromWatchlist(mediaId) {
    const response = await fetch(`${API_BASE_URL}/watchlist/${mediaId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      }
    });

    return handleResponse(response);
  },

  // Get statistics
  async getStatistics() {
    const response = await fetch(`${API_BASE_URL}/watchlist/stats`, {
      headers: {
        ...getAuthHeaders()
      }
    });
    return handleResponse(response);
  }
};