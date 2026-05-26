import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/auth/guard";
import { logout } from "./auth-actions";
import "../globals.css";

export const metadata: Metadata = {
  title: "Moments · Admin",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/collections", label: "Categories" },
  { href: "/admin/reels", label: "Reels" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin();
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream/40 font-sans text-charcoal antialiased">
        {admin && (
          <header className="sticky top-0 z-20 border-b border-blush/50 bg-ivory/90 backdrop-blur">
            <nav className="mx-auto flex max-w-5xl items-center gap-1 px-4 py-3">
              <Link href="/admin" className="me-4 font-semibold text-burgundy">Moments Admin</Link>
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-full px-3 py-1.5 text-sm text-mocha transition hover:bg-blush/30 hover:text-burgundy"
                >
                  {n.label}
                </Link>
              ))}
              <form action={logout} className="ms-auto">
                <button className="rounded-full px-3 py-1.5 text-sm text-mocha transition hover:text-burgundy">
                  Log out
                </button>
              </form>
            </nav>
          </header>
        )}
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
