import type { RequestConfig } from "./types";

export interface HttpClient {
  get<T>(endpoint: string, config?: RequestConfig): Promise<T>;
  post<T, B>(endpoint: string, body: B, config?: RequestConfig): Promise<T>;
  put<T, B>(endpoint: string, body: B, config?: RequestConfig): Promise<T>;
  patch<T, B>(endpoint: string, body: B, config?: RequestConfig): Promise<T>;
  delete<T>(endpoint: string, config?: RequestConfig): Promise<T>;
}
