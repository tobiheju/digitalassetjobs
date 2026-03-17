import { Job, UserPreferences } from '@/lib/types'

const WEIGHTS = {
  sector: 30,
  skills: 25,
  salary: 20,
  workArrangement: 10,
  jobType: 10,
  seniority: 5,
} as const

// Deterministic hash for fallback scores (65-95 range)
function hashScore(jobId: string): number {
  let hash = 0
  for (let i = 0; i < jobId.length; i++) {
    const char = jobId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return 65 + Math.abs(hash % 31) // 65-95
}

export function calculateMatchScore(job: Job, prefs: UserPreferences): number {
  const hasPrefs =
    prefs.sectors.length > 0 ||
    prefs.skills.length > 0 ||
    prefs.workArrangements.length > 0 ||
    prefs.jobTypes.length > 0 ||
    prefs.seniorityLevels.length > 0 ||
    prefs.salaryMin !== null ||
    prefs.salaryMax !== null

  if (!hasPrefs) return hashScore(job.id)

  let score = 0

  // Sector match (30pts)
  if (prefs.sectors.length > 0 && prefs.sectors.includes(job.companyType)) {
    score += WEIGHTS.sector
  }

  // Skills overlap (25pts, pro-rated)
  if (prefs.skills.length > 0) {
    const matching = job.skills.filter(s => prefs.skills.includes(s)).length
    score += Math.round((matching / prefs.skills.length) * WEIGHTS.skills)
  }

  // Salary distance (20pts)
  if ((prefs.salaryMin !== null || prefs.salaryMax !== null) && job.salaryMin !== null) {
    const prefMid = ((prefs.salaryMin ?? 0) + (prefs.salaryMax ?? 500000)) / 2
    const jobMid = ((job.salaryMin ?? 0) + (job.salaryMax ?? job.salaryMin ?? 0)) / 2
    const distance = Math.abs(prefMid - jobMid)
    const maxDistance = 300000
    score += Math.round(Math.max(0, 1 - distance / maxDistance) * WEIGHTS.salary)
  }

  // Work arrangement (10pts)
  if (prefs.workArrangements.length > 0) {
    if (prefs.workArrangements.includes(job.workArrangement)) {
      score += WEIGHTS.workArrangement
    } else if (prefs.workArrangements.includes('Remote') && job.isRemote) {
      score += WEIGHTS.workArrangement
    }
  }

  // Job type (10pts)
  if (prefs.jobTypes.length > 0 && prefs.jobTypes.includes(job.type)) {
    score += WEIGHTS.jobType
  }

  // Seniority (5pts)
  if (prefs.seniorityLevels.length > 0 && job.seniority && prefs.seniorityLevels.includes(job.seniority)) {
    score += WEIGHTS.seniority
  }

  // Clamp to 10-95
  return Math.max(10, Math.min(95, score))
}

export function getScoreColor(score: number) {
  if (score >= 85) return { bg: 'bg-[#1a365d]/[0.06]', text: 'text-[#1a365d]', accent: 'text-[#1a365d]' }
  if (score >= 60) return { bg: 'bg-[#d4a038]/[0.08]', text: 'text-[#92700a]', accent: 'text-[#d4a038]' }
  return { bg: 'bg-slate-50', text: 'text-slate-500', accent: 'text-slate-400' }
}
