export default function SalariesLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header row: title + personalize button */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="h-9 w-56 animate-pulse rounded-md bg-slate-100" />
            <div className="mt-2 h-4 w-80 animate-pulse rounded-md bg-slate-100 [animation-delay:50ms]" />
          </div>
          <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-100 [animation-delay:100ms]" />
        </div>

        {/* Calculator card */}
        <div className="rounded-xl border border-slate-100/80 bg-white p-6">
          {/* Filter row: 3 dropdowns */}
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div
                  className="h-10 w-full animate-pulse rounded-lg bg-slate-100"
                  style={{ animationDelay: `${i * 50 + 100}ms` }}
                />
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-slate-100" />

          {/* Stats: Low / Median / High */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="mx-auto h-3 w-8 animate-pulse rounded bg-slate-100 [animation-delay:200ms]" />
              <div className="mx-auto mt-2 h-7 w-24 animate-pulse rounded bg-slate-100 [animation-delay:225ms]" />
            </div>
            <div className="text-center">
              <div className="mx-auto h-3 w-12 animate-pulse rounded bg-[#d4a038]/20 [animation-delay:250ms]" />
              <div className="mx-auto mt-2 h-9 w-32 animate-pulse rounded bg-slate-100 [animation-delay:275ms]" />
            </div>
            <div className="text-center">
              <div className="mx-auto h-3 w-8 animate-pulse rounded bg-slate-100 [animation-delay:300ms]" />
              <div className="mx-auto mt-2 h-7 w-24 animate-pulse rounded bg-slate-100 [animation-delay:325ms]" />
            </div>
          </div>

          {/* "Based on X positions" */}
          <div className="mt-4 flex justify-center">
            <div className="h-3 w-36 animate-pulse rounded bg-slate-100 [animation-delay:350ms]" />
          </div>

          {/* Range bar */}
          <div className="mt-6">
            <div className="h-3 w-full animate-pulse rounded-full bg-slate-100 [animation-delay:375ms]" />
            <div className="mt-2 flex justify-between">
              <div className="h-3 w-16 animate-pulse rounded bg-slate-100 [animation-delay:400ms]" />
              <div className="h-3 w-16 animate-pulse rounded bg-slate-100 [animation-delay:425ms]" />
            </div>
          </div>
        </div>

        {/* Salary by Sector chart */}
        <div className="mt-8">
          <div className="h-6 w-36 animate-pulse rounded bg-slate-100 [animation-delay:450ms]" />
          <div className="mt-4 rounded-xl border border-slate-100/80 bg-white p-6">
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className="h-4 w-28 shrink-0 animate-pulse rounded bg-slate-100"
                    style={{ animationDelay: `${i * 40 + 475}ms` }}
                  />
                  <div
                    className="h-7 animate-pulse rounded bg-slate-100"
                    style={{
                      width: `${85 - i * 8}%`,
                      animationDelay: `${i * 40 + 500}ms`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
