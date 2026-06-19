import * as Sentry from "@sentry/nextjs";
import { sanitizeLogPayload } from "@/shared/logger/sanitize-log-payload";

type PrimitiveTag = string | number | boolean;

interface CaptureContext {
  tags?: Record<string, PrimitiveTag>;
  extra?: Record<string, unknown>;
}

let isInitialized = false;

function parseSampleRate(
  rawValue: string | undefined,
  fallback: number
): number {
  if (!rawValue) return fallback;
  const parsed = Number.parseFloat(rawValue);
  if (Number.isNaN(parsed)) return fallback;
  if (parsed < 0) return 0;
  if (parsed > 1) return 1;
  return parsed;
}

function getClientDsn(): string | undefined {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
  return dsn && dsn.length > 0 ? dsn : undefined;
}

export function initializeSentry(): boolean {
  if (isInitialized) {
    return true;
  }

  const dsn = getClientDsn();
  if (!dsn) {
    return false;
  }

  Sentry.init({
    dsn,
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    tracesSampleRate: parseSampleRate(
      process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
      0.1
    ),
    sendDefaultPii: false,
  });

  isInitialized = true;
  return true;
}

export function captureUiException(
  exception: unknown,
  context?: CaptureContext
): void {
  initializeSentry();

  const error =
    exception instanceof Error
      ? exception
      : new Error(
          typeof exception === "string" ? exception : "Unknown UI error"
        );

  Sentry.withScope((scope) => {
    if (context?.tags) {
      for (const [key, value] of Object.entries(context.tags)) {
        scope.setTag(key, String(value));
      }
    }

    if (context?.extra) {
      scope.setContext("extra", sanitizeLogPayload(context.extra));
    }

    Sentry.captureException(error);
  });
}
