"use client";

import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/app/context/cartcontext";

export default function LoginPage() {
  const router = useRouter();
  const { login, users } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextPath, setNextPath] = useState("/product");

  useEffect(() => {
    const savedEmail = window.localStorage.getItem("login-email");
    if (savedEmail) setEmail(savedEmail);

    const requestedNext = new URLSearchParams(window.location.search).get("next");
    if (requestedNext?.startsWith("/") && !requestedNext.startsWith("//")) {
      setNextPath(requestedNext);
    }
  }, []);

  useEffect(() => {
    if (users) {
      router.replace(nextPath);
    }
  }, [users, router, nextPath]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to sign in.");
        return;
      }

      if (rememberEmail) {
        window.localStorage.setItem("login-email", email.trim());
      } else {
        window.localStorage.removeItem("login-email");
      }

      login(data.user);
      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-shell py-12 sm:py-20">
      <div className="mx-auto max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8">
        <div className="mb-7">
          <p className="section-kicker">Welcome back</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Sign in</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Access your cart, orders and customer support.
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-2xl bg-rose-50 p-3.5 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="grid gap-4">
          <label>
            <span className="mb-1.5 block text-sm font-bold text-slate-700">Email</span>
            <input
              className="form-input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-bold text-slate-700">Password</span>
            <div className="relative">
              <input
                className="form-input pr-11"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={rememberEmail}
              onChange={(event) => setRememberEmail(event.target.checked)}
              className="size-4 rounded border-slate-300"
            />
            Remember my email on this device
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-600 disabled:opacity-60"
          >
            <LogIn size={17} />
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to PhoneStore?{" "}
          <Link href="/signup" className="font-black text-indigo-600 hover:text-indigo-700">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
