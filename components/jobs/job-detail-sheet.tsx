'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Heart, MapPin, Calendar, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { CompanyLogo } from '@/components/jobs/company-logo'
import { MatchBadge } from '@/components/jobs/match-badge'
import { spring } from '@/lib/motion'
import type { Job } from '@/lib/types'

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

interface JobDetailSheetProps {
  job: Job | null
  score?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (jobId: string) => void
  onApply?: (jobId: string) => void
  isSaved?: boolean
}

function JobDetailContent({
  job,
  score,
  onSave,
  isSaved,
}: {
  job: Job
  score?: number
  onSave?: (jobId: string) => void
  isSaved?: boolean
}) {
  return (
    <>
      {/* Header */}
      <div className="space-y-3">
        <CompanyLogo name={job.company} size="lg" />
        <div>
          <h2 className="text-xl font-bold text-[#1a365d]">{job.title}</h2>
          <p className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
            {job.company}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <MapPin className="size-3" />
            {job.location}
          </Badge>
          <Badge variant="outline">{job.workArrangement}</Badge>
          {score !== undefined && <MatchBadge score={score} />}
        </div>
        {job.salaryDisplay && (
          <p className="text-lg font-semibold">{job.salaryDisplay}</p>
        )}
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="size-3.5" />
          Posted {formatRelativeDate(job.postedDate)}
        </p>
      </div>

      {/* Body */}
      <div className="space-y-6">
        {job.description && (
          <section>
            <h3 className="mb-2 text-sm font-semibold text-[#1a365d]">About this role</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </section>
        )}

        {job.requirements.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-semibold text-[#1a365d]">Requirements</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </section>
        )}

        {job.skills.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-semibold text-[#1a365d]">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {job.benefits.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-semibold text-[#1a365d]">Benefits</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.benefits.map((benefit) => (
                <Badge key={benefit} variant="outline" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {job.tags.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-semibold text-[#1a365d]">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.tags.map((tag) => (
                <Badge key={tag} variant="ghost" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

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
    <div className="sticky bottom-0 flex flex-col gap-2 border-t bg-white p-4 md:flex-row">
      <Button
        className="w-full gap-2 bg-[#1a365d] text-white hover:bg-[#1a365d]/90 md:flex-1"
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
        className="w-full gap-2 md:w-auto"
        onClick={() => onSave?.(job.id)}
      >
        <Heart
          className={`size-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`}
        />
        {isSaved ? 'Saved' : 'Save'}
      </Button>
    </div>
  )
}

export function JobDetailSheet({
  job,
  score,
  open,
  onOpenChange,
  onSave,
  onApply,
  isSaved,
}: JobDetailSheetProps) {
  const handleClose = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  // Escape key handler for desktop panel
  useEffect(() => {
    if (!open) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, handleClose])

  if (!job) return null

  return (
    <>
      {/* Desktop: right sidebar panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay for closing on outside click */}
            <motion.div
              className="fixed inset-0 z-40 hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              aria-hidden
            />

            <motion.div
              className="fixed right-0 top-16 z-50 hidden h-[calc(100vh-4rem)] w-[480px] flex-col bg-white shadow-xl md:flex"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={spring.gentle}
            >
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute right-3 top-3 z-10"
                onClick={handleClose}
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto p-6 pb-0">
                <JobDetailContent
                  job={job}
                  score={score}
                  onSave={onSave}
                  isSaved={isSaved}
                />
              </div>

              {/* Actions footer */}
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

      {/* Mobile: bottom sheet */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={handleClose}>
          <SheetContent side="bottom" className="max-h-[90vh] flex flex-col" showCloseButton={false}>
            {/* Drag handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
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
              onClick={handleClose}
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-4 pb-0">
              <JobDetailContent
                job={job}
                score={score}
                onSave={onSave}
                isSaved={isSaved}
              />
            </div>

            {/* Actions footer */}
            <ActionFooter
              job={job}
              onSave={onSave}
              onApply={onApply}
              isSaved={isSaved}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
