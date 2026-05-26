// Generate an ADMIN_PASSWORD_HASH for the admin login.
// Usage:  node scripts/hash-password.mjs 'your-strong-password'
// Paste the output into .env.local (local) and Vercel env (production).
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const pw = process.argv[2];
if (!pw) {
  console.error("usage: node scripts/hash-password.mjs '<password>'");
  process.exit(1);
}
const salt = randomBytes(16).toString("hex");
const dk = await scryptAsync(pw, salt, 64);
console.log(`${salt}:${dk.toString("hex")}`);
