import { createClient } from '@/lib/supabase/server'
import type { Tables, Company } from '@/lib/types'
import { mapRowToJob } from './jobs'
import type { Job } from '@/lib/types'

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

export function mapRowToCompany(row: Tables<'companies'>): Company {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    description: row.description,
    website: row.website,
    logoUrl: row.logo_url,
    headquarters: row.headquarters,
    employeeCount: row.employee_count,
    funding: row.funding,
    jobCount: row.job_count ?? 0,
  }
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getCompanies(): Promise<Company[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('job_count', { ascending: false })

  if (error) throw error

  return (data ?? []).map(mapRowToCompany)
}

export async function getCompanyById(
  id: string,
): Promise<{ company: Company; jobs: Job[] } | null> {
  const supabase = await createClient()

  const { data: companyData, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (companyError) {
    if (companyError.code === 'PGRST116') return null
    throw companyError
  }

  if (!companyData) return null

  const { data: jobsData, error: jobsError } = await supabase
    .from('jobs')
    .select('*')
    .eq('company', companyData.name)
    .order('posted_date', { ascending: false })

  if (jobsError) throw jobsError

  return {
    company: mapRowToCompany(companyData),
    jobs: (jobsData ?? []).map(mapRowToJob),
  }
}
