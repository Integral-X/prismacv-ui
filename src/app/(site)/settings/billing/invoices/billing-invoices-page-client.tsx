'use client';

import { useTransition } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { BillingProfile } from '@/modules/billing/data/mappers';
import { createPortalSessionAction } from '@/modules/billing/data/actions';

import { SettingsPageHeader } from '../../components/settings-page-header';
import { SettingsSectionCard } from '../../components/settings-section-card';

interface BillingInvoicesPageClientProps {
  billing: BillingProfile;
}

function hasPaidPlan(billing: BillingProfile): boolean {
  return billing.plan !== 'free' && billing.stripeCustomerId !== null;
}

export function BillingInvoicesPageClient({
  billing,
}: BillingInvoicesPageClientProps) {
  const [isPending, startTransition] = useTransition();
  const canManageBilling = billing.stripeCustomerId !== null;

  function openStripePortal() {
    startTransition(async () => {
      const result = await createPortalSessionAction();
      if (!result.ok || !result.data?.url) {
        toast.error(result.message ?? 'Unable to open billing portal.');
        return;
      }
      window.location.href = result.data.url;
    });
  }

  return (
    <div className='space-y-6'>
      <SettingsPageHeader
        title='Billing & Invoices'
        description='Manage your payment method and view past invoices.'
      />

      <SettingsSectionCard label='Payment method'>
        {canManageBilling ? (
          <div className='space-y-4'>
            <div className='flex flex-col gap-4 rounded-lg border border-subtle p-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-4'>
                <span className='rounded bg-primary px-2 py-1 text-xs font-bold tracking-wide text-primary-foreground'>
                  CARD
                </span>
                <div>
                  <p className='font-medium text-content-primary'>
                    Payment method on file
                  </p>
                  <p className='text-sm text-content-muted'>
                    Manage card details in the Stripe customer portal
                  </p>
                </div>
              </div>
              <Button
                type='button'
                variant='outline'
                onClick={openStripePortal}
                disabled={isPending}
              >
                Replace
              </Button>
            </div>
            <Button
              type='button'
              variant='outline'
              className='w-full sm:w-auto'
              onClick={openStripePortal}
              disabled={isPending}
            >
              {isPending ? <Loader2 className='size-4 animate-spin' /> : null}
              <Plus className='size-4' aria-hidden />
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className='space-y-4'>
            <p className='text-sm text-content-secondary'>
              No payment method on file. Upgrade to a paid plan to add a card.
            </p>
            <Button type='button' variant='outline' asChild>
              <a href='/settings/billing'>View plans</a>
            </Button>
          </div>
        )}
      </SettingsSectionCard>

      <SettingsSectionCard label='Invoice history'>
        {hasPaidPlan(billing) ? (
          <div className='space-y-4'>
            <p className='text-sm text-content-secondary'>
              Download invoices and receipts from your Stripe customer portal.
            </p>
            <Button
              type='button'
              variant='outline'
              onClick={openStripePortal}
              disabled={isPending}
            >
              {isPending ? <Loader2 className='size-4 animate-spin' /> : null}
              Open invoice history
            </Button>
          </div>
        ) : (
          <p className='border-t border-subtle pt-4 text-sm text-content-secondary'>
            No invoices yet. Upgrade to a paid plan to see your billing history.
          </p>
        )}
      </SettingsSectionCard>
    </div>
  );
}
