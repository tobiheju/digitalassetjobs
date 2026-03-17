export type { Database, Tables, TablesInsert, TablesUpdate } from './database'

export interface Job {
  id: string
  title: string
  company: string
  companyType: string
  location: string
  type: string
  department: string | null
  salaryDisplay: string | null
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  description: string
  requirements: string[]
  url: string
  postedDate: string
  tags: string[]
  featured: boolean
  isRemote: boolean
  country: string | null
  countryCode: string | null
  city: string | null
  seniority: string | null
  workArrangement: string
  skills: string[]
  benefits: string[]
  verified: boolean
  source: string | null
}

export interface Company {
  id: string
  name: string
  type: string | null
  description: string | null
  website: string | null
  logoUrl: string | null
  headquarters: string | null
  employeeCount: string | null
  funding: string | null
  jobCount: number
}

export interface JobFilters {
  search?: string
  sectors?: string[]
  skills?: string[]
  workArrangements?: string[]
  jobTypes?: string[]
  seniorityLevels?: string[]
  countries?: string[]
  salaryMin?: number
  salaryMax?: number
  verifiedOnly?: boolean
}

export interface UserPreferences {
  sectors: string[]
  skills: string[]
  workArrangements: string[]
  jobTypes: string[]
  seniorityLevels: string[]
  salaryMin: number | null
  salaryMax: number | null
  verifiedOnly: boolean
}
