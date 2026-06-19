import {
  createAutosaveController,
  type AutosaveOptions,
  type AutosaveOutcome,
} from "./autosave-engine";

const SECTION = "personalInfo" as const;

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

function setup(overrides: Partial<AutosaveOptions> = {}) {
  const save = jest.fn<Promise<AutosaveOutcome>, [typeof SECTION]>();
  const onStateChange = jest.fn();
  const onAuthExpired = jest.fn();
  const controller = createAutosaveController({
    save: save as AutosaveOptions["save"],
    onStateChange,
    onAuthExpired,
    debounceMs: 800,
    baseBackoffMs: 500,
    maxAttempts: 5,
    random: () => 0, // deterministic jitter: delay === ceiling / 2
    ...overrides,
  });
  return { save, onStateChange, onAuthExpired, controller };
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("autosave controller", () => {
  it("debounces a burst of edits into a single save", async () => {
    const { save, controller } = setup();
    save.mockResolvedValue({ ok: true });

    controller.schedule(SECTION);
    controller.schedule(SECTION);
    controller.schedule(SECTION);
    await jest.advanceTimersByTimeAsync(800);

    expect(save).toHaveBeenCalledTimes(1);
  });

  it("drives the indicator saving -> saved on success", async () => {
    const { save, onStateChange, controller } = setup();
    save.mockResolvedValue({ ok: true });

    await controller.flush(SECTION);

    expect(onStateChange).toHaveBeenNthCalledWith(1, SECTION, "saving");
    expect(onStateChange).toHaveBeenLastCalledWith(SECTION, "saved");
  });

  it("flush bypasses the debounce and cancels the pending timer", async () => {
    const { save, controller } = setup();
    save.mockResolvedValue({ ok: true });

    controller.schedule(SECTION);
    await controller.flush(SECTION);
    expect(save).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(800);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it("serialises a save and replays one queued edit that lands mid-flight", async () => {
    const { save, controller } = setup();
    const first = deferred<AutosaveOutcome>();
    save.mockReturnValueOnce(first.promise).mockResolvedValueOnce({ ok: true });

    void controller.flush(SECTION); // save #1 in flight
    controller.schedule(SECTION); // edit arrives mid-save
    await jest.advanceTimersByTimeAsync(800); // debounce fires -> queued, not a 2nd PUT
    expect(save).toHaveBeenCalledTimes(1);

    first.resolve({ ok: true });
    await jest.advanceTimersByTimeAsync(0);
    expect(save).toHaveBeenCalledTimes(2);
  });

  it("retries a retryable failure after backoff, then succeeds", async () => {
    const { save, onStateChange, controller } = setup();
    save
      .mockResolvedValueOnce({ ok: false, kind: "retryable" })
      .mockResolvedValueOnce({ ok: true });

    await controller.flush(SECTION);
    expect(save).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(250); // baseBackoff 500, jitter 0 -> 250
    expect(save).toHaveBeenCalledTimes(2);
    expect(onStateChange).toHaveBeenLastCalledWith(SECTION, "saved");
  });

  it("gives up with failed after exhausting max attempts", async () => {
    const { save, onStateChange, controller } = setup({ maxAttempts: 2 });
    save.mockResolvedValue({ ok: false, kind: "retryable" });

    await controller.flush(SECTION); // attempt 1
    await jest.advanceTimersByTimeAsync(250); // attempt 2 -> failed

    expect(save).toHaveBeenCalledTimes(2);
    expect(onStateChange).toHaveBeenLastCalledWith(SECTION, "failed");
  });

  it("does not retry on auth expiry; signals re-auth and keeps the section failed", async () => {
    const { save, onStateChange, onAuthExpired, controller } = setup();
    save.mockResolvedValue({ ok: false, kind: "auth" });

    await controller.flush(SECTION);
    await jest.advanceTimersByTimeAsync(1000);

    expect(save).toHaveBeenCalledTimes(1);
    expect(onAuthExpired).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenLastCalledWith(SECTION, "failed");
  });

  it("retry replays the save after a failure (e.g. post re-auth)", async () => {
    const { save, onStateChange, controller } = setup();
    save
      .mockResolvedValueOnce({ ok: false, kind: "auth" })
      .mockResolvedValueOnce({ ok: true });

    await controller.flush(SECTION);
    expect(onStateChange).toHaveBeenLastCalledWith(SECTION, "failed");

    controller.retry(SECTION);
    await jest.advanceTimersByTimeAsync(0);

    expect(save).toHaveBeenCalledTimes(2);
    expect(onStateChange).toHaveBeenLastCalledWith(SECTION, "saved");
  });

  it("treats a thrown save as a retryable failure", async () => {
    const { save, onStateChange, controller } = setup({ maxAttempts: 1 });
    save.mockRejectedValue(new Error("network down"));

    await controller.flush(SECTION);

    expect(onStateChange).toHaveBeenLastCalledWith(SECTION, "failed");
  });
});
