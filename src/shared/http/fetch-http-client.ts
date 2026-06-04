import { logger } from '@/shared/logger/logger';
import { sanitizeLogPayload } from '@/shared/logger/sanitize-log-payload';
import { captureUiException } from '@/shared/monitoring/sentry';
import { HttpError } from './http-error';
import type { HttpClient } from './http-client';
import type { ApiEnvelope, ApiErrorEnvelope, RequestConfig } from './types';

const SENSITIVE_QUERY_KEYS = new Set([
  'token',
  'access_token',
  'refresh_token',
  'password',
  'secret',
  'authorization',
]);

function sanitizeUrlForLogging(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    for (const key of Array.from(url.searchParams.keys())) {
      if (SENSITIVE_QUERY_KEYS.has(key.toLowerCase())) {
        url.searchParams.set(key, '[Redacted]');
      }
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}

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

  private async sendAndParseEnvelope<T>(
    method: string,
    url: string,
    headers: Record<string, string>,
    body: BodyInit | undefined,
    config: RequestConfig,
    logBody?: unknown
  ): Promise<T> {
    const start = Date.now();
    const safeUrl = sanitizeUrlForLogging(url);
    logger.debug({
      method,
      url: safeUrl,
      body: sanitizeLogPayload(logBody),
    });

    const response = await fetch(url, {
      method,
      headers: { ...headers, ...config.headers },
      body,
      cache: config.cache,
      next: config.next,
    });
    const correlationId = response.headers.get('x-correlation-id') ?? undefined;

    const rawText = await response.text();
    let json: unknown = null;
    if (rawText.length > 0) {
      try {
        json = JSON.parse(rawText) as unknown;
      } catch {
        if (!response.ok) {
          throw new HttpError(
            response.status,
            response.statusText,
            'Invalid error response from server',
            undefined,
            correlationId
          );
        }
        throw new HttpError(
          500,
          'Invalid JSON',
          'The server returned an invalid response',
          undefined,
          correlationId
        );
      }
    }

    if (!response.ok) {
      const errorBody =
        json !== null && typeof json === 'object'
          ? (json as Partial<ApiErrorEnvelope>)
          : {};
      const safeErrorBody = sanitizeLogPayload(errorBody);
      logger.error({
        method,
        url: safeUrl,
        status: response.status,
        durationMs: Date.now() - start,
        correlationId,
        error: safeErrorBody,
      });

      captureUiException(
        new Error(
          `HTTP request failed (${response.status}) for ${method} ${safeUrl}`
        ),
        {
          tags: {
            correlationId: correlationId ?? 'missing',
            method,
            status: response.status,
          },
          extra: {
            url: safeUrl,
            response: safeErrorBody,
          },
        }
      );

      throw new HttpError(
        response.status,
        errorBody.error ?? response.statusText,
        errorBody.message,
        errorBody.path,
        correlationId
      );
    }

    if (response.status === 204) {
      logger.debug({
        method,
        url: safeUrl,
        status: response.status,
        durationMs: Date.now() - start,
        correlationId,
        data: null,
      });
      return undefined as T;
    }

    logger.debug({
      method,
      url: safeUrl,
      status: response.status,
      durationMs: Date.now() - start,
      correlationId,
      data: sanitizeLogPayload(json),
    });

    return (json as ApiEnvelope<T>).data;
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
    };

    return this.sendAndParseEnvelope<T>(
      method,
      url,
      headers,
      body !== undefined ? JSON.stringify(body) : undefined,
      config,
      body
    );
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.execute<T>('GET', endpoint, undefined, config);
  }

  async getBlob(endpoint: string, config: RequestConfig = {}): Promise<Blob> {
    const url = this.buildUrl(endpoint, config.params);
    const start = Date.now();
    const safeUrl = sanitizeUrlForLogging(url);

    logger.debug({ method: 'GET', url: safeUrl });

    const response = await fetch(url, {
      method: 'GET',
      headers: { ...config.headers },
      cache: config.cache,
      next: config.next,
    });

    const correlationId = response.headers.get('x-correlation-id') ?? undefined;

    if (!response.ok) {
      let errorName = response.statusText;
      let errorMessage: string | undefined;
      let errorPath: string | undefined;
      try {
        const errorBody = (await response.json()) as Partial<ApiErrorEnvelope>;
        errorName = errorBody.error ?? response.statusText;
        errorMessage = errorBody.message;
        errorPath = errorBody.path;
      } catch {
        // non-JSON error body — use status text only
      }
      logger.error({
        method: 'GET',
        url: safeUrl,
        status: response.status,
        durationMs: Date.now() - start,
        correlationId,
      });
      throw new HttpError(
        response.status,
        errorName,
        errorMessage,
        errorPath,
        correlationId
      );
    }

    logger.debug({
      method: 'GET',
      url: safeUrl,
      status: response.status,
      durationMs: Date.now() - start,
      correlationId,
      data: '[Blob]',
    });

    return response.blob();
  }

  post<T, B>(endpoint: string, body: B, config?: RequestConfig): Promise<T> {
    return this.execute<T>('POST', endpoint, body, config);
  }

  postFormData<T>(
    endpoint: string,
    formData: FormData,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = this.buildUrl(endpoint, config.params);
    return this.sendAndParseEnvelope<T>(
      'POST',
      url,
      {},
      formData,
      config,
      '[FormData]'
    );
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
