/**
 * Server-side HTTP Client for Next.js API Routes
 * Provides a simple, typed wrapper around fetch for backend-to-backend calls
 * Handles JWT tokens, error responses, and 401 token cleanup automatically
 */

import { getAuthToken, deleteAuthToken } from '@/lib/auth/cookies';

export interface HttpRequestConfig {
  /** Custom headers to include in the request */
  headers?: Record<string, string>;
  /** Whether to include auth token (defaults to true) */
  requireAuth?: boolean;
  /** Request timeout in milliseconds (defaults to 30000) */
  timeout?: number;
}

export interface HttpResponse<T = unknown> {
  /** Response data */
  data: T;
  /** Response status code */
  status: number;
  /** Response headers */
  headers: Headers;
}

/**
 * Parse JSON response or return fallback error
 */
async function parseJsonResponse<T>(response: Response): Promise<T> {
  try {
    return await response.json();
  } catch {
    return {
      error: {
        code: 'PARSE_ERROR',
        message: 'Failed to parse response',
      },
    } as T;
  }
}

/**
 * Custom error class for HTTP client errors
 */
export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * Server-side HTTP client for making backend API calls from Next.js route handlers
 */
export class ServerHttpClient {
  /**
   * Base URL for all requests
   */
  private readonly baseURL: string;

  /**
   * Default timeout in milliseconds
   */
  private readonly defaultTimeout: number;

  /**
   * Create a new HTTP client instance
   * @param baseURL - Base URL for all requests
   * @param defaultTimeout - Default timeout in milliseconds (defaults to 30000)
   */
  constructor(baseURL: string, defaultTimeout: number = 30000) {
    this.baseURL = baseURL;
    this.defaultTimeout = defaultTimeout;
  }

  /**
   * Build request headers with auth token if required
   */
  private async buildHeaders(
    config: HttpRequestConfig
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    // Add auth token if required (defaults to true)
    if (config.requireAuth !== false) {
      const token = await getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Make HTTP request with timeout and error handling
   */
  private async request<T = unknown>(
    endpoint: string,
    method: string,
    config: HttpRequestConfig = {},
    body?: unknown
  ): Promise<HttpResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const timeout = config.timeout ?? this.defaultTimeout;
    const headers = await this.buildHeaders(config);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized - clear auth token
      if (response.status === 401 && config.requireAuth !== false) {
        await deleteAuthToken();
      }

      const data = await parseJsonResponse<T>(response);

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }

      throw error;
    }
  }

  /**
   * GET request
   * @param endpoint - API endpoint path
   * @param config - Request configuration
   * @returns Promise with response data
   * @throws HttpError if request fails
   */
  async get<T = unknown>(
    endpoint: string,
    config?: HttpRequestConfig
  ): Promise<T> {
    const response = await this.request<T>(endpoint, 'GET', config);

    if (!response.status.toString().startsWith('2')) {
      const error =
        typeof response.data === 'object' &&
        response.data !== null &&
        'error' in response.data
          ? (response.data as { error: { code: string; message: string } })
              .error
          : {
              code: `HTTP_${response.status}`,
              message: `Request failed with status ${response.status}`,
            };

      throw new HttpError(
        response.status,
        error.code,
        error.message,
        response.data
      );
    }

    return response.data;
  }

  /**
   * POST request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param config - Request configuration
   * @returns Promise with response data
   * @throws HttpError if request fails
   */
  async post<T = unknown, D = unknown>(
    endpoint: string,
    data?: D,
    config?: HttpRequestConfig
  ): Promise<T> {
    const response = await this.request<T>(endpoint, 'POST', config, data);

    if (!response.status.toString().startsWith('2')) {
      const error =
        typeof response.data === 'object' &&
        response.data !== null &&
        'error' in response.data
          ? (response.data as { error: { code: string; message: string } })
              .error
          : {
              code: `HTTP_${response.status}`,
              message: `Request failed with status ${response.status}`,
            };

      throw new HttpError(
        response.status,
        error.code,
        error.message,
        response.data
      );
    }

    return response.data;
  }

  /**
   * PUT request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param config - Request configuration
   * @returns Promise with response data
   * @throws HttpError if request fails
   */
  async put<T = unknown, D = unknown>(
    endpoint: string,
    data?: D,
    config?: HttpRequestConfig
  ): Promise<T> {
    const response = await this.request<T>(endpoint, 'PUT', config, data);

    if (!response.status.toString().startsWith('2')) {
      const error =
        typeof response.data === 'object' &&
        response.data !== null &&
        'error' in response.data
          ? (response.data as { error: { code: string; message: string } })
              .error
          : {
              code: `HTTP_${response.status}`,
              message: `Request failed with status ${response.status}`,
            };

      throw new HttpError(
        response.status,
        error.code,
        error.message,
        response.data
      );
    }

    return response.data;
  }

  /**
   * PATCH request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param config - Request configuration
   * @returns Promise with response data
   * @throws HttpError if request fails
   */
  async patch<T = unknown, D = unknown>(
    endpoint: string,
    data?: D,
    config?: HttpRequestConfig
  ): Promise<T> {
    const response = await this.request<T>(endpoint, 'PATCH', config, data);

    if (!response.status.toString().startsWith('2')) {
      const error =
        typeof response.data === 'object' &&
        response.data !== null &&
        'error' in response.data
          ? (response.data as { error: { code: string; message: string } })
              .error
          : {
              code: `HTTP_${response.status}`,
              message: `Request failed with status ${response.status}`,
            };

      throw new HttpError(
        response.status,
        error.code,
        error.message,
        response.data
      );
    }

    return response.data;
  }

  /**
   * DELETE request
   * @param endpoint - API endpoint path
   * @param config - Request configuration
   * @returns Promise with response data
   * @throws HttpError if request fails
   */
  async delete<T = unknown>(
    endpoint: string,
    config?: HttpRequestConfig
  ): Promise<T> {
    const response = await this.request<T>(endpoint, 'DELETE', config);

    if (!response.status.toString().startsWith('2')) {
      const error =
        typeof response.data === 'object' &&
        response.data !== null &&
        'error' in response.data
          ? (response.data as { error: { code: string; message: string } })
              .error
          : {
              code: `HTTP_${response.status}`,
              message: `Request failed with status ${response.status}`,
            };

      throw new HttpError(
        response.status,
        error.code,
        error.message,
        response.data
      );
    }

    return response.data;
  }
}

/**
 * Create a pre-configured HTTP client instance for the main API
 */
export function createApiClient(baseURL: string): ServerHttpClient {
  return new ServerHttpClient(baseURL);
}
