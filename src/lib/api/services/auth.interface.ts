/**
 * Auth Service Interfaces
 * Type definitions for authentication-related API calls
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token?: string; // Only if not using httpOnly cookies
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
