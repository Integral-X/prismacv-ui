import { env } from '@/shared/config/env';
import { FetchHttpClient } from './fetch-http-client';

let _apiClient: FetchHttpClient | null = null;

export function getApiClient(): FetchHttpClient {
  if (!_apiClient) {
    _apiClient = new FetchHttpClient(env.apiBaseUrl);
  }
  return _apiClient;
}

/**
 * @deprecated Use `getApiClient()` for lazy initialisation during `next build`.
 */
export const apiClient = new Proxy({} as FetchHttpClient, {
  get(_target, prop) {
    const client = getApiClient();
    return Reflect.get(client, prop, client);
  },
});
