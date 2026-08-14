"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ShoppingBag, Smartphone, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/app/context/cartcontext";

const mainNav = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/product" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { users, logout, cartCount, hydrated } = useCart();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await fetch("/api/logout", { method: "POST" });
      logout();
      setOpen(false);
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between gap-4 sm:h-18">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-black tracking-tight text-slate-950"
          aria-label="PhoneStore home"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white shadow-sm">
            <Smartphone size={19} aria-hidden="true" />
          </span>
          <span>PhoneStore</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                isActive(item.href)
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/basket"
            className="relative grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
            aria-label={`Shopping cart with ${hydrated ? cartCount : 0} items`}
          >
            <ShoppingBag size={19} aria-hidden="true" />
            {hydrated && cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {users ? (
              <>
                <Link
                  href="/orders"
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  Orders
                </Link>
                {users.role === "admin" && (
                  <Link
                    href="/admin"
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                  >
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loggingOut ? "Signing out…" : "Sign out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-600"
                >
                  Create account
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-navigation" className="border-t border-slate-200 bg-white md:hidden">
          <nav className="container-shell grid gap-1 py-4" aria-label="Mobile navigation">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-3 text-sm font-semibold ${
                  isActive(item.href)
                    ? "bg-slate-950 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {users ? (
              <>
                <Link
                  href="/orders"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  My orders
                </Link>
                {users.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                  >
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="mt-2 rounded-xl bg-slate-950 px-4 py-3 text-left text-sm font-bold text-white disabled:opacity-60"
                >
                  {loggingOut ? "Signing out…" : `Sign out · ${users.name}`}
                </button>
              </>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-800"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
