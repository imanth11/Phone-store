"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import ChatBox from "@/app/components/chatBox";

export default function UserChatWrapper() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchUser() {
      try {
        const response = await fetch("/api/me", {
          cache: "no-store",
          credentials: "include",
        });

        if (!active) return;

        if (!response.ok) {
          setUserId(null);
          return;
        }

        const data = await response.json();
        setUserId(data.success && data.user ? String(data.user.id) : null);
      } catch {
        if (active) setUserId(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchUser();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid h-32 w-72 place-items-center rounded-3xl border border-slate-200 bg-white shadow-xl">
        <Loader2 className="animate-spin text-slate-400" size={22} />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="w-[min(calc(100vw-2rem),340px)] rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
        <h2 className="text-base font-black text-slate-950">Need help?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sign in to start a private support conversation.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-flex w-full justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white hover:bg-indigo-600"
        >
          Sign in to chat
        </Link>
      </div>
    );
  }

  return <ChatBox userId={userId} />;
}
