'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Bookmark, BookmarkCheck } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { VerifiedBadge } from '@/components/ui/verified-badge'
import { cn, toTitleCase } from '@/lib/utils'
import type { Job } from '@/lib/types'

import { CompanyLogo } from './company-logo'
import { MatchBadge } from './match-badge'

// ---------------------------------------------------------------------------
// Relative date helper
// ---------------------------------------------------------------------------

export function formatRelativeDate(dateString: string): string {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diffMs = now - then
  if (diffMs < 0) return 'just now'

  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 60) return minutes <= 1 ? 'just now' : `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`

  const years = Math.floor(months / 12)
  return `${years}y ago`
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface JobCardProps {
  job: Job
  score?: number
  variant?: 'list' | 'compact'
  onClick?: () => void
  onSave?: (jobId: string) => void
  isSaved?: boolean
}

// ---------------------------------------------------------------------------
// Compact variant
// ---------------------------------------------------------------------------

function CompactContent({ job, score, onSave, isSaved }: { job: Job; score?: number; onSave?: (jobId: string) => void; isSaved?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <CompanyLogo name={job.company} size="sm" />
      <span className="truncate text-sm font-medium text-[#1a365d]">
        {job.title}
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-xs text-slate-500">
        {job.company}
        {job.verified && <VerifiedBadge size="sm" />}
      </span>
      {job.salaryDisplay && (
        <span className="ml-auto shrink-0 tabular-nums text-sm font-medium text-slate-700">
          {job.salaryDisplay}
        </span>
      )}
      {score !== undefined && (
        <div className="shrink-0">
          <MatchBadge score={score} />
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// List variant — refined premium look
// ---------------------------------------------------------------------------

function ListContent({ job, score, onSave, isSaved }: { job: Job; score?: number; onSave?: (jobId: string) => void; isSaved?: boolean }) {
  const maxTags = 3
  const visibleTags = job.tags.slice(0, maxTags)
  const overflowCount = job.tags.length - maxTags

  return (
    <div className="flex gap-4 p-4">
      {/* Logo */}
      <div className="shrink-0 pt-0.5">
        <CompanyLogo name={job.company} size="md" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-medium text-[#1a365d]">
              {job.title}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
              {job.company}
              {job.verified && <VerifiedBadge />}
            </p>
          </div>
          <div className="flex shrink-0 items-start gap-1">
            <div className="flex flex-col items-end gap-1">
              {score !== undefined && <MatchBadge score={score} />}
              {job.salaryDisplay && (
                <span className="tabular-nums text-[13px] font-medium text-slate-700">
                  {job.salaryDisplay}
                </span>
              )}
            </div>
            {onSave && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onSave(job.id)
                }}
                className={cn(
                  'size-7 flex items-center justify-center rounded-md transition-colors hover:bg-slate-100',
                  isSaved ? 'text-[#d4a038]' : 'text-slate-300 hover:text-slate-500'
                )}
              >
                {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" />
            {job.location}
          </span>
          <span>{job.workArrangement}</span>
          <span>{job.type}</span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Clock className="size-3" />
            {formatRelativeDate(job.postedDate)}
          </span>
        </div>

        {/* Tags */}
        {visibleTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500"
              >
                {toTitleCase(tag)}
              </span>
            ))}
            {overflowCount > 0 && (
              <span className="self-center text-[10px] text-slate-400">
                +{overflowCount}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// JobCard
// ---------------------------------------------------------------------------

export function JobCard({ job, score, variant = 'list', onClick, onSave, isSaved }: JobCardProps) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div
        tabIndex={0}
        role={onClick ? 'button' : undefined}
        className={cn(
          'rounded-xl border border-slate-100/80 bg-white transition-[border-color,box-shadow] duration-150 ease-out hover:border-slate-200/80 hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a365d] focus-visible:ring-offset-2',
          onClick && 'cursor-pointer'
        )}
        onClick={onClick}
        onKeyDown={onClick ? (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        } : undefined}
      >
        {variant === 'compact' ? (
          <CompactContent job={job} score={score} onSave={onSave} isSaved={isSaved} />
        ) : (
          <ListContent job={job} score={score} onSave={onSave} isSaved={isSaved} />
        )}
      </div>
    </motion.div>
  )
}
