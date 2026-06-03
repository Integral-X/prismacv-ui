import { HttpError } from '@/shared/http/http-error';
import {
  createCheckoutSessionAction,
  createPortalSessionAction,
} from './actions';

jest.mock('./mutations', () => ({
  createCheckoutSession: jest.fn(),
  createPortalSession: jest.fn(),
}));

const mutations = jest.requireMock('./mutations') as {
  createCheckoutSession: jest.Mock;
  createPortalSession: jest.Mock;
};

describe('billing actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCheckoutSessionAction', () => {
    it('returns the checkout session on success', async () => {
      mutations.createCheckoutSession.mockResolvedValueOnce({
        sessionId: 'cs_001',
        url: 'https://checkout.example/cs_001',
      });

      const result = await createCheckoutSessionAction({
        plan: 'PRO',
        billingCycle: 'yearly',
      });

      expect(result).toEqual({
        ok: true,
        data: { sessionId: 'cs_001', url: 'https://checkout.example/cs_001' },
      });
      expect(mutations.createCheckoutSession).toHaveBeenCalledWith({
        plan: 'PRO',
        billingCycle: 'yearly',
      });
    });

    it('maps a 403 HttpError to forbidden', async () => {
      mutations.createCheckoutSession.mockRejectedValueOnce(
        new HttpError(403, 'Forbidden', 'Plan not available')
      );

      const result = await createCheckoutSessionAction({ plan: 'TEAM' });

      expect(result).toEqual({
        ok: false,
        code: 'forbidden',
        message: 'Plan not available',
      });
    });

    it('maps a generic error to the unknown checkout fallback', async () => {
      mutations.createCheckoutSession.mockRejectedValueOnce(new Error('boom'));

      const result = await createCheckoutSessionAction({ plan: 'PRO' });

      expect(result).toEqual({
        ok: false,
        code: 'unknown',
        message: 'Unable to start checkout session. Please try again.',
      });
    });
  });

  describe('createPortalSessionAction', () => {
    it('returns only the portal url on success', async () => {
      mutations.createPortalSession.mockResolvedValueOnce({
        url: 'https://portal.example/session',
      });

      const result = await createPortalSessionAction();

      expect(result).toEqual({
        ok: true,
        data: { url: 'https://portal.example/session' },
      });
    });

    it('maps a 401 HttpError to unauthorized', async () => {
      mutations.createPortalSession.mockRejectedValueOnce(
        new HttpError(401, 'Unauthorized', 'Session expired')
      );

      const result = await createPortalSessionAction();

      expect(result).toEqual({
        ok: false,
        code: 'unauthorized',
        message: 'Session expired',
      });
    });
  });
});
