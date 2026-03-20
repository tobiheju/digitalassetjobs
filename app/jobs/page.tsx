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
  return <DiscoverClient initialJobs={jobs} initialSearch={search} />
}

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ search?: string; sector?: string }> }) {
  const { search, sector } = await searchParams
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6">
              <div className="h-9 w-80 rounded-md animate-pulse bg-muted" />
              <div className="mt-2 h-4 w-36 rounded-md animate-pulse bg-muted" />
            </div>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-9 w-24 rounded-lg animate-pulse bg-muted" />
              <div className="h-9 w-20 rounded-lg animate-pulse bg-muted" />
              <div className="h-9 w-28 rounded-lg animate-pulse bg-muted" />
              <div className="h-9 w-24 rounded-lg animate-pulse bg-muted" />
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
