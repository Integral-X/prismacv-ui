import { cookies } from 'next/headers';
import {
  clearAuthSession,
  clearPasswordResetToken,
  getAccessToken,
  getPasswordResetToken,
  getRefreshToken,
  persistAuthSession,
  setPasswordResetToken,
  shouldPersistSession,
} from './session';
import type { AuthResult } from './mappers';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

type CookieOptions = {
  httpOnly: boolean;
  path: string;
  sameSite: 'lax';
  secure: boolean;
  maxAge?: number;
};

type CookieStore = {
  get: jest.Mock<{ value: string } | undefined, [string]>;
  has: jest.Mock<boolean, [string]>;
  set: jest.Mock<void, [string, string, CookieOptions]>;
  delete: jest.Mock<void, [string]>;
};

function createCookieStore(): CookieStore {
  return {
    get: jest.fn<{ value: string } | undefined, [string]>(),
    has: jest.fn<boolean, [string]>(),
    set: jest.fn<void, [string, string, CookieOptions]>(),
    delete: jest.fn<void, [string]>(),
  };
}

const authResult: AuthResult = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: {
    id: 'user_123',
    email: 'candidate@example.com',
    name: 'Candidate',
    role: 'regular',
    emailVerified: true,
    createdAt: new Date('2026-04-23T10:00:00.000Z'),
    updatedAt: new Date('2026-04-23T11:00:00.000Z'),
  },
};

function mockCookieStore(cookieStore: CookieStore): void {
  jest
    .mocked(cookies)
    .mockResolvedValue(
      cookieStore as unknown as Awaited<ReturnType<typeof cookies>>
    );
}

describe('auth session', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('persists auth session cookies with max age when remember me is enabled', async () => {
    const cookieStore = createCookieStore();
    mockCookieStore(cookieStore);

    await persistAuthSession(authResult, true);

    expect(cookieStore.set).toHaveBeenCalledWith(
      'access-token',
      'access-token',
      {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: false,
        maxAge: 900,
      }
    );
    expect(cookieStore.set).toHaveBeenCalledWith(
      'refresh-token',
      'refresh-token',
      expect.objectContaining({
        maxAge: 604800,
      })
    );
    expect(cookieStore.set).toHaveBeenCalledWith(
      'user-profile',
      JSON.stringify({
        ...authResult.user,
        createdAt: '2026-04-23T10:00:00.000Z',
        updatedAt: '2026-04-23T11:00:00.000Z',
      }),
      expect.objectContaining({
        maxAge: 604800,
      })
    );
    expect(cookieStore.set).toHaveBeenCalledWith(
      'session-persistent',
      'true',
      expect.objectContaining({
        maxAge: 604800,
      })
    );
  });

  it('persists session cookies without max age by default', async () => {
    const cookieStore = createCookieStore();
    mockCookieStore(cookieStore);

    await persistAuthSession(authResult);

    expect(cookieStore.set).toHaveBeenCalledWith(
      'access-token',
      'access-token',
      {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: false,
      }
    );
    expect(cookieStore.set).toHaveBeenCalledWith(
      'session-persistent',
      'false',
      {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: false,
      }
    );
  });

  it('clears all auth session cookies', async () => {
    const cookieStore = createCookieStore();
    mockCookieStore(cookieStore);

    await clearAuthSession();

    expect(cookieStore.delete).toHaveBeenCalledWith('access-token');
    expect(cookieStore.delete).toHaveBeenCalledWith('refresh-token');
    expect(cookieStore.delete).toHaveBeenCalledWith('user-profile');
    expect(cookieStore.delete).toHaveBeenCalledWith('session-persistent');
  });

  it('reads token and persistence cookies', async () => {
    const cookieStore = createCookieStore();
    cookieStore.get.mockImplementation((name) => {
      const values: Record<string, string> = {
        'access-token': 'access-token',
        'refresh-token': 'refresh-token',
        'session-persistent': 'true',
      };
      const value = values[name];
      return value ? { value } : undefined;
    });
    mockCookieStore(cookieStore);

    await expect(getAccessToken()).resolves.toBe('access-token');
    await expect(getRefreshToken()).resolves.toBe('refresh-token');
    await expect(shouldPersistSession()).resolves.toBe(true);
  });

  it('stores a short-lived password reset token cookie', async () => {
    const cookieStore = createCookieStore();
    mockCookieStore(cookieStore);

    await setPasswordResetToken('reset-token-xyz');

    expect(cookieStore.set).toHaveBeenCalledWith(
      'password-reset-token',
      'reset-token-xyz',
      {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: false,
        maxAge: 600,
      }
    );
  });

  it('reads a stored password reset token', async () => {
    const cookieStore = createCookieStore();
    cookieStore.get.mockImplementation((name) =>
      name === 'password-reset-token' ? { value: 'reset-token-xyz' } : undefined
    );
    mockCookieStore(cookieStore);

    await expect(getPasswordResetToken()).resolves.toBe('reset-token-xyz');
  });

  it('returns null when password reset token cookie is absent', async () => {
    const cookieStore = createCookieStore();
    cookieStore.get.mockReturnValue(undefined);
    mockCookieStore(cookieStore);

    await expect(getPasswordResetToken()).resolves.toBeNull();
  });

  it('deletes the password reset token cookie', async () => {
    const cookieStore = createCookieStore();
    mockCookieStore(cookieStore);

    await clearPasswordResetToken();

    expect(cookieStore.delete).toHaveBeenCalledWith('password-reset-token');
  });

  it('also deletes password reset token when clearing the full auth session', async () => {
    const cookieStore = createCookieStore();
    mockCookieStore(cookieStore);

    await clearAuthSession();

    expect(cookieStore.delete).toHaveBeenCalledWith('password-reset-token');
  });
});
