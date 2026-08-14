"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/cartcontext";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useCart();

  useEffect(() => {
    let active = true;

    async function signOut() {
      try {
        await fetch("/api/logout", { method: "POST" });
      } finally {
        if (active) {
          logout();
          router.replace("/");
          router.refresh();
        }
      }
    }

    signOut();
    return () => {
      active = false;
    };
  }, [logout, router]);

  return (
    <section className="container-shell py-20 text-center">
      <p className="text-sm font-bold text-slate-500">Signing you out…</p>
    </section>
  );
}
