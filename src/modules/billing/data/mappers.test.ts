import type { BillingProfileContract } from './contracts';
import { toBillingProfile } from './mappers';

describe('toBillingProfile', () => {
  it('maps a paid profile with an active subscription and quota dates', () => {
    const contract = {
      plan: 'PRO',
      stripeCustomerId: 'cus_123',
      subscription: {
        id: 'sub_001',
        status: 'active',
        planCode: 'PRO',
        currentPeriodStart: '2026-04-01T00:00:00.000Z',
        currentPeriodEnd: '2026-05-01T00:00:00.000Z',
        cancelAtPeriodEnd: false,
      },
      aiQuota: {
        used: 12,
        limit: 50,
        remaining: 38,
        periodEnd: '2026-05-01T00:00:00.000Z',
      },
    } satisfies BillingProfileContract;

    const result = toBillingProfile(contract);

    expect(result.plan).toBe('pro');
    expect(result.stripeCustomerId).toBe('cus_123');
    expect(result.subscription?.planCode).toBe('pro');
    expect(result.subscription?.currentPeriodEnd).toEqual(
      new Date('2026-05-01T00:00:00.000Z')
    );
    expect(result.aiQuota.periodEnd).toEqual(
      new Date('2026-05-01T00:00:00.000Z')
    );
    expect(result.aiQuota.remaining).toBe(38);
  });

  it('maps a free profile with no subscription and null period dates', () => {
    const contract = {
      plan: 'FREE',
      stripeCustomerId: null,
      subscription: null,
      aiQuota: {
        used: 0,
        limit: 5,
        remaining: 5,
        periodEnd: '2026-05-01T00:00:00.000Z',
      },
    } satisfies BillingProfileContract;

    const result = toBillingProfile(contract);

    expect(result.plan).toBe('free');
    expect(result.stripeCustomerId).toBeNull();
    expect(result.subscription).toBeNull();
  });

  it('keeps subscription period boundaries null when absent', () => {
    const contract = {
      plan: 'TEAM',
      stripeCustomerId: 'cus_team',
      subscription: {
        id: 'sub_002',
        status: 'trialing',
        planCode: 'TEAM',
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: true,
      },
      aiQuota: {
        used: 1,
        limit: 100,
        remaining: 99,
        periodEnd: '2026-06-01T00:00:00.000Z',
      },
    } satisfies BillingProfileContract;

    const result = toBillingProfile(contract);

    expect(result.plan).toBe('team');
    expect(result.subscription?.planCode).toBe('team');
    expect(result.subscription?.currentPeriodStart).toBeNull();
    expect(result.subscription?.currentPeriodEnd).toBeNull();
    expect(result.subscription?.cancelAtPeriodEnd).toBe(true);
  });
});
