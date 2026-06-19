import { apiClient } from "@/shared/http/api-client";
import { getCurrentUser } from "./queries";
import type { UserProfileResponseContract } from "./contracts";

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

const userContract: UserProfileResponseContract = {
  id: "user_001",
  email: "jane@example.com",
  name: "Jane Smith",
  role: "REGULAR",
  emailVerified: true,
  avatarUrl: "https://cdn.example.com/avatar.jpg",
  provider: "google",
  createdAt: "2026-01-15T08:00:00.000Z",
  updatedAt: "2026-04-20T16:00:00.000Z",
};

describe("user queries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCurrentUser", () => {
    it("fetches user profile with auth headers and maps to domain type", async () => {
      getMock.mockResolvedValueOnce(userContract);

      const result = await getCurrentUser();

      expect(getMock).toHaveBeenCalledWith("users/me", {
        headers: { Authorization: "Bearer test-token" },
      });
      expect(result).toEqual({
        id: "user_001",
        email: "jane@example.com",
        name: "Jane Smith",
        role: "regular",
        emailVerified: true,
        avatarUrl: "https://cdn.example.com/avatar.jpg",
        provider: "google",
        createdAt: new Date("2026-01-15T08:00:00.000Z"),
        updatedAt: new Date("2026-04-20T16:00:00.000Z"),
      });
    });

    it("maps null optional fields correctly", async () => {
      getMock.mockResolvedValueOnce({
        ...userContract,
        name: null,
        avatarUrl: null,
        provider: null,
      });

      const result = await getCurrentUser();

      expect(result.name).toBeNull();
      expect(result.avatarUrl).toBeNull();
      expect(result.provider).toBeNull();
    });
  });
});
