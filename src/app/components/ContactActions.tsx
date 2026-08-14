"use client";

import Link from "next/link";
import { MessageCircle, PackageSearch, UserRound } from "lucide-react";
import { useGlobalContext } from "@/app/context/GlobalProvider";
import { useCart } from "@/app/context/cartcontext";

export default function ContactActions() {
  const { setchatOpen } = useGlobalContext();
  const { users } = useCart();

  return (
    <div className="mt-9 grid gap-4 md:grid-cols-3">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <MessageCircle size={22} className="text-indigo-600" />
        <h2 className="mt-5 text-lg font-black text-slate-950">Support chat</h2>
        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
          Ask questions directly inside PhoneStore.
        </p>
        {users ? (
          <button
            type="button"
            onClick={() => setchatOpen(true)}
            className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-indigo-600"
          >
            Open chat
          </button>
        ) : (
          <Link
            href="/login?next=/contact"
            className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-indigo-600"
          >
            Sign in to chat
          </Link>
        )}
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <PackageSearch size={22} className="text-indigo-600" />
        <h2 className="mt-5 text-lg font-black text-slate-950">Existing order</h2>
        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
          Review order status and purchase details from your account.
        </p>
        <Link
          href="/orders"
          className="mt-5 inline-flex rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-800 hover:bg-slate-50"
        >
          View orders
        </Link>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <UserRound size={22} className="text-indigo-600" />
        <h2 className="mt-5 text-lg font-black text-slate-950">Account access</h2>
        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
          Sign in or create an account before using private support.
        </p>
        <Link
          href={users ? "/orders" : "/signup"}
          className="mt-5 inline-flex rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-800 hover:bg-slate-50"
        >
          {users ? "My account" : "Create account"}
        </Link>
      </article>
    </div>
  );
}
