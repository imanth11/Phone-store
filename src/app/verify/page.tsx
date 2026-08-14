"use client";

import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/cartcontext";

type VerifyState = "loading" | "success" | "cancelled" | "error";

export default function VerifyPage() {
  const { clearCart } = useCart();
  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("Verifying your payment…");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");

    if (status !== "OK" || !authority) {
      setState("cancelled");
      setMessage("Payment was cancelled or not completed.");
      return;
    }

    let active = true;

    async function verify() {
      try {
        const response = await fetch(
          `/api/payment/verify?Authority=${encodeURIComponent(authority!)}`,
          { cache: "no-store" },
        );
        const data = await response.json();

        if (!active) return;

        if (response.ok && data.success) {
          clearCart();
          setOrderId(data.orderId || "");
          setState("success");
          setMessage("Payment verified and your order is confirmed.");
          return;
        }

        setState("error");
        setMessage(data.message || "Payment could not be verified.");
      } catch {
        if (active) {
          setState("error");
          setMessage("Network error while verifying the payment.");
        }
      }
    }

    verify();
    return () => {
      active = false;
    };
  }, [clearCart]);

  const Icon =
    state === "success" ? CheckCircle2 : state === "loading" ? Loader2 : XCircle;

  return (
    <section className="container-shell py-16 sm:py-24">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-7 text-center shadow-xl shadow-slate-200/40 sm:p-10">
        <span
          className={`mx-auto grid size-16 place-items-center rounded-2xl ${
            state === "success"
              ? "bg-emerald-50 text-emerald-600"
              : state === "loading"
                ? "bg-indigo-50 text-indigo-600"
                : "bg-rose-50 text-rose-600"
          }`}
        >
          <Icon
            size={28}
            className={state === "loading" ? "animate-spin" : ""}
            aria-hidden="true"
          />
        </span>

        <h1 className="mt-6 text-2xl font-black text-slate-950">
          {state === "loading"
            ? "Checking payment"
            : state === "success"
              ? "Payment successful"
              : state === "cancelled"
                ? "Payment cancelled"
                : "Verification failed"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>

        {orderId && (
          <p className="mt-3 text-xs font-semibold text-slate-400">
            Order ID: {orderId}
          </p>
        )}

        {state !== "loading" && (
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            {state === "success" && (
              <Link
                href="/orders"
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-indigo-600"
              >
                View my orders
              </Link>
            )}
            <Link
              href={state === "success" ? "/product" : "/basket"}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-800 hover:bg-slate-50"
            >
              {state === "success" ? "Continue shopping" : "Back to cart"}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
