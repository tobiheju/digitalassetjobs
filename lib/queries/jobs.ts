import { createClient } from '@/lib/supabase/server'
import type { Job, JobFilters } from '@/lib/types'
export { mapRowToJob } from './mappers'
import { mapRowToJob } from './mappers'

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getJobs(
  filters: JobFilters = {},
  page = 1,
  pageSize = 20,
): Promise<{ jobs: Job[]; total: number }> {
  const supabase = await createClient()

  let query = supabase.from('jobs').select('*', { count: 'exact' })

  // --- apply filters ---

  if (filters.search) {
    const term = `%${filters.search}%`
    query = query.or(`title.ilike.${term},company.ilike.${term},description.ilike.${term}`)
  }

  if (filters.sectors && filters.sectors.length > 0) {
    query = query.in('company_type', filters.sectors)
  }

  if (filters.skills && filters.skills.length > 0) {
    query = query.overlaps('skills', filters.skills)
  }

  if (filters.workArrangements && filters.workArrangements.length > 0) {
    query = query.in('work_arrangement', filters.workArrangements)
  }

  if (filters.jobTypes && filters.jobTypes.length > 0) {
    query = query.in('type', filters.jobTypes)
  }

  if (filters.seniorityLevels && filters.seniorityLevels.length > 0) {
    query = query.in('seniority', filters.seniorityLevels)
  }

  if (filters.countries && filters.countries.length > 0) {
    query = query.in('country', filters.countries)
  }

  if (filters.salaryMin !== undefined) {
    query = query.gte('salary_max', filters.salaryMin)
  }

  if (filters.salaryMax !== undefined) {
    query = query.lte('salary_min', filters.salaryMax)
  }

  if (filters.verifiedOnly) {
    query = query.eq('verified', true)
  }

  // --- ordering & pagination ---

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query
    .order('featured', { ascending: false })
    .order('posted_date', { ascending: false })
    .range(from, to)

  const { data, count, error } = await query

  if (error) throw error

  return {
    jobs: (data ?? []).map(mapRowToJob),
    total: count ?? 0,
  }
}

export async function getJobById(id: string): Promise<Job | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // not found
    throw error
  }

  return data ? mapRowToJob(data) : null
}

export async function getFeaturedJobs(limit = 6): Promise<Job[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('featured', true)
    .order('posted_date', { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data ?? []).map(mapRowToJob)
}

export async function getJobStats(): Promise<{
  totalJobs: number
  remoteJobs: number
  verifiedJobs: number
  avgSalary: number
  topCountries: { country: string; count: number }[]
}> {
  const supabase = await createClient()

  // Total jobs
  const { count: totalJobs, error: totalError } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })

  if (totalError) throw totalError

  // Remote jobs
  const { count: remoteJobs, error: remoteError } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('is_remote', true)

  if (remoteError) throw remoteError

  // Verified jobs
  const { count: verifiedJobs, error: verifiedError } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('verified', true)

  if (verifiedError) throw verifiedError

  // Average salary (use salary_min and salary_max midpoint for rows that have them)
  const { data: salaryData, error: salaryError } = await supabase
    .from('jobs')
    .select('salary_min, salary_max')
    .not('salary_min', 'is', null)
    .not('salary_max', 'is', null)

  if (salaryError) throw salaryError

  let avgSalary = 0
  if (salaryData && salaryData.length > 0) {
    const sum = salaryData.reduce((acc, row) => {
      return acc + ((row.salary_min! + row.salary_max!) / 2)
    }, 0)
    avgSalary = Math.round(sum / salaryData.length)
  }

  // Top countries
  const { data: countryData, error: countryError } = await supabase
    .from('jobs')
    .select('country')
    .not('country', 'is', null)

  if (countryError) throw countryError

  const countryCounts = new Map<string, number>()
  for (const row of countryData ?? []) {
    if (row.country) {
      countryCounts.set(row.country, (countryCounts.get(row.country) ?? 0) + 1)
    }
  }

  const topCountries = Array.from(countryCounts.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    totalJobs: totalJobs ?? 0,
    remoteJobs: remoteJobs ?? 0,
    verifiedJobs: verifiedJobs ?? 0,
    avgSalary,
    topCountries,
  }
}

export async function getFilterOptions(): Promise<{
  departments: string[]
  countries: string[]
  companyTypes: string[]
}> {
  const supabase = await createClient()

  const [deptResult, countryResult, typeResult] = await Promise.all([
    supabase.from('jobs').select('department').not('department', 'is', null),
    supabase.from('jobs').select('country').not('country', 'is', null),
    supabase.from('jobs').select('company_type').not('company_type', 'is', null),
  ])

  if (deptResult.error) throw deptResult.error
  if (countryResult.error) throw countryResult.error
  if (typeResult.error) throw typeResult.error

  const departments = [...new Set((deptResult.data ?? []).map((r) => r.department!))].sort()
  const countries = [...new Set((countryResult.data ?? []).map((r) => r.country!))].sort()
  const companyTypes = [...new Set((typeResult.data ?? []).map((r) => r.company_type!))].sort()

  return { departments, countries, companyTypes }
}
