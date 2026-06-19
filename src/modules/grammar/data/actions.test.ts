import { checkGrammar } from "./mutations";
import { checkGrammarAction } from "./actions";
import type { GrammarCheckResult } from "./mappers";
import { HttpError } from "@/shared/http/http-error";

jest.mock("./mutations", () => ({ checkGrammar: jest.fn() }));

const mockResult: GrammarCheckResult = {
  score: 92,
  issues: [
    {
      type: "grammar",
      message: "Possible typo",
      suggestion: "the",
      startIndex: 0,
      endIndex: 3,
      severity: "warning",
    },
  ],
  summary: "Minor issues found.",
};

beforeEach(() => jest.clearAllMocks());

describe("checkGrammarAction", () => {
  it("returns ok:true with grammar check result on success", async () => {
    jest.mocked(checkGrammar).mockResolvedValue(mockResult);

    const result = await checkGrammarAction({ text: "Check teh text." });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(mockResult);
  });

  it("returns ok:false with code:unauthorized on a 401", async () => {
    jest
      .mocked(checkGrammar)
      .mockRejectedValue(new HttpError(401, "Unauthorized", "Session expired"));

    const result = await checkGrammarAction({ text: "text" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("unauthorized");
      expect(result.message).toBe("Session expired");
    }
  });

  it("returns ok:false with code:unknown for non-HTTP errors", async () => {
    jest.mocked(checkGrammar).mockRejectedValue(new Error("timeout"));

    const result = await checkGrammarAction({ text: "text" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("unknown");
  });
});
