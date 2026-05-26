import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * scrypt password hashing — no dependencies. Stored form is "salt:hash" (hex).
 * Used only in Node server actions (never on the edge).
 */

const scryptAsync = promisify(scrypt);
const KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const dk = (await scryptAsync(password, salt, KEYLEN)) as Buffer;
  return `${salt}:${dk.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string | undefined): Promise<boolean> {
  if (!stored) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const dk = (await scryptAsync(password, salt, KEYLEN)) as Buffer;
  const hashBuf = Buffer.from(hash, "hex");
  return hashBuf.length === dk.length && timingSafeEqual(hashBuf, dk);
}
