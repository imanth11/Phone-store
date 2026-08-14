import Link from "next/link";
import { ShieldCheck, Smartphone } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 font-black text-slate-950">
            <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white">
              <Smartphone size={18} aria-hidden="true" />
            </span>
            PhoneStore
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            A focused storefront for phones and essential accessories, designed for
            fast browsing, straightforward checkout, and responsive support.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-950">Shop</h2>
          <div className="mt-4 grid gap-2 text-sm text-slate-500">
            <Link className="hover:text-slate-950" href="/product">All products</Link>
            <Link className="hover:text-slate-950" href="/category/phone">Phones</Link>
            <Link className="hover:text-slate-950" href="/category/headphone">Audio</Link>
            <Link className="hover:text-slate-950" href="/category/charger">Chargers</Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-950">Help</h2>
          <div className="mt-4 grid gap-2 text-sm text-slate-500">
            <Link className="hover:text-slate-950" href="/about">About</Link>
            <Link className="hover:text-slate-950" href="/contact">Contact</Link>
            <Link className="hover:text-slate-950" href="/orders">Order history</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100">
        <div className="container-shell flex flex-col gap-3 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} PhoneStore. All rights reserved.</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} aria-hidden="true" />
            Secure session and server-verified checkout flow
          </span>
        </div>
      </div>
    </footer>
  );
}
