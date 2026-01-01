/**
 * Authentication API service.
 * Handles all authentication-related API calls to the backend.
 */

/**
 * Base URL for API requests.
 * Uses relative path in production, localhost in development.
 * @type {string}
 */
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000/api';

/**
 * Authentication API methods.
 * @namespace
 */
export const authApi = {
  /**
   * Logs in a user with username and password.
   * 
   * @param {string} username - The username
   * @param {string} password - The password
   * @returns {Promise<Object>} Promise that resolves to auth response with token and user data
   * @throws {Error} If login fails
   */
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error during login');
    }

    return await response.json();
  },

  /**
   * Registers a new user.
   * 
   * @param {string} username - The username
   * @param {string} email - The email address
   * @param {string} password - The password
   * @returns {Promise<Object>} Promise that resolves to auth response with token and user data
   * @throws {Error} If registration fails
   */
  async register(username, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error during registration');
    }

    return await response.json();
  },

  /**
   * Retrieves the current authenticated user.
   * 
   * @param {string} token - JWT authentication token
   * @returns {Promise<Object>} Promise that resolves to user data
   * @throws {Error} If request fails or user is not authenticated
   */
  async getCurrentUser(token) {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error retrieving user');
    }

    return await response.json();
  },
};
