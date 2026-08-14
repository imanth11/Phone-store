"use client";

import Link from "next/link";
import { PackageSearch, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import type { OrderSummary } from "@/types/store";
import { formatPrice } from "@/lib/pricing";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/orders", { cache: "no-store" });
      const data = await response.json();

      if (response.status === 401) {
        setUnauthorized(true);
        return;
      }

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to load orders.");
        return;
      }

      setOrders(data.orders || []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (unauthorized) {
    return (
      <section className="container-shell py-16 text-center">
        <h1 className="text-2xl font-black text-slate-950">Sign in to view your orders</h1>
        <p className="mt-3 text-sm text-slate-500">
          Your purchase history is available after authentication.
        </p>
        <Link
          href="/login?next=/orders"
          className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
        >
          Sign in
        </Link>
      </section>
    );
  }

  return (
    <section className="container-shell py-10 sm:py-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Account</p>
          <h1 className="section-title mt-2">My orders</h1>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-3xl bg-slate-200" />
          ))}
        </div>
      ) : orders.length ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <article key={order._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Order {order._id.slice(-8)}
                  </p>
                  <h2 className="mt-1 text-lg font-black text-slate-950">
                    {order.cartitems.length} {order.cartitems.length === 1 ? "item" : "items"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="sm:text-right">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      order.status === "paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : order.status === "pending_payment"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                  <p className="mt-2 text-xl font-black text-slate-950">
                    {formatPrice(order.amount || 0)}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {order.cartitems.slice(0, 5).map((item) => (
                  <span
                    key={`${order._id}-${item.id}`}
                    className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    {item.name} × {item.qty}
                  </span>
                ))}
                {order.cartitems.length > 5 && (
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-500">
                    +{order.cartitems.length - 5} more
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <PackageSearch className="mx-auto text-slate-400" size={30} />
          <h2 className="mt-4 text-lg font-black text-slate-950">No orders yet</h2>
          <p className="mt-2 text-sm text-slate-500">Your completed purchases will appear here.</p>
          <Link href="/product" className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white">
            Start shopping
          </Link>
        </div>
      )}
    </section>
  );
}
