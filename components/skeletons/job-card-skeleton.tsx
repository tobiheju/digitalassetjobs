import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function JobCardSkeleton() {
  return (
    <Card className="transition-shadow">
      <div className="flex gap-4 px-4 py-3">
        {/* Logo placeholder */}
        <div className="shrink-0 pt-0.5">
          <Skeleton className="size-10 rounded-full" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-2">
          {/* Title */}
          <Skeleton className="h-5 w-3/4 [animation-delay:50ms]" />
          {/* Company */}
          <Skeleton className="h-4 w-1/3 [animation-delay:100ms]" />

          {/* Badge placeholders */}
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-20 rounded-full [animation-delay:150ms]" />
            <Skeleton className="h-5 w-16 rounded-full [animation-delay:200ms]" />
            <Skeleton className="h-5 w-18 rounded-full [animation-delay:250ms]" />
          </div>

          {/* Description lines */}
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-full [animation-delay:300ms]" />
            <Skeleton className="h-3.5 w-4/5 [animation-delay:350ms]" />
          </div>
        </div>

        {/* Right side - salary */}
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Skeleton className="h-5 w-20 [animation-delay:100ms]" />
          <Skeleton className="h-3 w-12 [animation-delay:200ms]" />
        </div>
      </div>
    </Card>
  )
}
