import type { Metadata } from 'next'
import { getJobs } from '@/lib/queries/jobs'
import { DiscoverClient } from './discover-client'

export const metadata: Metadata = {
  title: 'Discover Jobs | Digital Asset Jobs',
}

export default async function Home() {
  const { jobs } = await getJobs(undefined, 1, 100)

  return <DiscoverClient initialJobs={jobs} />
}
