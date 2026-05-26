import { SignJWT, jwtVerify } from "jose";

/**
 * Admin session = a short HS256 JWT in an httpOnly cookie. Verification is
 * edge-safe (jose, no Node APIs) so proxy.ts can gate routes. Signing/clearing
 * happens in Node server actions.
 */

export const SESSION_COOKIE = "mm_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secretKey(): Uint8Array | null {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) return null;
  return new TextEncoder().encode(s);
}

export async function createSessionToken(): Promise<string> {
  const key = secretKey();
  if (!key) throw new Error("AUTH_SECRET is not set (min 16 chars)");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

/** True only for a valid, unexpired admin token. Never throws. */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const key = secretKey();
  if (!key || !token) return false;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE,
};
