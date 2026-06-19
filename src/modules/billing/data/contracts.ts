export type BillingPlanContract = "FREE" | "PRO" | "TEAM";

export interface BillingSubscriptionContract {
  id: string;
  status: string;
  planCode: BillingPlanContract;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface BillingQuotaContract {
  used: number;
  limit: number;
  remaining: number;
  periodEnd: string;
}

export interface BillingProfileContract {
  plan: BillingPlanContract;
  stripeCustomerId: string | null;
  subscription: BillingSubscriptionContract | null;
  aiQuota: BillingQuotaContract;
}

export interface CreateCheckoutSessionRequestContract {
  plan: Exclude<BillingPlanContract, "FREE">;
  billingCycle?: "monthly" | "yearly";
}

export interface CheckoutSessionContract {
  sessionId: string;
  url: string;
}

export interface PortalSessionContract {
  url: string;
}
