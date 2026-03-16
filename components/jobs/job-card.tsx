'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { interactive } from '@/lib/motion'
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
}

// ---------------------------------------------------------------------------
// Compact variant
// ---------------------------------------------------------------------------

function CompactContent({ job, score }: { job: Job; score?: number }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <CompanyLogo name={job.company} size="sm" />

      <span className="truncate font-semibold text-[#1a365d] text-sm">
        {job.title}
      </span>

      <span className="shrink-0 text-xs text-slate-600">{job.company}</span>

      {job.salaryDisplay && (
        <span className="ml-auto shrink-0 text-sm font-semibold">
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
// List variant
// ---------------------------------------------------------------------------

function ListContent({ job, score }: { job: Job; score?: number }) {
  const maxTags = 3
  const visibleTags = job.tags.slice(0, maxTags)
  const overflowCount = job.tags.length - maxTags

  return (
    <div className="flex gap-4 px-4 py-3">
      {/* Left: logo */}
      <div className="shrink-0 pt-0.5">
        <CompanyLogo name={job.company} size="md" />
      </div>

      {/* Center: content */}
      <div className="min-w-0 flex-1 space-y-1.5">
        <h3 className="truncate font-semibold text-[#1a365d]">{job.title}</h3>
        <p className="text-sm text-slate-600">{job.company}</p>

        {/* Info badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="gap-1 text-xs">
            <MapPin className="h-3 w-3" />
            {job.location}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {job.workArrangement}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {job.type}
          </Badge>
        </div>

        {/* Tags */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {visibleTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
            {overflowCount > 0 && (
              <span className="self-center text-[10px] text-slate-400">
                +{overflowCount} more
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {job.description && (
          <p className="line-clamp-2 text-sm text-slate-500">
            {job.description}
          </p>
        )}
      </div>

      {/* Right side */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {score !== undefined && <MatchBadge score={score} />}

        {job.salaryDisplay && (
          <span className="text-sm font-semibold">{job.salaryDisplay}</span>
        )}

        <span className="text-xs text-slate-400">
          {formatRelativeDate(job.postedDate)}
        </span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// JobCard
// ---------------------------------------------------------------------------

export function JobCard({ job, score, variant = 'list', onClick }: JobCardProps) {
  return (
    <motion.div {...interactive}>
      <Card
        tabIndex={0}
        role={onClick ? 'button' : undefined}
        className={cn(
          'transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a365d] focus-visible:ring-offset-2',
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
          <CompactContent job={job} score={score} />
        ) : (
          <ListContent job={job} score={score} />
        )}
      </Card>
    </motion.div>
  )
}
