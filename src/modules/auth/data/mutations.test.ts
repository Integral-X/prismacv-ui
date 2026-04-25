import { apiClient } from '@/shared/http/api-client';
import { HttpError } from '@/shared/http/http-error';
import type {
  ChangePasswordContract,
  ChangePasswordRequest,
  UserLoginContract,
  UserLoginRequest,
} from './contracts';
import { changePassword, loginUser } from './mutations';
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  persistAuthSession,
  shouldPersistSession,
} from './session';

jest.mock('@/shared/http/api-client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

jest.mock('./session', () => ({
  clearAuthSession: jest.fn(),
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
  persistAuthSession: jest.fn(),
  shouldPersistSession: jest.fn(),
}));

const userContract = {
  id: 'user_123',
  email: 'candidate@example.com',
  name: 'Candidate',
  role: 'REGULAR',
  emailVerified: true,
  createdAt: '2026-04-23T10:00:00.000Z',
  updatedAt: '2026-04-23T11:00:00.000Z',
} satisfies UserLoginContract['user'];

const loginBody: UserLoginRequest = {
  email: 'candidate@example.com',
  password: 'password-123',
};

const changePasswordBody: ChangePasswordRequest = {
  currentPassword: 'old-password',
  newPassword: 'new-password',
  confirmPassword: 'new-password',
};

const changePasswordResponse: ChangePasswordContract = {
  message: 'Password changed',
};

describe('auth mutations', () => {
  const postMock = jest.mocked(apiClient.post);
  const getAccessTokenMock = jest.mocked(getAccessToken);
  const getRefreshTokenMock = jest.mocked(getRefreshToken);
  const persistAuthSessionMock = jest.mocked(persistAuthSession);
  const shouldPersistSessionMock = jest.mocked(shouldPersistSession);
  const clearAuthSessionMock = jest.mocked(clearAuthSession);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs users in through the API client and maps the auth result', async () => {
    postMock.mockResolvedValueOnce({
      user: userContract,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    } satisfies UserLoginContract);

    await expect(loginUser(loginBody)).resolves.toEqual({
      user: {
        id: 'user_123',
        email: 'candidate@example.com',
        name: 'Candidate',
        role: 'regular',
        emailVerified: true,
        createdAt: new Date('2026-04-23T10:00:00.000Z'),
        updatedAt: new Date('2026-04-23T11:00:00.000Z'),
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(postMock).toHaveBeenCalledWith('auth/user/login', loginBody);
  });

  it('sends the access token as a bearer token for authenticated mutations', async () => {
    getAccessTokenMock.mockResolvedValueOnce('access-token');
    postMock.mockResolvedValueOnce(changePasswordResponse);

    await expect(changePassword(changePasswordBody)).resolves.toEqual(
      changePasswordResponse
    );
    expect(postMock).toHaveBeenCalledWith(
      'auth/user/change-password',
      changePasswordBody,
      {
        headers: {
          Authorization: 'Bearer access-token',
        },
      }
    );
  });

  it('refreshes an expired access token and retries authenticated mutations', async () => {
    getAccessTokenMock.mockResolvedValueOnce('expired-access-token');
    getRefreshTokenMock.mockResolvedValueOnce('refresh-token');
    shouldPersistSessionMock.mockResolvedValueOnce(true);
    postMock
      .mockRejectedValueOnce(new HttpError(401, 'Unauthorized'))
      .mockResolvedValueOnce({
        user: userContract,
        accessToken: 'fresh-access-token',
        refreshToken: 'fresh-refresh-token',
      } satisfies UserLoginContract)
      .mockResolvedValueOnce(changePasswordResponse);

    await expect(changePassword(changePasswordBody)).resolves.toEqual(
      changePasswordResponse
    );

    expect(postMock).toHaveBeenNthCalledWith(
      1,
      'auth/user/change-password',
      changePasswordBody,
      {
        headers: {
          Authorization: 'Bearer expired-access-token',
        },
      }
    );
    expect(postMock).toHaveBeenNthCalledWith(2, 'auth/user/refresh', {
      refreshToken: 'refresh-token',
    });
    expect(persistAuthSessionMock).toHaveBeenCalledWith(
      {
        user: {
          id: 'user_123',
          email: 'candidate@example.com',
          name: 'Candidate',
          role: 'regular',
          emailVerified: true,
          createdAt: new Date('2026-04-23T10:00:00.000Z'),
          updatedAt: new Date('2026-04-23T11:00:00.000Z'),
        },
        accessToken: 'fresh-access-token',
        refreshToken: 'fresh-refresh-token',
      },
      true
    );
    expect(postMock).toHaveBeenNthCalledWith(
      3,
      'auth/user/change-password',
      changePasswordBody,
      {
        headers: {
          Authorization: 'Bearer fresh-access-token',
        },
      }
    );
  });

  it('clears the auth session when token refresh fails', async () => {
    const refreshError = new HttpError(401, 'Unauthorized');

    getAccessTokenMock.mockResolvedValueOnce('expired-access-token');
    getRefreshTokenMock.mockResolvedValueOnce('refresh-token');
    postMock
      .mockRejectedValueOnce(new HttpError(401, 'Unauthorized'))
      .mockRejectedValueOnce(refreshError);

    await expect(changePassword(changePasswordBody)).rejects.toBe(refreshError);
    expect(clearAuthSessionMock).toHaveBeenCalledTimes(1);
  });
});
