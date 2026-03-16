'use client'

import { motion } from 'framer-motion'
import { listContainer, listItem } from '@/lib/motion'
import { JobCardSkeleton } from './job-card-skeleton'

export function JobListSkeleton() {
  return (
    <motion.div
      variants={listContainer}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div key={i} variants={listItem}>
          <JobCardSkeleton />
        </motion.div>
      ))}
    </motion.div>
  )
}
