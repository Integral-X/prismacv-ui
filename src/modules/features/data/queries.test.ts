import { getFeatureFlagList } from "./queries";
import { apiClient } from "@/shared/http/api-client";

jest.mock("@/shared/http/api-client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("getFeatureFlagList", () => {
  it("returns the inner flag array from the features payload", async () => {
    jest.mocked(apiClient.get).mockResolvedValueOnce({
      success: true,
      data: [{ name: "foo", enabled: true }],
      total: 1,
    });

    await expect(getFeatureFlagList()).resolves.toEqual([
      { name: "foo", enabled: true },
    ]);
    expect(apiClient.get).toHaveBeenCalledWith("features");
  });
});
