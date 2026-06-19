import { apiClient } from "@/shared/http/api-client";
import { HttpError } from "@/shared/http/http-error";
import { updateCvLayout } from "./mutations";
import type { SectionLayoutContract } from "./contracts";

jest.mock("@/shared/http/api-client", () => ({
  apiClient: { put: jest.fn() },
  getApiClient: jest.fn(),
}));

jest.mock("@/shared/auth/execute-authenticated-request", () => ({
  executeAuthenticatedRequest: jest.fn(
    (callback: (headers: Record<string, string>) => unknown) =>
      callback({ Authorization: "Bearer test-token" })
  ),
}));

const putMock = jest.mocked(apiClient.put);

describe("updateCvLayout", () => {
  const cvId = "cv_001";
  const layout: SectionLayoutContract = {
    mainOrder: ["summary", "experience"],
    sideOrder: ["skills"],
    hidden: ["certifications"],
    titles: { experience: "Work History" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("PUTs the layout with auth headers and returns the mapped domain layout", async () => {
    putMock.mockResolvedValueOnce(layout);

    const result = await updateCvLayout(cvId, layout);

    expect(putMock).toHaveBeenCalledWith(`cv/${cvId}/layout`, layout, {
      headers: { Authorization: "Bearer test-token" },
    });
    expect(result).toEqual(layout);
  });

  it("returns a copy — does not leak the response reference", async () => {
    const wire: SectionLayoutContract = {
      mainOrder: ["summary"],
      sideOrder: [],
      hidden: [],
      titles: {},
    };
    putMock.mockResolvedValueOnce(wire);

    const result = await updateCvLayout(cvId, wire);

    expect(result.mainOrder).not.toBe(wire.mainOrder);
    expect(result.titles).not.toBe(wire.titles);
  });

  it("rejects an unsafe CV id before calling the API", async () => {
    await expect(updateCvLayout("bad/id", layout)).rejects.toThrow(HttpError);
    expect(putMock).not.toHaveBeenCalled();
  });
});
