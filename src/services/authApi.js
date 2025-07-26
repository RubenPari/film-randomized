// src/services/authApi.js
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get auth headers
 */
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Handle API responses
 */
async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
    }

    return response.json();
}

/**
 * Authentication API service
 */
export const authApi = {
    // Login
    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        return handleResponse(response);
    },

    // Get current user
    async getMe() {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                ...getAuthHeaders()
            }
        });

        return handleResponse(response);
    },

    // Verify token
    async verify() {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: {
                ...getAuthHeaders()
            }
        });

        return handleResponse(response);
    }
};