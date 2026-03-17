'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

import { PageWrapper } from '@/components/layout/page-wrapper'
import { JobCard, formatRelativeDate } from '@/components/jobs/job-card'
import { JobListSkeleton } from '@/components/skeletons/job-list-skeleton'
import { useAppliedJobs } from '@/lib/hooks/use-saved-jobs'
import { createClient } from '@/lib/supabase/client'
import { mapRowToJob } from '@/lib/queries/mappers'
import { listContainer, listItem } from '@/lib/motion'
import type { Job } from '@/lib/types'

export default function AppliedPage() {
  const { appliedIds, getAppliedDate } = useAppliedJobs()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (appliedIds.length === 0) {
      setJobs([])
      setLoading(false)
      return
    }

    const supabase = createClient()
    supabase
      .from('jobs')
      .select('*')
      .in('id', appliedIds)
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to fetch applied jobs:', error)
          setJobs([])
        } else {
          setJobs((data ?? []).map(mapRowToJob))
        }
        setLoading(false)
      })
  }, [appliedIds])

  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 font-serif text-3xl font-normal text-[#1a365d]">
        Applied Jobs
      </h1>

      {loading ? (
        <JobListSkeleton />
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Send className="h-12 w-12 text-slate-300" />
          <h2 className="text-lg font-medium text-slate-700">
            No applications tracked yet
          </h2>
          <p className="max-w-sm text-sm text-slate-500">
            When you click Apply on a job, we&apos;ll track it here.
          </p>
          <Link
            href="/jobs"
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
          {jobs.map((job) => {
            const appliedDate = getAppliedDate(job.id)
            return (
              <motion.div key={job.id} variants={listItem}>
                <JobCard job={job} variant="list" />
                {appliedDate && (
                  <p className="mt-1 pl-4 text-xs text-slate-400">
                    Applied {formatRelativeDate(appliedDate)}
                  </p>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      )}
      </div>
    </PageWrapper>
  )
}
