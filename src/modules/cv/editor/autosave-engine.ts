import type { SectionKey } from './editor-model';
import type { SaveState } from './editor-store';

/**
 * Autosave controller for the CV editor.
 *
 * Guarantees (see the editor plan, Phase 2):
 *  - Debounced  — bursts of edits to a section collapse into one save.
 *  - Serialised — never two in-flight PUTs for the same section; an edit that
 *    lands mid-save queues exactly one follow-up save.
 *  - Resilient  — retryable failures back off exponentially with jitter up to a
 *    max attempt count, then surface `failed` for a manual retry.
 *  - Safe       — the dirty buffer is owned by the store and is never dropped
 *    here. Auth expiry surfaces `failed` + an `onAuthExpired` signal so the
 *    caller can re-authenticate and `retry()` (replay), rather than losing work.
 *
 * The controller is pure orchestration: persistence, store mutation, and the
 * re-auth flow are injected, which keeps it unit-testable without React or the
 * network.
 */

export type AutosaveOutcome =
  | { ok: true }
  | { ok: false; kind: 'auth' | 'retryable' | 'fatal' };

export interface AutosaveOptions {
  /** Persist a section (whole-array PUT — idempotent, so replay is safe). */
  save: (section: SectionKey) => Promise<AutosaveOutcome>;
  /** Drive the per-section save indicator. */
  onStateChange: (section: SectionKey, state: SaveState) => void;
  /** Called when a save fails because the session expired. */
  onAuthExpired?: () => void;
  debounceMs?: number;
  maxAttempts?: number;
  baseBackoffMs?: number;
  maxBackoffMs?: number;
  /** Injectable RNG for deterministic jitter in tests. */
  random?: () => number;
}

export interface AutosaveController {
  /** Debounced save after the configured idle window. */
  schedule(section: SectionKey): void;
  /** Save immediately, bypassing debounce; resolves when the attempt settles. */
  flush(section: SectionKey): Promise<void>;
  /** Reset the attempt counter and save now (manual retry / post-re-auth replay). */
  retry(section: SectionKey): void;
  /** Clear all pending timers. Call on unmount. */
  dispose(): void;
}

interface SectionRuntime {
  debounceTimer?: ReturnType<typeof setTimeout>;
  backoffTimer?: ReturnType<typeof setTimeout>;
  inFlight: boolean;
  pending: boolean;
  attempts: number;
}

const DEFAULT_DEBOUNCE_MS = 800;
const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_BASE_BACKOFF_MS = 500;
const DEFAULT_MAX_BACKOFF_MS = 15_000;

export function createAutosaveController(
  options: AutosaveOptions
): AutosaveController {
  const debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS;
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const baseBackoffMs = options.baseBackoffMs ?? DEFAULT_BASE_BACKOFF_MS;
  const maxBackoffMs = options.maxBackoffMs ?? DEFAULT_MAX_BACKOFF_MS;
  const random = options.random ?? Math.random;

  const runtimes = new Map<SectionKey, SectionRuntime>();

  function runtimeFor(section: SectionKey): SectionRuntime {
    let runtime = runtimes.get(section);
    if (!runtime) {
      runtime = { inFlight: false, pending: false, attempts: 0 };
      runtimes.set(section, runtime);
    }
    return runtime;
  }

  function backoffDelay(attempts: number): number {
    const ceiling = Math.min(maxBackoffMs, baseBackoffMs * 2 ** (attempts - 1));
    // Full-jitter half: [ceiling/2, ceiling) — avoids synchronised retry storms.
    return ceiling / 2 + random() * (ceiling / 2);
  }

  async function run(section: SectionKey): Promise<void> {
    const runtime = runtimeFor(section);

    if (runtime.inFlight) {
      runtime.pending = true;
      return;
    }

    runtime.inFlight = true;
    runtime.pending = false;
    options.onStateChange(section, 'saving');

    let outcome: AutosaveOutcome;
    try {
      outcome = await options.save(section);
    } catch {
      outcome = { ok: false, kind: 'retryable' };
    }

    runtime.inFlight = false;

    if (outcome.ok) {
      runtime.attempts = 0;
      options.onStateChange(section, 'saved');
      if (runtime.pending) void run(section);
      return;
    }

    if (outcome.kind === 'auth') {
      options.onStateChange(section, 'failed');
      options.onAuthExpired?.();
      return;
    }

    if (outcome.kind === 'fatal') {
      options.onStateChange(section, 'failed');
      return;
    }

    runtime.attempts += 1;
    if (runtime.attempts >= maxAttempts) {
      options.onStateChange(section, 'failed');
      return;
    }

    runtime.backoffTimer = setTimeout(() => {
      void run(section);
    }, backoffDelay(runtime.attempts));
  }

  return {
    schedule(section) {
      const runtime = runtimeFor(section);
      if (runtime.debounceTimer) clearTimeout(runtime.debounceTimer);
      runtime.debounceTimer = setTimeout(() => {
        runtime.debounceTimer = undefined;
        void run(section);
      }, debounceMs);
    },

    flush(section) {
      const runtime = runtimeFor(section);
      if (runtime.debounceTimer) {
        clearTimeout(runtime.debounceTimer);
        runtime.debounceTimer = undefined;
      }
      return run(section);
    },

    retry(section) {
      const runtime = runtimeFor(section);
      if (runtime.backoffTimer) {
        clearTimeout(runtime.backoffTimer);
        runtime.backoffTimer = undefined;
      }
      runtime.attempts = 0;
      void run(section);
    },

    dispose() {
      for (const runtime of runtimes.values()) {
        if (runtime.debounceTimer) clearTimeout(runtime.debounceTimer);
        if (runtime.backoffTimer) clearTimeout(runtime.backoffTimer);
      }
      runtimes.clear();
    },
  };
}
