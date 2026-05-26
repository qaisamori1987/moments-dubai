"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  // Constant-ish delay to blunt brute-force attempts.
  await new Promise((r) => setTimeout(r, 400));
  if (!process.env.AUTH_SECRET) return { error: "Server not configured (AUTH_SECRET missing)." };
  const ok = await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH);
  if (!ok) return { error: "Incorrect password." };
  const token = await createSessionToken();
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
