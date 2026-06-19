const REDACTED = "[Redacted]";

const SENSITIVE_SEGMENTS = [
  "password",
  "token",
  "authorization",
  "cookie",
  "secret",
  "apikey",
  "accessToken",
  "refreshToken",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function shouldRedactKey(key: string): boolean {
  const normalized = key.replace(/[^a-z0-9]/gi, "").toLowerCase();
  return SENSITIVE_SEGMENTS.some((segment) =>
    normalized.includes(segment.toLowerCase())
  );
}

function sanitizeString(value: string): string {
  return value
    .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, `Bearer ${REDACTED}`)
    .replace(/eyJ[A-Za-z0-9_-]+?\.[A-Za-z0-9_-]+?\.[A-Za-z0-9_-]+/g, REDACTED);
}

export function sanitizeLogPayload<T>(value: T, depth = 0): T {
  if (depth > 8) {
    return value;
  }

  if (typeof value === "string") {
    return sanitizeString(value) as T;
  }

  if (
    value === null ||
    value === undefined ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeLogPayload(item, depth + 1)) as T;
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [
      key,
      shouldRedactKey(key)
        ? REDACTED
        : sanitizeLogPayload(entryValue, depth + 1),
    ])
  ) as T;
}
