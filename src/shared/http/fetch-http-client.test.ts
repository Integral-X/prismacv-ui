import { logger } from '@/shared/logger/logger';
import { captureUiException } from '@/shared/monitoring/sentry';
import { FetchHttpClient } from './fetch-http-client';
import { HttpError } from './http-error';

jest.mock('@/shared/logger/logger', () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/shared/monitoring/sentry', () => ({
  captureUiException: jest.fn(),
}));

const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;

function createJsonResponse(
  body: unknown,
  init: Pick<Response, 'ok' | 'status' | 'statusText'>
): Response {
  const text = typeof body === 'string' ? body : JSON.stringify(body ?? null);
  return {
    ok: init.ok,
    status: init.status,
    statusText: init.statusText,
    headers: {
      get: jest.fn().mockReturnValue(null),
    },
    text: jest.fn<Promise<string>, []>().mockResolvedValue(text),
    json: jest.fn<Promise<unknown>, []>().mockResolvedValue(body),
  } as unknown as Response;
}

describe('FetchHttpClient', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    jest.mocked(logger.debug).mockClear();
    jest.mocked(logger.error).mockClear();
    jest.mocked(captureUiException).mockClear();
    global.fetch = fetchMock;
  });

  it('builds GET requests with query params and unwraps successful envelopes', async () => {
    const client = new FetchHttpClient('https://api.example.com');
    const responseData = {
      id: 'career-roadmap',
      title: 'Career Roadmap',
    };

    fetchMock.mockResolvedValueOnce(
      createJsonResponse(
        {
          success: true,
          data: responseData,
          timestamp: '2026-04-23T00:00:00.000Z',
        },
        {
          ok: true,
          status: 200,
          statusText: 'OK',
        }
      )
    );

    await expect(
      client.get<typeof responseData>('roadmaps/current', {
        params: {
          active: true,
          page: 2,
          search: 'frontend',
        },
        cache: 'no-store',
        next: {
          tags: ['roadmaps'],
        },
      })
    ).resolves.toEqual(responseData);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/roadmaps/current?active=true&page=2&search=frontend',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: undefined,
        cache: 'no-store',
        next: {
          tags: ['roadmaps'],
        },
      }
    );
  });

  it('serializes request bodies and merges custom headers', async () => {
    const client = new FetchHttpClient('https://api.example.com/');
    const requestBody = {
      targetRole: 'Staff Engineer',
    };
    const responseData = {
      roadmapId: 'roadmap_123',
    };

    fetchMock.mockResolvedValueOnce(
      createJsonResponse(
        {
          success: true,
          data: responseData,
          timestamp: '2026-04-23T00:00:00.000Z',
        },
        {
          ok: true,
          status: 201,
          statusText: 'Created',
        }
      )
    );

    await expect(
      client.post<typeof responseData, typeof requestBody>(
        '/roadmaps',
        requestBody,
        {
          headers: {
            Authorization: 'Bearer access-token',
          },
        }
      )
    ).resolves.toEqual(responseData);

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/roadmaps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer access-token',
      },
      body: JSON.stringify(requestBody),
      cache: undefined,
      next: undefined,
    });
  });

  it('throws HttpError with backend error details for failed responses', async () => {
    const client = new FetchHttpClient('https://api.example.com');

    fetchMock.mockResolvedValueOnce(
      createJsonResponse(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Missing access token',
          statusCode: 401,
          timestamp: '2026-04-23T00:00:00.000Z',
          path: '/profile',
        },
        {
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
        }
      )
    );

    await expect(client.get('profile')).rejects.toMatchObject({
      name: 'HttpError',
      message: 'Unauthorized',
      statusCode: 401,
      serverMessage: 'Missing access token',
      path: '/profile',
      isUnauthorized: true,
    });
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        status: 401,
      })
    );
  });

  it('falls back to the response status text when an error body has no error', async () => {
    const client = new FetchHttpClient('https://api.example.com');

    fetchMock.mockResolvedValueOnce(
      createJsonResponse(
        {
          success: false,
          message: 'Server failed',
          statusCode: 500,
          timestamp: '2026-04-23T00:00:00.000Z',
        },
        {
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        }
      )
    );

    await expect(client.delete('profile')).rejects.toThrow(
      new HttpError(500, 'Internal Server Error', 'Server failed')
    );
  });

  it('returns undefined for 204 No Content responses', async () => {
    const client = new FetchHttpClient('https://api.example.com');
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 204,
      statusText: 'No Content',
      headers: {
        get: jest.fn().mockReturnValue(null),
      },
      text: jest.fn().mockResolvedValue(''),
    } as unknown as Response);

    await expect(client.delete<void>('cv/abc/share')).resolves.toBeUndefined();
  });

  it('falls back to status text when error response body is not a JSON envelope', async () => {
    const client = new FetchHttpClient('https://api.example.com');

    // Plain string body — not JSON at all
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      headers: { get: jest.fn().mockReturnValue(null) },
      text: jest.fn().mockResolvedValue('upstream timeout'),
    } as unknown as Response);

    await expect(client.get('health')).rejects.toMatchObject({
      statusCode: 503,
      message: 'Service Unavailable',
    });
  });

  it('falls back gracefully when error response body is empty', async () => {
    const client = new FetchHttpClient('https://api.example.com');

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
      headers: { get: jest.fn().mockReturnValue(null) },
      text: jest.fn().mockResolvedValue(''),
    } as unknown as Response);

    await expect(client.get('health')).rejects.toMatchObject({
      statusCode: 502,
      message: 'Bad Gateway',
    });
  });
});
