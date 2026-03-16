'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { SlidersHorizontal } from 'lucide-react'

import { PageWrapper } from '@/components/layout/page-wrapper'
import { JobList } from '@/components/jobs/job-list'
import { JobDetailSheet } from '@/components/jobs/job-detail-sheet'
import { ViewToggle } from '@/components/jobs/view-toggle'
import { PreferencesPanel } from '@/components/preferences/preferences-panel'
import { Button } from '@/components/ui/button'
import { usePreferences } from '@/lib/hooks/use-preferences'
import { calculateMatchScore } from '@/lib/scoring'
import type { Job } from '@/lib/types'

const VIEW_STORAGE_KEY = 'daj-view'

interface DiscoverClientProps {
  initialJobs: Job[]
}

export function DiscoverClient({ initialJobs }: DiscoverClientProps) {
  const { preferences, setPreferences, resetPreferences, activeFilterCount, isLoaded } =
    usePreferences()

  // View toggle persisted to localStorage
  const [view, setView] = useState<'list' | 'card'>('list')
  useEffect(() => {
    try {
      const stored = localStorage.getItem(VIEW_STORAGE_KEY)
      if (stored === 'list' || stored === 'card') setView(stored)
    } catch {}
  }, [])

  const handleViewChange = useCallback((v: 'list' | 'card') => {
    setView(v)
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, v)
    } catch {}
  }, [])

  // Selected job for detail sheet
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  // Preferences panel state
  const [prefsOpen, setPrefsOpen] = useState(false)

  // Filter + score + sort
  const { filteredJobs, scores } = useMemo(() => {
    const hasFilters =
      preferences.sectors.length > 0 ||
      preferences.skills.length > 0 ||
      preferences.workArrangements.length > 0 ||
      preferences.jobTypes.length > 0 ||
      preferences.seniorityLevels.length > 0 ||
      preferences.salaryMin !== null ||
      preferences.salaryMax !== null

    let jobs = initialJobs

    if (hasFilters) {
      jobs = jobs.filter((job) => {
        if (
          preferences.sectors.length > 0 &&
          !preferences.sectors.includes(job.companyType)
        )
          return false

        if (
          preferences.skills.length > 0 &&
          !job.skills.some((s) => preferences.skills.includes(s))
        )
          return false

        if (
          preferences.workArrangements.length > 0 &&
          !preferences.workArrangements.includes(job.workArrangement) &&
          !(preferences.workArrangements.includes('Remote') && job.isRemote)
        )
          return false

        if (
          preferences.jobTypes.length > 0 &&
          !preferences.jobTypes.includes(job.type)
        )
          return false

        if (
          preferences.seniorityLevels.length > 0 &&
          (!job.seniority || !preferences.seniorityLevels.includes(job.seniority))
        )
          return false

        if (preferences.salaryMin !== null && job.salaryMax !== null) {
          if (job.salaryMax < preferences.salaryMin) return false
        }

        if (preferences.salaryMax !== null && job.salaryMin !== null) {
          if (job.salaryMin > preferences.salaryMax) return false
        }

        return true
      })
    }

    // Compute scores
    const scoreMap = new Map<string, number>()
    for (const job of jobs) {
      scoreMap.set(job.id, calculateMatchScore(job, preferences))
    }

    // Sort: featured first, then by score descending
    const sorted = [...jobs].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0)
    })

    return { filteredJobs: sorted, scores: scoreMap }
  }, [initialJobs, preferences])

  // Don't render content until preferences are loaded from localStorage
  if (!isLoaded) return null

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a365d]">Discover</h1>
        <div className="flex items-center gap-2">
          <ViewToggle view={view} onChange={handleViewChange} />
          {/* Mobile filter button */}
          <Button
            variant="outline"
            size="sm"
            className="relative md:hidden"
            onClick={() => setPrefsOpen(true)}
            aria-label="Open filters"
          >
            <SlidersHorizontal className="size-4" />
            <span className="ml-1.5">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-[#1a365d] text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
          {/* Desktop filter toggle */}
          <Button
            variant="outline"
            size="sm"
            className="relative hidden md:flex"
            onClick={() => setPrefsOpen((o) => !o)}
            aria-label="Open filters"
          >
            <SlidersHorizontal className="size-4" />
            <span className="ml-1.5">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-[#1a365d] text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Job list */}
      <JobList
        jobs={filteredJobs}
        view={view}
        onJobClick={setSelectedJob}
        scores={scores}
        hasActiveFilters={activeFilterCount > 0}
        onClearFilters={resetPreferences}
      />

      {/* Preferences panel */}
      <PreferencesPanel
        preferences={preferences}
        onChange={setPreferences}
        onReset={resetPreferences}
        open={prefsOpen}
        onOpenChange={setPrefsOpen}
      />

      {/* Job detail sheet */}
      <JobDetailSheet
        job={selectedJob}
        score={selectedJob ? scores.get(selectedJob.id) : undefined}
        open={selectedJob !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedJob(null)
        }}
      />
    </PageWrapper>
  )
}
