import { HttpError } from './http-error';
import type { HttpClient } from './http-client';
import type { ApiEnvelope, ApiErrorEnvelope, RequestConfig } from './types';

export class FetchHttpClient implements HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url = new URL(endpoint, this.baseUrl);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
      }
    }

    return url.toString();
  }

  private async execute<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = this.buildUrl(endpoint, config.params);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: config.cache,
      next: config.next,
    });

    const json: unknown = await response.json();

    if (!response.ok) {
      const errorBody = json as ApiErrorEnvelope;
      throw new HttpError(
        response.status,
        errorBody.error ?? response.statusText,
        errorBody.message,
        errorBody.path
      );
    }

    return (json as ApiEnvelope<T>).data;
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.execute<T>('GET', endpoint, undefined, config);
  }

  post<T, B>(endpoint: string, body: B, config?: RequestConfig): Promise<T> {
    return this.execute<T>('POST', endpoint, body, config);
  }

  put<T, B>(endpoint: string, body: B, config?: RequestConfig): Promise<T> {
    return this.execute<T>('PUT', endpoint, body, config);
  }

  patch<T, B>(endpoint: string, body: B, config?: RequestConfig): Promise<T> {
    return this.execute<T>('PATCH', endpoint, body, config);
  }

  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.execute<T>('DELETE', endpoint, undefined, config);
  }
}
