'use client'

import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'
import { listContainer, listItem } from '@/lib/motion'
import { JobCard } from '@/components/jobs/job-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Job } from '@/lib/types'

interface JobListProps {
  jobs: Job[]
  view: 'list' | 'card'
  onJobClick: (job: Job) => void
  scores: Map<string, number>
  hasActiveFilters?: boolean
  onClearFilters?: () => void
}

export function JobList({
  jobs,
  view,
  onJobClick,
  scores,
  hasActiveFilters,
  onClearFilters,
}: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-20 text-center">
        <Inbox className="mb-3 size-10 text-slate-300" />
        <p className="text-[15px] font-medium text-slate-500">
          No jobs match your filters
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Try adjusting your preferences to see more results
        </p>
        {hasActiveFilters && onClearFilters && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <motion.div
      variants={listContainer}
      initial="hidden"
      animate="show"
      className={cn(
        view === 'card'
          ? 'grid grid-cols-1 gap-3 sm:grid-cols-2'
          : 'flex flex-col gap-2'
      )}
    >
      {jobs.map((job) => (
        <motion.div key={job.id} variants={listItem}>
          <JobCard
            job={job}
            score={scores.get(job.id)}
            variant="list"
            onClick={() => onJobClick(job)}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
