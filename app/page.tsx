import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getJobs } from '@/lib/queries/jobs'
import { DiscoverClient } from './discover-client'
import { JobListSkeleton } from '@/components/skeletons/job-list-skeleton'

export const metadata: Metadata = {
  title: 'Discover Jobs | Digital Asset Jobs',
}

async function DiscoverLoader() {
  const { jobs } = await getJobs(undefined, 1, 100)
  return <DiscoverClient initialJobs={jobs} />
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1100px] px-4 py-6">
          <div className="mb-6 h-8 w-32" />
          <JobListSkeleton />
        </div>
      }
    >
      <DiscoverLoader />
    </Suspense>
  )
}
