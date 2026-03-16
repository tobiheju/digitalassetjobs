import type { Tables, Job } from '@/lib/types'

export function mapRowToJob(row: Tables<'jobs'>): Job {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    companyType: row.company_type ?? '',
    location: row.location ?? '',
    type: row.type ?? '',
    department: row.department,
    salaryDisplay: row.salary_display,
    salaryMin: row.salary_min,
    salaryMax: row.salary_max,
    salaryCurrency: row.salary_currency ?? 'USD',
    description: row.description ?? '',
    requirements: row.requirements ?? [],
    url: row.url ?? '',
    postedDate: row.posted_date ?? '',
    tags: row.tags ?? [],
    featured: row.featured ?? false,
    isRemote: row.is_remote ?? false,
    country: row.country,
    countryCode: row.country_code,
    city: row.city,
    seniority: row.seniority,
    workArrangement: row.work_arrangement ?? '',
    skills: row.skills ?? [],
    benefits: row.benefits ?? [],
    verified: row.verified ?? false,
    source: row.source,
  }
}
