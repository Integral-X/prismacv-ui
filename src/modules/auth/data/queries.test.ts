import { cookies } from 'next/headers';
import { apiClient } from '@/shared/http/api-client';
import { executeAuthenticatedRead } from '@/shared/auth/execute-authenticated-request';
import {
  getCurrentUser,
  getVerifiedCurrentUser,
  isAuthenticated,
} from './queries';
import type { UserProfileContract } from './contracts';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('@/shared/http/api-client', () => ({
  apiClient: { get: jest.fn() },
}));

jest.mock('@/shared/auth/execute-authenticated-request', () => ({
  executeAuthenticatedRead: jest.fn(),
}));

type CookieStore = {
  get: jest.Mock<{ value: string } | undefined, [string]>;
  has: jest.Mock<boolean, [string]>;
};

function createCookieStore(): CookieStore {
  return {
    get: jest.fn<{ value: string } | undefined, [string]>(),
    has: jest.fn<boolean, [string]>(),
  };
}

function mockCookieStore(cookieStore: CookieStore): void {
  jest
    .mocked(cookies)
    .mockResolvedValue(
      cookieStore as unknown as Awaited<ReturnType<typeof cookies>>
    );
}

describe('auth queries', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── getCurrentUser (cookie-based, display only) ────────────────────────────

  it('returns null when the user profile cookie is missing', async () => {
    const cookieStore = createCookieStore();
    cookieStore.get.mockReturnValue(undefined);
    mockCookieStore(cookieStore);

    await expect(getCurrentUser()).resolves.toBeNull();
  });

  it('returns null when the user profile cookie contains malformed JSON', async () => {
    const cookieStore = createCookieStore();
    cookieStore.get.mockReturnValue({ value: 'not-json' });
    mockCookieStore(cookieStore);

    await expect(getCurrentUser()).resolves.toBeNull();
  });

  it('parses the current user from a valid user profile cookie', async () => {
    const cookieStore = createCookieStore();
    cookieStore.get.mockReturnValue({
      value: JSON.stringify({
        id: 'user_123',
        email: 'candidate@example.com',
        name: 'Candidate',
        role: 'regular',
        emailVerified: true,
        createdAt: '2026-04-23T10:00:00.000Z',
        updatedAt: '2026-04-23T11:00:00.000Z',
      }),
    });
    mockCookieStore(cookieStore);

    await expect(getCurrentUser()).resolves.toEqual({
      id: 'user_123',
      email: 'candidate@example.com',
      name: 'Candidate',
      role: 'regular',
      emailVerified: true,
      createdAt: new Date('2026-04-23T10:00:00.000Z'),
      updatedAt: new Date('2026-04-23T11:00:00.000Z'),
    });
  });

  it('checks authentication by access token cookie presence', async () => {
    const cookieStore = createCookieStore();
    cookieStore.has.mockReturnValue(true);
    mockCookieStore(cookieStore);

    await expect(isAuthenticated()).resolves.toBe(true);
    expect(cookieStore.has).toHaveBeenCalledWith('access-token');
  });

  // ─── getVerifiedCurrentUser (backend-verified, use for authorization) ────────

  it('fetches and maps the current user from the backend', async () => {
    const backendContract = {
      id: 'user_456',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'PLATFORM_ADMIN',
      emailVerified: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
    } satisfies UserProfileContract;

    jest
      .mocked(executeAuthenticatedRead)
      .mockImplementation((operation) =>
        operation({ Authorization: 'Bearer test-token' })
      );
    jest.mocked(apiClient.get).mockResolvedValue(backendContract);

    await expect(getVerifiedCurrentUser()).resolves.toEqual({
      id: 'user_456',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      emailVerified: true,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    });

    expect(apiClient.get).toHaveBeenCalledWith('users/me', {
      headers: { Authorization: 'Bearer test-token' },
    });
  });

  it('maps a regular user role correctly from the backend', async () => {
    const backendContract = {
      id: 'user_789',
      email: 'user@example.com',
      name: 'Regular User',
      role: 'REGULAR',
      emailVerified: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    } satisfies UserProfileContract;

    jest
      .mocked(executeAuthenticatedRead)
      .mockImplementation((operation) =>
        operation({ Authorization: 'Bearer test-token' })
      );
    jest.mocked(apiClient.get).mockResolvedValue(backendContract);

    const result = await getVerifiedCurrentUser();

    expect(result?.role).toBe('regular');
  });

  it('returns null when the backend request fails (unauthenticated or network error)', async () => {
    jest
      .mocked(executeAuthenticatedRead)
      .mockRejectedValue(new Error('Unauthorized'));

    await expect(getVerifiedCurrentUser()).resolves.toBeNull();
  });
});
