import { JobListSkeleton } from '@/components/skeletons/job-list-skeleton'

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Heading placeholder */}
        <div className="mb-6">
          <div className="h-9 w-80 animate-pulse rounded-md bg-muted" />
          <div className="mt-2 h-4 w-36 animate-pulse rounded-md bg-muted" />
        </div>
        {/* Filter bar placeholder */}
        <div className="mb-5 flex items-center gap-3">
          <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
          <div className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
          <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
        </div>
        <JobListSkeleton />
      </div>
    </div>
  )
}
