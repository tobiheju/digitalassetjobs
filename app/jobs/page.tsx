import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getJobs } from '@/lib/queries/jobs'
import { DiscoverClient } from './discover-client'
import { JobListSkeleton } from '@/components/skeletons/job-list-skeleton'

export const metadata: Metadata = {
  title: 'Discover Jobs',
  description: 'Browse digital asset, crypto, and blockchain jobs. Filter by sector, skills, salary, and work arrangement.',
}

async function DiscoverLoader({ search, sector }: { search?: string; sector?: string }) {
  const filters = {
    ...(search ? { search } : {}),
    ...(sector ? { sectors: [sector] } : {}),
  }
  const { jobs } = await getJobs(filters, 1, 100)
  return <DiscoverClient initialJobs={jobs} initialSearch={search} initialSector={sector} />
}

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ search?: string; sector?: string }> }) {
  const { search, sector } = await searchParams
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <div className="mx-auto max-w-5xl">
            {/* Heading + subtitle */}
            <div className="mb-6">
              <div className="h-9 w-80 rounded-md animate-pulse bg-slate-100" />
              <div className="mt-2 h-4 w-36 rounded-md animate-pulse bg-slate-100" />
            </div>
            {/* Search bar */}
            <div className="mb-4 h-10 w-full rounded-lg animate-pulse bg-slate-100" />
            {/* Filter bar + view toggle */}
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-24 rounded-lg animate-pulse bg-slate-100" />
                <div className="h-9 w-20 rounded-lg animate-pulse bg-slate-100" />
                <div className="h-9 w-28 rounded-lg animate-pulse bg-slate-100" />
                <div className="h-9 w-24 rounded-lg animate-pulse bg-slate-100" />
              </div>
              <div className="flex gap-1">
                <div className="size-9 rounded-lg animate-pulse bg-slate-100" />
                <div className="size-9 rounded-lg animate-pulse bg-slate-100" />
              </div>
            </div>
            <JobListSkeleton />
          </div>
        </div>
      }
    >
      <DiscoverLoader search={search} sector={sector} />
    </Suspense>
  )
}
