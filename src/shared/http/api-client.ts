import { env } from '@/shared/config/env';
import { FetchHttpClient } from './fetch-http-client';

export const apiClient = new FetchHttpClient(env.apiBaseUrl);
