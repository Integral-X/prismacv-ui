'use server';

import { ActionResult, toFailureResult } from '@/shared/action-result';
import { createCheckoutSession, createPortalSession } from './mutations';
import type { CheckoutSessionContract } from './contracts';

export async function createCheckoutSessionAction(input: {
  plan: 'PRO' | 'TEAM';
  billingCycle?: 'monthly' | 'yearly';
}): Promise<ActionResult<CheckoutSessionContract>> {
  try {
    const session = await createCheckoutSession(input);
    return { ok: true, data: session };
  } catch (error) {
    return toFailureResult(
      error,
      'Unable to start checkout session. Please try again.'
    );
  }
}

export async function createPortalSessionAction(): Promise<
  ActionResult<{ url: string }>
> {
  try {
    const session = await createPortalSession();
    return { ok: true, data: { url: session.url } };
  } catch (error) {
    return toFailureResult(error, 'Unable to open billing portal right now.');
  }
}
