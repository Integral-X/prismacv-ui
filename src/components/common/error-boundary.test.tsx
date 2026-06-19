import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "./error-boundary";

jest.mock("@/shared/monitoring/sentry", () => ({
  captureUiException: jest.fn(),
}));

const { captureUiException } = jest.requireMock(
  "@/shared/monitoring/sentry"
) as { captureUiException: jest.Mock };

function Boom(): never {
  throw new Error("kaboom");
}

describe("ErrorBoundary", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // React logs caught render errors to console.error; silence the noise.
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
  });

  it("renders children when nothing throws", () => {
    render(
      <ErrorBoundary boundary="test">
        <span>healthy</span>
      </ErrorBoundary>
    );

    expect(screen.getByText("healthy")).toBeInTheDocument();
  });

  it("shows the default fallback and reports when a child throws", () => {
    render(
      <ErrorBoundary boundary="editor-analyze" label="analysis panel">
        <Boom />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "analysis panel couldn't load"
    );
    expect(captureUiException).toHaveBeenCalledTimes(1);
    expect(captureUiException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ tags: { boundary: "editor-analyze" } })
    );
  });

  it("renders a custom fallback when provided", () => {
    render(
      <ErrorBoundary boundary="t" fallback={<span>custom fallback</span>}>
        <Boom />
      </ErrorBoundary>
    );

    expect(screen.getByText("custom fallback")).toBeInTheDocument();
  });

  it("re-renders the subtree when Try again is clicked", async () => {
    let shouldThrow = true;
    function Flaky() {
      if (shouldThrow) throw new Error("flaky");
      return <span>recovered</span>;
    }
    const user = userEvent.setup();

    render(
      <ErrorBoundary boundary="t" label="widget">
        <Flaky />
      </ErrorBoundary>
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(screen.getByText("recovered")).toBeInTheDocument();
  });
});
