"use client";

import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function validate() {
    if (name.trim().length < 2) return "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return "";
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to create account.");
        return;
      }

      setSuccess("Account created. Redirecting you to sign in…");
      window.setTimeout(() => router.replace("/login"), 700);
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
          <p className="section-kicker">Get started</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Create account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Save your order history and access support from any signed-in session.
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-2xl bg-rose-50 p-3.5 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}
        {success && (
          <div role="status" className="mb-5 rounded-2xl bg-emerald-50 p-3.5 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={submit} className="grid gap-4">
          <label>
            <span className="mb-1.5 block text-sm font-bold text-slate-700">Name</span>
            <input
              className="form-input"
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
            />
          </label>

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
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={128}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
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

          <label>
            <span className="mb-1.5 block text-sm font-bold text-slate-700">Confirm password</span>
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              placeholder="Repeat your password"
            />
          </label>

          <button
            type="submit"
            disabled={loading || Boolean(success)}
            className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-600 disabled:opacity-60"
          >
            <UserPlus size={17} />
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-black text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
