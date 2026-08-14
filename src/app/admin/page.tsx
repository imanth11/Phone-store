"use client";

import Link from "next/link";
import { MessageCircle, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { OrderSummary } from "@/types/store";
import { formatPrice, getDiscountedUnitPrice } from "@/lib/pricing";

export default function AdminPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/orders?scope=all", { cache: "no-store" });
      const data = await response.json();

      if (response.status === 403 || response.status === 401) {
        setForbidden(true);
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

  async function removeOrder(orderId: string) {
    if (!window.confirm("Delete this order permanently?")) return;

    try {
      setDeletingId(orderId);
      const response = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to delete order.");
        return;
      }

      setOrders((current) => current.filter((order) => order._id !== orderId));
    } catch {
      setError("Network error while deleting order.");
    } finally {
      setDeletingId("");
    }
  }

  if (forbidden) {
    return (
      <section className="container-shell py-20 text-center">
        <h1 className="text-2xl font-black text-slate-950">Admin access required</h1>
        <p className="mt-3 text-sm text-slate-500">
          This area is restricted to authorized administrators.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white">
          Back to store
        </Link>
      </section>
    );
  }

  const paidRevenue = orders
    .filter((order) => order.status === "paid")
    .reduce((sum, order) => sum + Number(order.amount || 0), 0);

  return (
    <section className="container-shell py-10 sm:py-14">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker">Administration</p>
          <h1 className="section-title mt-2">Orders dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href="/adminchat"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <MessageCircle size={15} />
            Support inbox
          </Link>
          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Orders</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Paid</p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {orders.filter((order) => order.status === "paid").length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Revenue</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{formatPrice(paidRevenue)}</p>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-3xl bg-slate-200" />
          ))}
        </div>
      ) : orders.length ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <article key={order._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Order {order._id}
                  </p>
                  <h2 className="mt-2 text-lg font-black text-slate-950">
                    {order.user?.name || "Customer"}
                  </h2>
                  <p className="text-sm text-slate-500">{order.user?.email || "No email"}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {order.status.replace("_", " ")}
                  </span>
                  <p className="mt-2 text-xl font-black text-slate-950">{formatPrice(order.amount || 0)}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-2 border-t border-slate-100 pt-4">
                {order.cartitems.map((item) => (
                  <div key={`${order._id}-${item.id}`} className="flex justify-between gap-3 text-sm">
                    <span className="text-slate-600">{item.name} × {item.qty}</span>
                    <span className="font-bold text-slate-950">{formatPrice(getDiscountedUnitPrice(item) * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => removeOrder(order._id)}
                  disabled={deletingId === order._id}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                >
                  <Trash2 size={15} />
                  {deletingId === order._id ? "Deleting…" : "Delete order"}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
          No orders found.
        </div>
      )}
    </section>
  );
}
