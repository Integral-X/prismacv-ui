/**
 * Typed Fetch Client
 * Production-ready fetch wrapper with error handling, timeout, and JWT support
 */

import type { ApiSuccessResponse, RequestConfig } from './types';
import { ApiError, NetworkError, TimeoutError } from './types';

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const;

/**
 * Get JWT token from httpOnly cookie (handled by browser automatically)
 * For server-side requests, we'll read from cookies in Route Handlers
 */
function getAuthHeaders(): HeadersInit {
  // Client-side: browser automatically includes httpOnly cookies
  // Server-side: Route Handlers will read cookies and forward tokens
  return {};
}

/**
 * Create a timeout promise that rejects after specified milliseconds
 */
function createTimeoutPromise(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new TimeoutError()), timeout);
  });
}

/**
 * Parse response and handle errors
 * Throws ApiError on error responses, returns ApiSuccessResponse on success
 */
async function parseResponse<T>(
  response: Response
): Promise<ApiSuccessResponse<T>> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  let data: unknown;
  try {
    data = isJson ? await response.json() : await response.text();
  } catch (error) {
    throw new NetworkError('Failed to parse response', error);
  }

  if (!response.ok) {
    // Handle API error responses
    if (isJson && typeof data === 'object' && data !== null) {
      const errorData = data as {
        error?: { code?: string; message?: string; details?: unknown };
      };
      if (errorData.error) {
        throw new ApiError(
          response.status,
          errorData.error.code || 'UNKNOWN_ERROR',
          errorData.error.message || 'An error occurred',
          errorData.error.details
        );
      }
    }

    // Handle HTTP errors without structured error response
    throw new ApiError(
      response.status,
      `HTTP_${response.status}`,
      `Request failed with status ${response.status}`,
      data
    );
  }

  // Handle successful responses
  if (isJson && typeof data === 'object' && data !== null) {
    // Check if response follows ApiSuccessResponse shape
    if ('data' in data) {
      return data as ApiSuccessResponse<T>;
    }
    // If response is directly the data, wrap it
    return { data: data as T };
  }

  return { data: data as T };
}

/**
 * Typed fetch wrapper with error handling, timeout, and auth
 */
export async function apiClient<T = unknown>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT,
    skipAuth = false,
    skipErrorHandling = false,
    headers = {},
    ...fetchConfig
  } = config;

  // Build headers
  const requestHeaders = new Headers({
    ...DEFAULT_HEADERS,
    ...headers,
  });

  // Add auth headers if not skipped
  if (!skipAuth) {
    const authHeaders = getAuthHeaders();
    Object.entries(authHeaders).forEach(([key, value]) => {
      requestHeaders.set(key, value);
    });
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Race between fetch and timeout
    const fetchPromise = fetch(url, {
      ...fetchConfig,
      headers: requestHeaders,
      signal: controller.signal,
      credentials: 'include', // Include httpOnly cookies
    });

    const response = await Promise.race([
      fetchPromise,
      createTimeoutPromise(timeout),
    ]);

    clearTimeout(timeoutId);

    if (skipErrorHandling) {
      return response.json() as Promise<T>;
    }

    const parsed = await parseResponse<T>(response);
    return parsed.data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle abort (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError(`Request timeout after ${timeout}ms`);
    }

    // Handle network errors
    if (error instanceof NetworkError || error instanceof ApiError) {
      throw error;
    }

    // Handle other errors
    if (error instanceof Error) {
      throw new NetworkError(error.message, error);
    }

    throw new NetworkError('Unknown error occurred', error);
  }
}

/**
 * Convenience methods for HTTP verbs
 */
export const api = {
  get: <T = unknown>(url: string, config?: RequestConfig) =>
    apiClient<T>(url, { ...config, method: 'GET' }),

  post: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
    apiClient<T>(url, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
    apiClient<T>(url, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
    apiClient<T>(url, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = unknown>(url: string, config?: RequestConfig) =>
    apiClient<T>(url, { ...config, method: 'DELETE' }),

  // For file uploads
  upload: <T = unknown>(
    url: string,
    formData: FormData,
    config?: RequestConfig
  ) =>
    apiClient<T>(url, {
      ...config,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
        ...config?.headers,
      },
    }),
};
