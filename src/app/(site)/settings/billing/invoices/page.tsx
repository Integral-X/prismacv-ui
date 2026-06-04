import { getBillingProfile } from '@/modules/billing/data/queries';

import { BillingInvoicesPageClient } from './billing-invoices-page-client';

export const dynamic = 'force-dynamic';

export default async function BillingInvoicesPage() {
  const billing = await getBillingProfile();
  return <BillingInvoicesPageClient billing={billing} />;
}
