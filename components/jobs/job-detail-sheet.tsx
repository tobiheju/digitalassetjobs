'use client'

import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ExternalLink,
  Heart,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  DollarSign,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { VerifiedBadge } from '@/components/ui/verified-badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { CompanyLogo } from '@/components/jobs/company-logo'
import { MatchBadge } from '@/components/jobs/match-badge'
import { spring, duration } from '@/lib/motion'
import { toTitleCase } from '@/lib/utils'
import type { Job } from '@/lib/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRelativeDate(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return '1 week ago'
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 60) return '1 month ago'
  return `${Math.floor(diffDays / 30)} months ago`
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])
  return matches
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface JobDetailSheetProps {
  job: Job | null
  score?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (jobId: string) => void
  onApply?: (jobId: string) => void
  isSaved?: boolean
}

// ---------------------------------------------------------------------------
// Shared content — used by both desktop and mobile
// ---------------------------------------------------------------------------

function JobDetailContent({
  job,
  score,
}: {
  job: Job
  score?: number
}) {
  return (
    <div className="space-y-6">
      {/* Company hero banner */}
      <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-5">
        <div className="flex items-start gap-4">
          <CompanyLogo name={job.company} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-lg leading-tight text-[#1a365d]">
              {job.title}
            </h2>
            <p className="mt-0.5 flex items-center gap-1 text-sm font-medium text-blue-600">
              {job.company}
              {job.verified && (
                <VerifiedBadge />
              )}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="gap-1 text-xs bg-white/80">
                <MapPin className="size-3" />
                {job.location}
              </Badge>
              <Badge variant="outline" className="text-xs bg-white/80">
                {job.workArrangement}
              </Badge>
              {job.type && (
                <Badge variant="outline" className="text-xs bg-white/80">
                  {job.type}
                </Badge>
              )}
              {score !== undefined && <MatchBadge score={score} />}
            </div>
          </div>
        </div>
      </div>

      {/* Key details grid */}
      <div className="grid grid-cols-2 gap-3">
        {job.salaryDisplay && (
          <div className="rounded-lg border border-slate-100 bg-white p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <DollarSign className="size-3.5" />
              Salary
            </div>
            <p className="mt-1 text-sm font-medium text-[#1a365d]">
              {job.salaryDisplay}
            </p>
          </div>
        )}
        <div className="rounded-lg border border-slate-100 bg-white p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Calendar className="size-3.5" />
            Posted
          </div>
          <p className="mt-1 text-sm font-medium text-[#1a365d]">
            {formatRelativeDate(job.postedDate)}
          </p>
        </div>
        {job.seniority && (
          <div className="rounded-lg border border-slate-100 bg-white p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Briefcase className="size-3.5" />
              Level
            </div>
            <p className="mt-1 text-sm font-medium text-[#1a365d]">
              {job.seniority}
            </p>
          </div>
        )}
        {job.department && (
          <div className="rounded-lg border border-slate-100 bg-white p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Building2 className="size-3.5" />
              Department
            </div>
            <p className="mt-1 text-sm font-medium text-[#1a365d]">
              {job.department}
            </p>
          </div>
        )}
        {job.verified && (
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="size-3.5" />
              Verified listing
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {job.description && (
        <section>
          <h3 className="mb-2.5 text-xs font-medium text-slate-400">
            About this role
          </h3>
          <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
            {job.description}
          </p>
        </section>
      )}

      {/* Requirements */}
      {job.requirements.length > 0 && (
        <section>
          <h3 className="mb-2.5 text-xs font-medium text-slate-400">
            Requirements
          </h3>
          <ul className="space-y-2">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-[#1a365d]/40" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Skills */}
      {job.skills.length > 0 && (
        <section>
          <h3 className="mb-2.5 text-xs font-medium text-slate-400">
            Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="rounded-md bg-[#1a365d]/5 text-xs font-medium text-[#1a365d]"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Benefits */}
      {job.benefits.length > 0 && (
        <section>
          <h3 className="mb-2.5 text-xs font-medium text-slate-400">
            Benefits
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {job.benefits.map((benefit) => (
              <Badge
                key={benefit}
                variant="outline"
                className="rounded-md text-xs"
              >
                {benefit}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {job.tags.length > 0 && (
        <section>
          <h3 className="mb-2.5 text-xs font-medium text-slate-400">
            Tags
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500"
              >
                {toTitleCase(tag)}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Action footer
// ---------------------------------------------------------------------------

function ActionFooter({
  job,
  onSave,
  onApply,
  isSaved,
}: {
  job: Job
  onSave?: (jobId: string) => void
  onApply?: (jobId: string) => void
  isSaved?: boolean
}) {
  return (
    <div className="flex items-center gap-2 border-t bg-white px-5 py-4">
      <Button
        className="flex-1 gap-2 bg-[#1a365d] text-white hover:bg-[#1a365d]/90"
        onClick={() => {
          window.open(job.url, '_blank', 'noopener,noreferrer')
          onApply?.(job.id)
        }}
      >
        <ExternalLink className="size-4" />
        Apply Now
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="shrink-0"
        onClick={() => onSave?.(job.id)}
      >
        <Heart
          className={`size-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`}
        />
        <span className="sr-only">{isSaved ? 'Saved' : 'Save'}</span>
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Desktop panel
// ---------------------------------------------------------------------------

function DesktopPanel({
  job,
  score,
  open,
  onClose,
  onSave,
  onApply,
  isSaved,
}: {
  job: Job
  score?: number
  open: boolean
  onClose: () => void
  onSave?: (jobId: string) => void
  onApply?: (jobId: string) => void
  isSaved?: boolean
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-[520px] flex-col bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={spring.gentle}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between border-b px-5 py-3">
              <span className="text-xs font-medium text-slate-400">
                Job Details
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onClose}
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-5">
              <JobDetailContent job={job} score={score} />
            </div>

            {/* Actions */}
            <ActionFooter
              job={job}
              onSave={onSave}
              onApply={onApply}
              isSaved={isSaved}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// Mobile bottom sheet
// ---------------------------------------------------------------------------

function MobileSheet({
  job,
  score,
  open,
  onClose,
  onSave,
  onApply,
  isSaved,
}: {
  job: Job
  score?: number
  open: boolean
  onClose: () => void
  onSave?: (jobId: string) => void
  onApply?: (jobId: string) => void
  isSaved?: boolean
}) {
  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent side="bottom" className="max-h-[92vh] flex flex-col" showCloseButton={false}>
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="h-1 w-10 rounded-full bg-slate-200" />
        </div>

        <SheetHeader className="sr-only">
          <SheetTitle>{job.title}</SheetTitle>
          <SheetDescription>Job details for {job.title} at {job.company}</SheetDescription>
        </SheetHeader>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-3 top-3 z-10"
          onClick={onClose}
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </Button>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          <JobDetailContent job={job} score={score} />
        </div>

        {/* Actions */}
        <ActionFooter
          job={job}
          onSave={onSave}
          onApply={onApply}
          isSaved={isSaved}
        />
      </SheetContent>
    </Sheet>
  )
}

// ---------------------------------------------------------------------------
// Main export — conditionally renders desktop OR mobile, not both
// ---------------------------------------------------------------------------

export function JobDetailSheet({
  job,
  score,
  open,
  onOpenChange,
  onSave,
  onApply,
  isSaved,
}: JobDetailSheetProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const handleClose = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  // Escape key handler
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, handleClose])

  if (!job) return null

  // Only render the variant that matches the current viewport
  if (isDesktop) {
    return (
      <DesktopPanel
        job={job}
        score={score}
        open={open}
        onClose={handleClose}
        onSave={onSave}
        onApply={onApply}
        isSaved={isSaved}
      />
    )
  }

  return (
    <MobileSheet
      job={job}
      score={score}
      open={open}
      onClose={handleClose}
      onSave={onSave}
      onApply={onApply}
      isSaved={isSaved}
    />
  )
}
