"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <section className="container-shell py-20 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-amber-50 text-amber-600">
        <AlertTriangle size={24} />
      </span>
      <h1 className="mt-5 text-2xl font-black text-slate-950">Something went wrong</h1>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
        The page hit an unexpected error. You can retry without losing the rest of your session.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-indigo-600"
      >
        <RefreshCw size={16} />
        Try again
      </button>
    </section>
  );
}
