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

  /**
   * Requests a password reset link.
   * 
   * @param {string} email - The user's email
   * @returns {Promise<Object>} Promise resolving to status message
   */
  async forgotPassword(email) {
    console.log('[authApi.forgotPassword] Requesting password reset for email:', email);
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      console.log('[authApi.forgotPassword] Success:', response);
      return response;
    } catch (error) {
      console.error('[authApi.forgotPassword] Error:', error);
      throw error;
    }
  },

  /**
   * Resets the password using a token.
   * 
   * @param {string} token - The reset token
   * @param {string} newPassword - The new password
   * @returns {Promise<Object>} Promise resolving to status message
   */
  async resetPassword(token, newPassword) {
    console.log('[authApi.resetPassword] Attempting password reset with token:', token);
    try {
      const response = await apiClient.post('/auth/reset-password', { token, newPassword });
      console.log('[authApi.resetPassword] Success:', response);
      return response;
    } catch (error) {
      console.error('[authApi.resetPassword] Error:', error);
      throw error;
    }
  },

  /**
   * Changes the password for an authenticated user.
   * 
   * @param {string} currentPassword - The current password
   * @param {string} newPassword - The new password
   * @param {string} token - JWT authentication token
   * @returns {Promise<Object>} Promise resolving to status message
   */
  async changePassword(currentPassword, newPassword, token) {
    return apiClient.post('/auth/change-password', { currentPassword, newPassword }, token);
  },
};
