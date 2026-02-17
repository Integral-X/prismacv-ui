/**
 * Auth Service
 * Handles authentication-related API calls
 */

import { api } from '../client';
import { INTERNAL_API_ROUTES } from '../endpoints';
import type { LoginCredentials, LoginResponse, User } from './auth.interface';

export const authService = {
  /**
   * Login user
   * Sets httpOnly cookie with JWT token
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return api.post<LoginResponse>(INTERNAL_API_ROUTES.auth.login, credentials);
  },

  /**
   * Logout user
   * Clears httpOnly cookie
   */
  logout: async (): Promise<void> => {
    return api.post<void>(INTERNAL_API_ROUTES.auth.logout);
  },

  /**
   * Refresh JWT token
   * Uses refresh token from httpOnly cookie
   */
  refresh: async (): Promise<{ token: string }> => {
    return api.post<{ token: string }>(INTERNAL_API_ROUTES.auth.refresh);
  },

  /**
   * Get current user
   * Uses JWT from httpOnly cookie
   */
  getMe: async (): Promise<User> => {
    return api.get<User>(INTERNAL_API_ROUTES.auth.me);
  },
};
