import { toUserProfile } from './mappers';
import type { UserProfileResponseContract } from './contracts';

const baseContract = {
  id: 'user_123',
  email: 'user@example.com',
  name: 'Alice Smith',
  role: 'REGULAR',
  emailVerified: true,
  avatarUrl: 'https://cdn.example.com/avatar.jpg',
  provider: 'google',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
} satisfies UserProfileResponseContract;

describe('toUserProfile', () => {
  it('maps a full contract to a UserProfile domain object', () => {
    const result = toUserProfile(baseContract);

    expect(result).toEqual({
      id: 'user_123',
      email: 'user@example.com',
      name: 'Alice Smith',
      role: 'regular',
      emailVerified: true,
      avatarUrl: 'https://cdn.example.com/avatar.jpg',
      provider: 'google',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    });
  });

  it('lowercases the role field', () => {
    const result = toUserProfile({ ...baseContract, role: 'PLATFORM_ADMIN' });
    expect(result.role).toBe('platform_admin');
  });

  it('maps null optional fields when absent', () => {
    const result = toUserProfile({
      ...baseContract,
      name: undefined,
      avatarUrl: undefined,
      provider: undefined,
    });

    expect(result.name).toBeNull();
    expect(result.avatarUrl).toBeNull();
    expect(result.provider).toBeNull();
  });

  it('parses date strings into Date instances', () => {
    const result = toUserProfile(baseContract);

    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(result.createdAt.toISOString()).toBe('2026-01-01T00:00:00.000Z');
  });
});
