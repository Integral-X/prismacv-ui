export interface NextFetchConfig {
  revalidate?: number | false;
  tags?: string[];
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  cache?: RequestCache;
  next?: NextFetchConfig;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiErrorEnvelope {
  success: false;
  error: string;
  message?: string;
  statusCode: number;
  timestamp: string;
  path?: string;
  method?: string;
}
