import type {
  BillingPlanContract,
  BillingProfileContract,
  BillingQuotaContract,
  BillingSubscriptionContract,
} from "./contracts";

export type BillingPlan = "free" | "pro" | "team";

export interface BillingSubscription {
  id: string;
  status: string;
  planCode: BillingPlan;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

export interface BillingQuota {
  used: number;
  limit: number;
  remaining: number;
  periodEnd: Date;
}

export interface BillingProfile {
  plan: BillingPlan;
  stripeCustomerId: string | null;
  subscription: BillingSubscription | null;
  aiQuota: BillingQuota;
}

function toBillingPlan(plan: BillingPlanContract): BillingPlan {
  if (plan === "PRO") return "pro";
  if (plan === "TEAM") return "team";
  return "free";
}

function toSubscription(
  contract: BillingSubscriptionContract | null
): BillingSubscription | null {
  if (!contract) return null;
  return {
    id: contract.id,
    status: contract.status,
    planCode: toBillingPlan(contract.planCode),
    currentPeriodStart: contract.currentPeriodStart
      ? new Date(contract.currentPeriodStart)
      : null,
    currentPeriodEnd: contract.currentPeriodEnd
      ? new Date(contract.currentPeriodEnd)
      : null,
    cancelAtPeriodEnd: contract.cancelAtPeriodEnd,
  };
}

function toQuota(contract: BillingQuotaContract): BillingQuota {
  return {
    used: contract.used,
    limit: contract.limit,
    remaining: contract.remaining,
    periodEnd: new Date(contract.periodEnd),
  };
}

export function toBillingProfile(
  contract: BillingProfileContract
): BillingProfile {
  return {
    plan: toBillingPlan(contract.plan),
    stripeCustomerId: contract.stripeCustomerId,
    subscription: toSubscription(contract.subscription),
    aiQuota: toQuota(contract.aiQuota),
  };
}
