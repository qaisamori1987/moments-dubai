"use client";
import { useActionState } from "react";
import { login, type LoginState } from "../auth-actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <div className="mx-auto mt-16 max-w-sm">
      <div className="rounded-2xl border border-blush/60 bg-ivory p-8 shadow-sm">
        <h1 className="font-semibold text-burgundy">Moments Admin</h1>
        <p className="mt-1 text-sm text-mocha">Enter your password to manage the store.</p>
        <form action={formAction} className="mt-6 space-y-3">
          <input
            type="password"
            name="password"
            autoFocus
            required
            placeholder="Password"
            className="w-full rounded-lg border border-blush/70 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose"
          />
          {state.error && <p className="text-sm text-burgundy">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-burgundy px-4 py-2.5 text-sm text-ivory transition hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Checking…" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
