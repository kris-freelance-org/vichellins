export default function AdminLoading() {
  return (
    <div role="status" aria-label="Loading admin page" className="animate-pulse">
      <span className="sr-only">Loading your workspace…</span>
      <div aria-hidden="true">
        <div className="mb-9 space-y-3"><div className="h-8 w-52 rounded-lg bg-line/80" /><div className="h-3 w-64 max-w-full rounded bg-line/60" /></div>
        <div className="mb-6 grid gap-4 @min-[32rem]:grid-cols-2 @min-[58rem]:grid-cols-4">{[1, 2, 3, 4].map(item => <div key={item} className="rounded-2xl border border-line bg-white p-6"><div className="h-3 w-24 rounded bg-line/70" /><div className="mt-5 h-8 w-32 max-w-full rounded-lg bg-line/80" /><div className="mt-4 h-2 w-36 max-w-full rounded bg-line/50" /></div>)}</div>
        <div className="grid gap-5 @min-[54rem]:grid-cols-[1.85fr_1fr]"><div className="h-80 rounded-2xl border border-line bg-white" /><div className="h-80 rounded-2xl border border-line bg-white" /></div>
      </div>
    </div>
  );
}
