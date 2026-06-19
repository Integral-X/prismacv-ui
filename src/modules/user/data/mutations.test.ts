import { apiClient } from "@/shared/http/api-client";
import { executeAuthenticatedRequest } from "@/shared/auth/execute-authenticated-request";
import { deleteAccount, updateProfile, uploadAvatar } from "./mutations";
import type {
  AvatarUploadResponseContract,
  UserProfileResponseContract,
} from "./contracts";

jest.mock("@/shared/http/api-client", () => ({
  apiClient: {
    patch: jest.fn(),
    postFormData: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("@/shared/auth/execute-authenticated-request", () => ({
  executeAuthenticatedRequest: jest.fn(),
}));

const AUTH_HEADERS = { Authorization: "Bearer test-token" };

function mockAuthRequest(): void {
  jest
    .mocked(executeAuthenticatedRequest)
    .mockImplementation((operation) => operation(AUTH_HEADERS));
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAuthRequest();
});

describe("updateProfile", () => {
  it("calls PATCH users/me with auth headers and returns a UserProfile", async () => {
    const contract = {
      id: "user_123",
      email: "user@example.com",
      name: "Alice",
      role: "REGULAR",
      emailVerified: true,
      avatarUrl: null,
      provider: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    } satisfies UserProfileResponseContract;

    jest.mocked(apiClient.patch).mockResolvedValue(contract);

    const result = await updateProfile({ name: "Alice" });

    expect(apiClient.patch).toHaveBeenCalledWith(
      "users/me",
      { name: "Alice" },
      { headers: AUTH_HEADERS }
    );
    expect(result.name).toBe("Alice");
    expect(result.role).toBe("regular");
  });
});

describe("uploadAvatar", () => {
  it('appends the file as "avatar" and calls postFormData on users/me/avatar', async () => {
    const contract = {
      avatarUrl: "https://cdn.example.com/new-avatar.jpg",
    } satisfies AvatarUploadResponseContract;

    jest.mocked(apiClient.postFormData).mockResolvedValue(contract);

    const file = new File(["image data"], "avatar.png", { type: "image/png" });
    const result = await uploadAvatar(file);

    expect(result).toBe("https://cdn.example.com/new-avatar.jpg");

    const [endpoint, formData, config] = jest.mocked(apiClient.postFormData)
      .mock.calls[0] as [string, FormData, { headers: Record<string, string> }];
    expect(endpoint).toBe("users/me/avatar");
    expect(formData.get("avatar")).toBe(file);
    expect(config.headers).toEqual(AUTH_HEADERS);
  });
});

describe("deleteAccount", () => {
  it("calls DELETE users/me with auth headers", async () => {
    jest.mocked(apiClient.delete).mockResolvedValue(undefined);

    await deleteAccount();

    expect(apiClient.delete).toHaveBeenCalledWith("users/me", {
      headers: AUTH_HEADERS,
    });
  });
});
