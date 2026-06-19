import { apiClient } from "@/shared/http/api-client";
import type {
  CheckoutSessionContract,
  PortalSessionContract,
} from "./contracts";
import { createCheckoutSession, createPortalSession } from "./mutations";

jest.mock("@/shared/http/api-client", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

jest.mock("@/shared/auth/execute-authenticated-request", () => ({
  executeAuthenticatedRequest: jest.fn(
    (callback: (headers: Record<string, string>) => unknown) =>
      callback({ Authorization: "Bearer test-token" })
  ),
}));

const postMock = jest.mocked(apiClient.post);
const authHeaders = { Authorization: "Bearer test-token" };

describe("billing mutations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCheckoutSession", () => {
    it("posts to the checkout-session endpoint and returns the session", async () => {
      const session = {
        sessionId: "cs_001",
        url: "https://checkout.stripe.com/cs_001",
      } satisfies CheckoutSessionContract;
      postMock.mockResolvedValueOnce(session);

      const result = await createCheckoutSession({
        plan: "PRO",
        billingCycle: "yearly",
      });

      expect(postMock).toHaveBeenCalledWith(
        "billing/checkout-session",
        { plan: "PRO", billingCycle: "yearly" },
        { headers: authHeaders }
      );
      expect(result.sessionId).toBe("cs_001");
      expect(result.url).toBe("https://checkout.stripe.com/cs_001");
    });

    it("forwards the plan without a billing cycle when omitted", async () => {
      postMock.mockResolvedValueOnce({
        sessionId: "cs_002",
        url: "https://checkout.stripe.com/cs_002",
      } satisfies CheckoutSessionContract);

      await createCheckoutSession({ plan: "TEAM" });

      expect(postMock).toHaveBeenCalledWith(
        "billing/checkout-session",
        { plan: "TEAM" },
        { headers: authHeaders }
      );
    });
  });

  describe("createPortalSession", () => {
    it("posts an empty body to the portal-session endpoint and returns the url", async () => {
      const session = {
        url: "https://billing.stripe.com/portal/session_001",
      } satisfies PortalSessionContract;
      postMock.mockResolvedValueOnce(session);

      const result = await createPortalSession();

      expect(postMock).toHaveBeenCalledWith(
        "billing/portal-session",
        {},
        { headers: authHeaders }
      );
      expect(result.url).toBe("https://billing.stripe.com/portal/session_001");
    });
  });
});
