"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/cartcontext";
import { formatPrice, getDiscountedUnitPrice } from "@/lib/pricing";
import ProductImage from "@/app/components/ProductImage";

export default function BasketPage() {
  const router = useRouter();
  const {
    cartitems,
    users,
    hydrated,
    subtotal,
    Remove,
    increase,
    descrease,
  } = useCart();

  const [discountCode, setDiscountCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [quotedTotal, setQuotedTotal] = useState<number | null>(null);
  const [quotedDiscount, setQuotedDiscount] = useState(0);
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const finalPrice = quotedTotal ?? subtotal;
  const discountAmount = quotedDiscount;

  useEffect(() => {
    setAppliedCode("");
    setQuotedTotal(null);
    setQuotedDiscount(0);
    setDiscountError("");
  }, [cartitems]);

  async function applyDiscount() {
    setDiscountError("");
    const trimmed = discountCode.trim();

    if (!trimmed) {
      setAppliedCode("");
      setQuotedTotal(null);
      setQuotedDiscount(0);
      return;
    }

    try {
      setApplyingDiscount(true);
      const response = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartitems: cartitems.map(({ id, qty }) => ({ id, qty })),
          discountCode: trimmed,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setDiscountError(data.message || "Unable to validate discount code.");
        return;
      }

      if (!data.discountValid) {
        setAppliedCode("");
        setQuotedTotal(null);
        setQuotedDiscount(0);
        setDiscountError("That discount code is not valid.");
        return;
      }

      setAppliedCode(trimmed);
      setQuotedTotal(Number(data.total));
      setQuotedDiscount(Number(data.discountAmount || 0));
    } catch {
      setDiscountError("Unable to validate discount code right now.");
    } finally {
      setApplyingDiscount(false);
    }
  }

  async function checkout() {
    setCheckoutError("");

    if (!users) {
      router.push("/login?next=/basket");
      return;
    }

    try {
      setCheckingOut(true);
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartitems: cartitems.map(({ id, qty }) => ({ id, qty })),
          discountCode: appliedCode,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.url) {
        setCheckoutError(data.message || "Unable to start checkout.");
        return;
      }

      window.location.assign(data.url);
    } catch {
      setCheckoutError("Network error. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  }

  if (!hydrated) {
    return (
      <section className="container-shell py-12">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-200" aria-label="Loading cart" />
      </section>
    );
  }

  if (!cartitems.length) {
    return (
      <section className="container-shell py-16 sm:py-24">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-700">
            <ShoppingBag size={24} aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-black text-slate-950">Your cart is empty</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Add a product to your cart and it will stay available on this device.
          </p>
          <Link
            href="/product"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-indigo-600"
          >
            Browse products
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-shell py-10 sm:py-14">
      <div className="mb-8">
        <p className="section-kicker">Checkout</p>
        <h1 className="section-title mt-2">Shopping cart</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {cartitems.map((item) => (
            <article
              key={item.id}
              className="grid grid-cols-[96px_1fr] gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr]"
            >
              <Link
                href={`/product/${item.id}`}
                className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100"
              >
                <ProductImage src={item.image} alt={item.name} className="p-2" />
              </Link>

              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                      {item.range}
                    </p>
                    <Link
                      href={`/product/${item.id}`}
                      className="mt-1 block truncate text-base font-black text-slate-950 hover:text-indigo-600 sm:text-lg"
                    >
                      {item.name}
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => Remove(item)}
                    className="grid size-9 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <p className="mt-3 font-black text-slate-950">
                  {formatPrice(getDiscountedUnitPrice(item) * item.qty)}
                </p>

                <div className="mt-4 inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => descrease(item)}
                    className="grid size-8 place-items-center rounded-lg text-slate-700 hover:bg-white"
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    <Minus size={15} />
                  </button>
                  <span className="min-w-9 text-center text-sm font-black">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => increase(item)}
                    className="grid size-8 place-items-center rounded-lg bg-slate-950 text-white hover:bg-indigo-600"
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 sm:p-6">
          <h2 className="text-lg font-black text-slate-950">Order summary</h2>

          <div className="mt-5">
            <label htmlFor="discount" className="text-sm font-bold text-slate-700">
              Discount code
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="discount"
                value={discountCode}
                onChange={(event) => setDiscountCode(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") applyDiscount();
                }}
                className="form-input"
                placeholder="Enter code"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={applyDiscount}
                disabled={applyingDiscount}
                className="rounded-xl border border-slate-200 px-4 text-sm font-black text-slate-800 hover:bg-slate-50"
              >
                {applyingDiscount ? "Checking…" : "Apply"}
              </button>
            </div>
            {discountError && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                <XCircle size={14} />
                {discountError}
              </p>
            )}
            {appliedCode && !discountError && (
              <p className="mt-2 text-xs font-semibold text-emerald-600">
                Discount code applied.
              </p>
            )}
          </div>

          <dl className="mt-6 grid gap-3 border-t border-slate-100 pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Subtotal</dt>
              <dd className="font-bold text-slate-950">{formatPrice(subtotal)}</dd>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Discount</dt>
                <dd className="font-bold text-emerald-600">−{formatPrice(discountAmount)}</dd>
              </div>
            )}
            <div className="mt-2 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
              <dt className="font-black text-slate-950">Total</dt>
              <dd className="text-2xl font-black text-slate-950">{formatPrice(finalPrice)}</dd>
            </div>
          </dl>

          {checkoutError && (
            <div role="alert" className="mt-5 rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">
              {checkoutError}
            </div>
          )}

          {!users && (
            <p className="mt-5 rounded-2xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              You’ll be asked to sign in before payment.
            </p>
          )}

          <button
            type="button"
            onClick={checkout}
            disabled={checkingOut}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-600 disabled:opacity-60"
          >
            {checkingOut ? "Starting checkout…" : "Continue to payment"}
            {!checkingOut && <ArrowRight size={16} />}
          </button>
        </aside>
      </div>
    </section>
  );
}
