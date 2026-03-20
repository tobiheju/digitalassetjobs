export default function CompaniesLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Heading + subtitle */}
        <div className="mb-8">
          <div className="h-9 w-48 animate-pulse rounded-md bg-slate-100" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-100 [animation-delay:50ms]" />
        </div>

        {/* Search bar + verified toggle */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100 [animation-delay:100ms]" />
          </div>
          <div className="flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3">
            <div className="size-3.5 animate-pulse rounded bg-slate-100 [animation-delay:150ms]" />
            <div className="h-3.5 w-20 animate-pulse rounded bg-slate-100 [animation-delay:175ms]" />
          </div>
        </div>

        {/* Company cards grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-xl border border-slate-100/60 bg-white p-4"
            >
              {/* Logo — matches CompanyLogo size="lg" (48px) */}
              <div
                className="size-12 shrink-0 animate-pulse rounded-lg bg-slate-100"
                style={{ animationDelay: `${i * 30}ms` }}
              />
              {/* Content */}
              <div className="flex min-w-0 flex-1 flex-col">
                {/* Company name */}
                <div
                  className="h-4 w-3/5 animate-pulse rounded bg-slate-100"
                  style={{ animationDelay: `${i * 30 + 15}ms` }}
                />
                {/* Type */}
                <div
                  className="mt-1 h-3 w-1/4 animate-pulse rounded bg-slate-100"
                  style={{ animationDelay: `${i * 30 + 30}ms` }}
                />
                {/* Description line 1 */}
                <div
                  className="mt-2 h-3 w-full animate-pulse rounded bg-slate-100"
                  style={{ animationDelay: `${i * 30 + 45}ms` }}
                />
                {/* Description line 2 */}
                <div
                  className="mt-1 h-3 w-4/5 animate-pulse rounded bg-slate-100"
                  style={{ animationDelay: `${i * 30 + 60}ms` }}
                />
                {/* Footer: jobs count + website */}
                <div className="mt-auto flex items-center gap-3 pt-2">
                  <div
                    className="h-3 w-12 animate-pulse rounded bg-slate-100"
                    style={{ animationDelay: `${i * 30 + 75}ms` }}
                  />
                  <div
                    className="h-3 w-14 animate-pulse rounded bg-slate-100"
                    style={{ animationDelay: `${i * 30 + 90}ms` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hiring CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-8 md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-lg">
              <div className="h-8 w-72 animate-pulse rounded-md bg-white/10" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10 [animation-delay:50ms]" />
              <div className="mt-1.5 h-4 w-4/5 animate-pulse rounded bg-white/10 [animation-delay:100ms]" />
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="size-7 animate-pulse rounded-md bg-white/10"
                      style={{ animationDelay: `${i * 50 + 150}ms` }}
                    />
                    <div
                      className="h-3 w-24 animate-pulse rounded bg-white/10"
                      style={{ animationDelay: `${i * 50 + 175}ms` }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="h-11 w-36 animate-pulse rounded-lg bg-[#d4a038]/30" />
              <div className="h-11 w-36 animate-pulse rounded-lg bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
