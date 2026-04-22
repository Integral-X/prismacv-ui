import "server-only";

import { cookies } from "next/headers";
import type { AuthResult, UserProfile } from "./mappers";

const ACCESS_TOKEN_COOKIE = "access-token";
const REFRESH_TOKEN_COOKIE = "refresh-token";
const USER_PROFILE_COOKIE = "user-profile";
const SESSION_PERSISTENT_COOKIE = "session-persistent";

const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 15;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function buildCookieOptions(rememberMe: boolean, maxAge?: number) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    ...(rememberMe && maxAge ? { maxAge } : {}),
  };
}

function serializeUserProfile(user: UserProfile): string {
  return JSON.stringify({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  });
}

export async function persistAuthSession(
  result: AuthResult,
  rememberMe: boolean = false
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    ACCESS_TOKEN_COOKIE,
    result.accessToken,
    buildCookieOptions(rememberMe, ACCESS_TOKEN_MAX_AGE_SECONDS)
  );
  cookieStore.set(
    REFRESH_TOKEN_COOKIE,
    result.refreshToken,
    buildCookieOptions(rememberMe, REFRESH_TOKEN_MAX_AGE_SECONDS)
  );
  cookieStore.set(
    USER_PROFILE_COOKIE,
    serializeUserProfile(result.user),
    buildCookieOptions(rememberMe, REFRESH_TOKEN_MAX_AGE_SECONDS)
  );
  cookieStore.set(
    SESSION_PERSISTENT_COOKIE,
    rememberMe ? "true" : "false",
    buildCookieOptions(rememberMe, REFRESH_TOKEN_MAX_AGE_SECONDS)
  );
}

export async function clearAuthSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(USER_PROFILE_COOKIE);
  cookieStore.delete(SESSION_PERSISTENT_COOKIE);
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export async function shouldPersistSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_PERSISTENT_COOKIE)?.value === "true";
}
