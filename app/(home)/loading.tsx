export default function HomeLoading() {
  return (
    <div className="overflow-hidden">
      {/* Hero skeleton */}
      <section className="relative bg-gradient-to-b from-white to-[#1a365d]/[0.02] pb-16 pt-12 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto h-12 w-96 max-w-full animate-pulse rounded-md bg-slate-100" />
            <div className="mx-auto mt-4 h-5 w-80 max-w-full animate-pulse rounded-md bg-slate-100 [animation-delay:50ms]" />
            <div className="mx-auto mt-8 flex max-w-md gap-2">
              <div className="h-11 flex-1 animate-pulse rounded-lg bg-slate-100 [animation-delay:100ms]" />
              <div className="h-11 w-24 animate-pulse rounded-lg bg-[#d4a038]/20 [animation-delay:150ms]" />
            </div>
            <div className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-2 md:gap-4">
              <div className="h-5 w-14 animate-pulse rounded bg-slate-100 [animation-delay:200ms]" />
              <div className="h-6 w-24 animate-pulse rounded-md bg-slate-50 [animation-delay:250ms]" />
              <div className="h-6 w-20 animate-pulse rounded-md bg-slate-50 [animation-delay:300ms]" />
              <div className="h-6 w-16 animate-pulse rounded-md bg-slate-50 [animation-delay:350ms]" />
              <div className="h-6 w-20 animate-pulse rounded-md bg-slate-50 [animation-delay:400ms]" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar skeleton */}
      <section className="mx-auto -mt-8 max-w-6xl px-4 md:-mt-12 md:px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-100/80 bg-slate-100/60 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 bg-white px-5 py-5 md:px-6 md:py-6">
              <div className="size-9 shrink-0 animate-pulse rounded-lg bg-slate-100" style={{ animationDelay: `${i * 50}ms` }} />
              <div>
                <div className="h-6 w-16 animate-pulse rounded bg-slate-100" style={{ animationDelay: `${i * 50 + 25}ms` }} />
                <div className="mt-1 h-3 w-20 animate-pulse rounded bg-slate-100" style={{ animationDelay: `${i * 50 + 50}ms` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Companies skeleton */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="text-center">
          <div className="mx-auto h-3 w-16 animate-pulse rounded bg-[#d4a038]/20" />
          <div className="mx-auto mt-2 h-8 w-72 animate-pulse rounded-md bg-slate-100 [animation-delay:50ms]" />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="size-12 animate-pulse rounded-lg bg-slate-100" style={{ animationDelay: `${i * 30}ms` }} />
                <div className="h-3 w-16 animate-pulse rounded bg-slate-100" style={{ animationDelay: `${i * 30 + 15}ms` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors skeleton */}
      <section className="bg-[#1a365d]/[0.02] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center">
            <div className="mx-auto h-3 w-14 animate-pulse rounded bg-[#d4a038]/20" />
            <div className="mx-auto mt-2 h-8 w-48 animate-pulse rounded-md bg-slate-100 [animation-delay:50ms]" />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2.5 rounded-xl border border-slate-100/80 bg-white px-4 py-5">
                <div className="size-10 animate-pulse rounded-lg bg-slate-100" style={{ animationDelay: `${i * 40}ms` }} />
                <div className="h-3.5 w-16 animate-pulse rounded bg-slate-100" style={{ animationDelay: `${i * 40 + 20}ms` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent jobs skeleton */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div>
          <div className="h-3 w-12 animate-pulse rounded bg-[#d4a038]/20" />
          <div className="mt-2 h-8 w-56 animate-pulse rounded-md bg-slate-100 [animation-delay:50ms]" />
        </div>
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-100/80 bg-white p-4">
              <div className="flex gap-4">
                <div className="size-9 shrink-0 animate-pulse rounded-lg bg-slate-100" style={{ animationDelay: `${i * 50}ms` }} />
                <div className="flex-1">
                  <div className="h-[18px] w-3/5 animate-pulse rounded bg-slate-100" style={{ animationDelay: `${i * 50 + 25}ms` }} />
                  <div className="mt-1.5 h-3.5 w-1/4 animate-pulse rounded bg-slate-100" style={{ animationDelay: `${i * 50 + 50}ms` }} />
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-14 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
