import { apiClient } from "@/shared/http/api-client";
import { getBillingProfile } from "./queries";
import type { BillingProfileContract } from "./contracts";

jest.mock("@/shared/http/api-client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

jest.mock("@/shared/auth/execute-authenticated-request", () => ({
  executeAuthenticatedRead: jest.fn(
    (callback: (headers: Record<string, string>) => unknown) =>
      callback({ Authorization: "Bearer test-token" })
  ),
}));

const getMock = jest.mocked(apiClient.get);

describe("billing queries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBillingProfile", () => {
    it("fetches the current billing profile with auth headers and maps it", async () => {
      const contract: BillingProfileContract = {
        plan: "PRO",
        stripeCustomerId: "cus_123",
        subscription: null,
        aiQuota: {
          used: 3,
          limit: 50,
          remaining: 47,
          periodEnd: "2026-05-01T00:00:00.000Z",
        },
      };
      getMock.mockResolvedValueOnce(contract);

      const result = await getBillingProfile();

      expect(getMock).toHaveBeenCalledWith("billing/me", {
        headers: { Authorization: "Bearer test-token" },
      });
      expect(result.plan).toBe("pro");
      expect(result.aiQuota.periodEnd).toEqual(
        new Date("2026-05-01T00:00:00.000Z")
      );
    });
  });
});
