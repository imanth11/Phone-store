import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-shell py-20 text-center sm:py-28">
      <p className="section-kicker">404</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Page not found</h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500">
        The page you requested may have moved or no longer exists.
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-indigo-600">
          Back home
        </Link>
        <Link href="/product" className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 hover:bg-slate-50">
          Browse products
        </Link>
      </div>
    </section>
  );
}
