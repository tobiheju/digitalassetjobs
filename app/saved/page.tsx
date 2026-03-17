'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

import { PageWrapper } from '@/components/layout/page-wrapper'
import { JobCard } from '@/components/jobs/job-card'
import { JobListSkeleton } from '@/components/skeletons/job-list-skeleton'
import { useSavedJobs } from '@/lib/hooks/use-saved-jobs'
import { createClient } from '@/lib/supabase/client'
import { mapRowToJob } from '@/lib/queries/mappers'
import { listContainer, listItem } from '@/lib/motion'
import type { Job } from '@/lib/types'

export default function SavedPage() {
  const { savedIds } = useSavedJobs()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (savedIds.length === 0) {
      setJobs([])
      setLoading(false)
      return
    }

    const supabase = createClient()
    supabase
      .from('jobs')
      .select('*')
      .in('id', savedIds)
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to fetch saved jobs:', error)
          setJobs([])
        } else {
          setJobs((data ?? []).map(mapRowToJob))
        }
        setLoading(false)
      })
  }, [savedIds])

  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 font-serif text-3xl font-normal text-[#1a365d]">Saved Jobs</h1>

      {loading ? (
        <JobListSkeleton />
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Heart className="h-12 w-12 text-slate-300" />
          <h2 className="text-lg font-medium text-slate-700">
            No saved jobs yet
          </h2>
          <p className="max-w-sm text-sm text-slate-500">
            Browse jobs and tap the heart icon to save jobs you&apos;re
            interested in.
          </p>
          <Link
            href="/"
            className="mt-2 rounded-md bg-[#1a365d] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a4a7f]"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {jobs.map((job) => (
            <motion.div key={job.id} variants={listItem}>
              <JobCard job={job} variant="list" />
            </motion.div>
          ))}
        </motion.div>
      )}
      </div>
    </PageWrapper>
  )
}
