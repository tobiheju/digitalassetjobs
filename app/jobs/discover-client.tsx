'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'

import { PageWrapper } from '@/components/layout/page-wrapper'
import { JobList } from '@/components/jobs/job-list'
import { JobDetailSheet } from '@/components/jobs/job-detail-sheet'
import { ViewToggle } from '@/components/jobs/view-toggle'
import { FilterBar } from '@/components/preferences/filter-bar'
import { PreferencesSheet } from '@/components/preferences/preferences-sheet'
import { usePreferences } from '@/lib/hooks/use-preferences'
import { calculateMatchScore } from '@/lib/scoring'
import { Sparkles, Search } from 'lucide-react'
import { useSavedJobs } from '@/lib/hooks/use-saved-jobs'
import type { Job } from '@/lib/types'

const VIEW_STORAGE_KEY = 'daj-view'

interface DiscoverClientProps {
  initialJobs: Job[]
  initialSearch?: string
  initialSector?: string
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

export function DiscoverClient({ initialJobs, initialSearch, initialSector }: DiscoverClientProps) {
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { preferences, setPreferences, resetPreferences, activeFilterCount, isLoaded } =
    usePreferences()

  // Apply sector from URL query param on mount
  const sectorApplied = useRef(false)
  useEffect(() => {
    if (isLoaded && initialSector && !sectorApplied.current) {
      sectorApplied.current = true
      if (!preferences.sectors.includes(initialSector)) {
        setPreferences({ ...preferences, sectors: [initialSector] })
      }
    }
  }, [isLoaded, initialSector]) // eslint-disable-line react-hooks/exhaustive-deps
  const { save, unsave, isSaved } = useSavedJobs()

  const [searchQuery, setSearchQuery] = useState(initialSearch || '')

  const handleToggleSave = useCallback((id: string) => {
    if (!isSaved(id)) {
      track('job_saved', { jobId: id })
    }
    isSaved(id) ? unsave(id) : save(id)
  }, [isSaved, unsave, save])

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

  // Selected job for mobile detail sheet
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [prefsOpen, setPrefsOpen] = useState(false)

  // On desktop, navigate to detail page; on mobile, open bottom sheet
  const handleJobClick = useCallback((job: Job) => {
    track('job_viewed', { jobId: job.id, title: job.title, company: job.company })
    if (isDesktop) {
      router.push(`/jobs/${job.id}`)
    } else {
      setSelectedJob(job)
    }
  }, [isDesktop, router])

  // Filter + score + sort
  const { filteredJobs, scores } = useMemo(() => {
    const hasFilters =
      preferences.sectors.length > 0 ||
      preferences.skills.length > 0 ||
      preferences.workArrangements.length > 0 ||
      preferences.jobTypes.length > 0 ||
      preferences.seniorityLevels.length > 0 ||
      preferences.salaryMin !== null ||
      preferences.salaryMax !== null ||
      preferences.verifiedOnly

    let jobs = initialJobs

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      jobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (hasFilters) {
      jobs = jobs.filter((job) => {
        if (preferences.verifiedOnly && !job.verified) return false
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

    // Sort: most recent first, then by score descending
    const getTime = (d: string) => {
      const t = new Date(d).getTime()
      return Number.isNaN(t) ? 0 : t
    }
    const sorted = [...jobs].sort((a, b) => {
      const dateDiff = getTime(b.postedDate) - getTime(a.postedDate)
      if (dateDiff !== 0) return dateDiff
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0)
    })

    return { filteredJobs: sorted, scores: scoreMap }
  }, [initialJobs, preferences, searchQuery])

  // Track search queries after user stops typing (debounced)
  const searchTrackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (searchTrackTimeout.current) clearTimeout(searchTrackTimeout.current)
    if (searchQuery.trim()) {
      searchTrackTimeout.current = setTimeout(() => {
        track('jobs_searched', { query: searchQuery })
      }, 800)
    }
    return () => {
      if (searchTrackTimeout.current) clearTimeout(searchTrackTimeout.current)
    }
  }, [searchQuery])

  // Don't render content until preferences are loaded from localStorage
  if (!isLoaded) return null

  return (
    <>
      <PageWrapper>
        <div className="mx-auto max-w-5xl">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="font-serif text-3xl font-normal text-[#1a365d]">
              {preferences.sectors.length === 1
                ? `Find Your Next Role in ${preferences.sectors[0]}`
                : 'Find Your Next Role in Digital Assets'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} available
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles, companies, skills..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 transition-colors placeholder:text-slate-400 focus:border-[#1a365d]/40 focus:outline-none focus:ring-2 focus:ring-[#1a365d]/10"
            />
          </div>

          {/* Filter bar + view toggle */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <FilterBar
                preferences={preferences}
                onChange={setPreferences}
                onReset={resetPreferences}
                activeFilterCount={activeFilterCount}
              />
            </div>
            <div className="shrink-0 pt-0.5">
              <ViewToggle view={view} onChange={handleViewChange} />
            </div>
          </div>

          {/* Personalization banner — show when no preferences set */}
          {activeFilterCount === 0 && (
            <button
              onClick={() => setPrefsOpen(true)}
              className="mb-5 flex w-full items-center gap-3 rounded-xl border border-[#d4a038]/20 bg-[#d4a038]/5 px-4 py-3 text-left transition-[border-color,box-shadow] duration-150 ease-out hover:border-[#d4a038]/40 hover:shadow-sm"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#d4a038]/10">
                <Sparkles className="size-4 text-[#d4a038]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#1a365d]">
                  Get personalized job matches
                </p>
                <p className="text-xs text-slate-500">
                  Set your preferences to see jobs ranked by relevance to your experience and goals.
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium text-[#d4a038]">
                Set up →
              </span>
            </button>
          )}

          {/* Job list */}
          <JobList
            jobs={filteredJobs}
            view={view}
            onJobClick={handleJobClick}
            scores={scores}
            hasActiveFilters={activeFilterCount > 0}
            onClearFilters={resetPreferences}
            onSave={handleToggleSave}
            isSaved={isSaved}
          />
        </div>
      </PageWrapper>

      <PreferencesSheet
        open={prefsOpen}
        onOpenChange={setPrefsOpen}
        preferences={preferences}
        onPreferencesChange={setPreferences}
        onReset={resetPreferences}
        filterCount={activeFilterCount}
      />

      {/* Mobile-only detail sheet */}
      <JobDetailSheet
        job={selectedJob}
        score={selectedJob ? scores.get(selectedJob.id) : undefined}
        open={selectedJob !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedJob(null)
        }}
      />
    </>
  )
}
