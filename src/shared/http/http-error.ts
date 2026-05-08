export class HttpError extends Error {
  readonly statusCode: number;
  readonly serverMessage: string | undefined;
  readonly path: string | undefined;
  readonly correlationId: string | undefined;

  constructor(
    statusCode: number,
    error: string,
    message?: string,
    path?: string,
    correlationId?: string
  ) {
    super(error);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.serverMessage = message;
    this.path = path;
    this.correlationId = correlationId;
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  get isConflict(): boolean {
    return this.statusCode === 409;
  }

  get isTooManyRequests(): boolean {
    return this.statusCode === 429;
  }
}
