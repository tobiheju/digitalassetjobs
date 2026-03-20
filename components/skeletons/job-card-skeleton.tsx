export function JobCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-100/80 bg-white">
      <div className="flex gap-4 p-4">
        {/* Logo placeholder */}
        <div className="shrink-0 pt-0.5">
          <div className="size-9 animate-pulse rounded-lg bg-slate-100" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {/* Title */}
              <div className="h-[18px] w-3/5 animate-pulse rounded bg-slate-100" />
              {/* Company */}
              <div className="mt-1.5 h-3.5 w-1/4 animate-pulse rounded bg-slate-100 [animation-delay:50ms]" />
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              {/* Match badge */}
              <div className="h-5 w-20 animate-pulse rounded-md bg-slate-100 [animation-delay:100ms]" />
              {/* Salary */}
              <div className="h-3.5 w-28 animate-pulse rounded bg-slate-100 [animation-delay:150ms]" />
            </div>
          </div>

          {/* Meta row */}
          <div className="mt-2.5 flex items-center gap-3">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100 [animation-delay:100ms]" />
            <div className="h-3 w-14 animate-pulse rounded bg-slate-100 [animation-delay:150ms]" />
            <div className="h-3 w-16 animate-pulse rounded bg-slate-100 [animation-delay:200ms]" />
            <div className="h-3 w-14 animate-pulse rounded bg-slate-100 [animation-delay:250ms]" />
          </div>

          {/* Tags */}
          <div className="mt-2.5 flex gap-1.5">
            <div className="h-[18px] w-14 animate-pulse rounded bg-slate-100 [animation-delay:200ms]" />
            <div className="h-[18px] w-18 animate-pulse rounded bg-slate-100 [animation-delay:250ms]" />
            <div className="h-[18px] w-12 animate-pulse rounded bg-slate-100 [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  )
}
