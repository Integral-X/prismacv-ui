import { HttpError } from '@/shared/http/http-error';
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  persistAuthSession,
  shouldPersistSession,
} from '@/modules/auth/data/session';
import {
  executeAuthenticatedRead,
  executeAuthenticatedRequest,
} from './execute-authenticated-request';

jest.mock('@/modules/auth/data/session', () => ({
  clearAuthSession: jest.fn(),
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
  persistAuthSession: jest.fn(),
  shouldPersistSession: jest.fn(),
}));

// refreshUserToken is dynamically imported; mock the whole mutations module
jest.mock('@/modules/auth/data/mutations', () => ({
  refreshUserToken: jest.fn(),
}));

const getAccessTokenMock = jest.mocked(getAccessToken);
const getRefreshTokenMock = jest.mocked(getRefreshToken);
const persistAuthSessionMock = jest.mocked(persistAuthSession);
const shouldPersistSessionMock = jest.mocked(shouldPersistSession);
const clearAuthSessionMock = jest.mocked(clearAuthSession);

const userProfile = {
  id: 'user_123',
  email: 'candidate@example.com',
  name: 'Candidate',
  role: 'regular' as const,
  emailVerified: true,
  createdAt: new Date('2026-04-23T10:00:00.000Z'),
  updatedAt: new Date('2026-04-23T11:00:00.000Z'),
};

async function getRefreshUserTokenMock() {
  const mod = await import('@/modules/auth/data/mutations');
  return jest.mocked(mod.refreshUserToken);
}

describe('executeAuthenticatedRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls operation with access token when cookie is present', async () => {
    getAccessTokenMock.mockResolvedValueOnce('valid-access-token');
    const operation = jest.fn().mockResolvedValueOnce('result');

    const result = await executeAuthenticatedRequest(operation);

    expect(operation).toHaveBeenCalledWith({
      Authorization: 'Bearer valid-access-token',
    });
    expect(result).toBe('result');
  });

  it('refreshes session when access-token cookie is absent but refresh-token exists', async () => {
    const refreshUserTokenMock = await getRefreshUserTokenMock();

    getAccessTokenMock.mockResolvedValueOnce(null);
    getRefreshTokenMock.mockResolvedValueOnce('refresh-token');
    shouldPersistSessionMock.mockResolvedValueOnce(true);
    refreshUserTokenMock.mockResolvedValueOnce({
      user: userProfile,
      accessToken: 'fresh-access-token',
      refreshToken: 'fresh-refresh-token',
    });
    const operation = jest.fn().mockResolvedValueOnce('result');

    const result = await executeAuthenticatedRequest(operation);

    expect(refreshUserTokenMock).toHaveBeenCalledWith({
      refreshToken: 'refresh-token',
    });
    expect(persistAuthSessionMock).toHaveBeenCalledWith(
      expect.objectContaining({ accessToken: 'fresh-access-token' }),
      true
    );
    expect(operation).toHaveBeenCalledWith({
      Authorization: 'Bearer fresh-access-token',
    });
    expect(result).toBe('result');
  });

  it('clears session and throws when both tokens are absent', async () => {
    getAccessTokenMock.mockResolvedValueOnce(null);
    getRefreshTokenMock.mockResolvedValueOnce(null);
    const operation = jest.fn();

    await expect(executeAuthenticatedRequest(operation)).rejects.toMatchObject({
      statusCode: 401,
    });
    expect(clearAuthSessionMock).toHaveBeenCalledTimes(1);
    expect(operation).not.toHaveBeenCalled();
  });

  it('refreshes and retries when operation returns 401 with expired access token', async () => {
    const refreshUserTokenMock = await getRefreshUserTokenMock();

    getAccessTokenMock.mockResolvedValueOnce('expired-access-token');
    getRefreshTokenMock.mockResolvedValueOnce('refresh-token');
    shouldPersistSessionMock.mockResolvedValueOnce(false);
    refreshUserTokenMock.mockResolvedValueOnce({
      user: userProfile,
      accessToken: 'fresh-access-token',
      refreshToken: 'fresh-refresh-token',
    });

    const operation = jest
      .fn()
      .mockRejectedValueOnce(new HttpError(401, 'Unauthorized'))
      .mockResolvedValueOnce('result-after-refresh');

    const result = await executeAuthenticatedRequest(operation);

    expect(operation).toHaveBeenCalledTimes(2);
    expect(operation).toHaveBeenNthCalledWith(2, {
      Authorization: 'Bearer fresh-access-token',
    });
    expect(result).toBe('result-after-refresh');
  });

  it('clears session and rethrows when refresh fails', async () => {
    const refreshUserTokenMock = await getRefreshUserTokenMock();
    const refreshError = new HttpError(401, 'Unauthorized');

    getAccessTokenMock.mockResolvedValueOnce(null);
    getRefreshTokenMock.mockResolvedValueOnce('stale-refresh-token');
    refreshUserTokenMock.mockRejectedValueOnce(refreshError);

    await expect(executeAuthenticatedRequest(jest.fn())).rejects.toMatchObject({
      statusCode: 401,
    });
    expect(clearAuthSessionMock).toHaveBeenCalledTimes(1);
  });

  it('does not retry on non-401 errors from operation', async () => {
    getAccessTokenMock.mockResolvedValueOnce('valid-access-token');
    const serverError = new HttpError(500, 'Internal Server Error');
    const operation = jest.fn().mockRejectedValueOnce(serverError);

    await expect(executeAuthenticatedRequest(operation)).rejects.toBe(
      serverError
    );
    expect(operation).toHaveBeenCalledTimes(1);
  });
});

describe('executeAuthenticatedRead', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not clear session when refresh token is absent', async () => {
    getAccessTokenMock.mockResolvedValueOnce(null);
    getRefreshTokenMock.mockResolvedValueOnce(null);

    await expect(executeAuthenticatedRead(jest.fn())).rejects.toMatchObject({
      statusCode: 401,
    });
    expect(clearAuthSessionMock).not.toHaveBeenCalled();
  });

  it('refreshes in memory without persisting session cookies', async () => {
    const refreshUserTokenMock = await getRefreshUserTokenMock();

    getAccessTokenMock.mockResolvedValueOnce(null);
    getRefreshTokenMock.mockResolvedValueOnce('refresh-token');
    refreshUserTokenMock.mockResolvedValueOnce({
      user: userProfile,
      accessToken: 'fresh-access-token',
      refreshToken: 'fresh-refresh-token',
    });
    const operation = jest.fn().mockResolvedValueOnce('result');

    const result = await executeAuthenticatedRead(operation);

    expect(result).toBe('result');
    expect(persistAuthSessionMock).not.toHaveBeenCalled();
    expect(operation).toHaveBeenCalledWith({
      Authorization: 'Bearer fresh-access-token',
    });
  });

  it('does not clear session when refresh fails', async () => {
    const refreshUserTokenMock = await getRefreshUserTokenMock();

    getAccessTokenMock.mockResolvedValueOnce(null);
    getRefreshTokenMock.mockResolvedValueOnce('stale-refresh-token');
    refreshUserTokenMock.mockRejectedValueOnce(
      new HttpError(401, 'Unauthorized')
    );

    await expect(executeAuthenticatedRead(jest.fn())).rejects.toMatchObject({
      statusCode: 401,
    });
    expect(clearAuthSessionMock).not.toHaveBeenCalled();
  });
});
