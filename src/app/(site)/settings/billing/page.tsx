import { getBillingProfile } from "@/modules/billing/data/queries";
import { BillingPageClient } from "./billing-page-client";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const billing = await getBillingProfile();
  return <BillingPageClient billing={billing} />;
}
