export default function Loading() {
  return (
    <section className="container-shell py-12" aria-label="Loading page">
      <div className="mb-8 h-8 w-48 animate-pulse rounded-xl bg-slate-200" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="aspect-square animate-pulse bg-slate-200" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />
              <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
