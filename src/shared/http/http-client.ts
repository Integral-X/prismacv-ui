import type { RequestConfig } from "./types";

export interface HttpClient {
  get<T>(endpoint: string, config?: RequestConfig): Promise<T>;
  getBlob(endpoint: string, config?: RequestConfig): Promise<Blob>;
  post<T, B>(endpoint: string, body: B, config?: RequestConfig): Promise<T>;
  postFormData<T>(
    endpoint: string,
    formData: FormData,
    config?: RequestConfig
  ): Promise<T>;
  put<T, B>(endpoint: string, body: B, config?: RequestConfig): Promise<T>;
  patch<T, B>(endpoint: string, body: B, config?: RequestConfig): Promise<T>;
  delete<T>(endpoint: string, config?: RequestConfig): Promise<T>;
}
