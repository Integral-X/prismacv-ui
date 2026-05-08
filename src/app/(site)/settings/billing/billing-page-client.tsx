'use client';

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { CreditCard, Loader2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { BillingProfile } from '@/modules/billing/data/mappers';
import {
  createCheckoutSessionAction,
  createPortalSessionAction,
} from '@/modules/billing/data/actions';

interface BillingPageClientProps {
  billing: BillingProfile;
}

function formatPlanLabel(plan: BillingProfile['plan']): string {
  return plan === 'pro' ? 'Pro' : plan === 'team' ? 'Team' : 'Free';
}

function formatDate(date: Date | null): string {
  return date ? date.toLocaleDateString() : 'N/A';
}

export function BillingPageClient({ billing }: BillingPageClientProps) {
  const [isYearly, setIsYearly] = React.useState(true);
  const [isPending, startTransition] = React.useTransition();

  const handleCheckout = (plan: 'PRO' | 'TEAM') => {
    startTransition(async () => {
      const result = await createCheckoutSessionAction({
        plan,
        billingCycle: isYearly ? 'yearly' : 'monthly',
      });

      if (!result.ok || !result.data?.url) {
        toast.error(result.message ?? 'Unable to start checkout.');
        return;
      }

      window.location.href = result.data.url;
    });
  };

  const handleOpenPortal = () => {
    startTransition(async () => {
      const result = await createPortalSessionAction();
      if (!result.ok || !result.data?.url) {
        toast.error(result.message ?? 'Unable to open billing portal.');
        return;
      }
      window.location.href = result.data.url;
    });
  };

  const usagePercent =
    billing.aiQuota.limit > 0
      ? Math.min(
          100,
          Math.round((billing.aiQuota.used / billing.aiQuota.limit) * 100)
        )
      : 0;

  return (
    <main className='mx-auto max-w-4xl px-4 py-10 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold'>Billing</h1>
          <p className='text-sm text-muted-foreground'>
            Manage your subscription and AI usage limits.
          </p>
        </div>
        <Button variant='outline' asChild>
          <Link href='/settings'>Back to settings</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CreditCard className='size-5' />
            Current plan
          </CardTitle>
          <CardDescription>
            Subscription snapshot from Stripe sync
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center gap-3'>
            <Badge>{formatPlanLabel(billing.plan)}</Badge>
            {billing.subscription?.status && (
              <Badge variant='secondary'>{billing.subscription.status}</Badge>
            )}
          </div>
          <p className='text-sm text-muted-foreground'>
            Renewal date:{' '}
            {formatDate(billing.subscription?.currentPeriodEnd ?? null)}
          </p>
          <Button onClick={handleOpenPortal} disabled={isPending}>
            {isPending && <Loader2 className='size-4 animate-spin' />}
            Manage in Stripe portal
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Sparkles className='size-5' />
            AI quota
          </CardTitle>
          <CardDescription>
            {billing.aiQuota.used}/{billing.aiQuota.limit} used this month
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='h-2 rounded bg-secondary'>
            <div
              className='h-2 rounded bg-primary transition-all'
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className='text-xs text-muted-foreground'>
            Resets on {billing.aiQuota.periodEnd.toLocaleDateString()} (
            {billing.aiQuota.remaining} remaining)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upgrade plan</CardTitle>
          <CardDescription>
            Choose your billing cycle and start a Stripe checkout session.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='inline-flex rounded-md border p-1'>
            <Button
              type='button'
              variant={!isYearly ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </Button>
            <Button
              type='button'
              variant={isYearly ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setIsYearly(true)}
            >
              Yearly
            </Button>
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            <Button onClick={() => handleCheckout('PRO')} disabled={isPending}>
              Upgrade to Pro
            </Button>
            <Button
              variant='outline'
              onClick={() => handleCheckout('TEAM')}
              disabled={isPending}
            >
              Upgrade to Team
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
