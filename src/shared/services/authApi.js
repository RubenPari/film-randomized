import { apiClient } from './apiClient';

/**
 * Authentication API service.
 * Handles all authentication-related API calls to the backend using the centralized client.
 */
export const authApi = {
  /**
   * Logs in a user with username and password.
   * 
   * @param {string} username - The username
   * @param {string} password - The password
   * @returns {Promise<Object>} Promise that resolves to auth response with token and user data
   * @throws {import('./apiClient').ApiError} If login fails
   */
  async login(username, password) {
    return apiClient.post('/auth/login', { username, password });
  },

  /**
   * Registers a new user.
   * 
   * @param {string} username - The username
   * @param {string} email - The email address
   * @param {string} password - The password
   * @returns {Promise<Object>} Promise that resolves to auth response with token and user data
   * @throws {import('./apiClient').ApiError} If registration fails
   */
  async register(username, email, password) {
    return apiClient.post('/auth/register', { username, email, password });
  },

  /**
   * Retrieves the current authenticated user.
   * 
   * @param {string} token - JWT authentication token
   * @returns {Promise<Object>} Promise that resolves to user data
   * @throws {import('./apiClient').ApiError} If request fails or user is not authenticated
   */
  async getCurrentUser(token) {
    return apiClient.get('/auth/me', token);
  },
};
