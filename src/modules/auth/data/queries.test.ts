import { cookies } from 'next/headers';
import { getCurrentUser, isAuthenticated } from './queries';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
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
});
