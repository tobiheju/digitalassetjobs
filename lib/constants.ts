export const SECTORS = [
  'TradFi',
  'Infrastructure',
  'Custody',
  'Stablecoin',
  'Exchange',
  'Trading/Investment',
  'Hardware',
] as const

export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'] as const

export const SENIORITY_LEVELS = [
  'Junior',
  'Mid',
  'Senior',
  'Lead',
  'Director',
  'VP',
  'C-Suite',
] as const

export const WORK_ARRANGEMENTS = ['Remote', 'Hybrid', 'On-site'] as const

export const SKILLS = [
  'Compliance',
  'AML/KYC',
  'Trading',
  'Custody',
  'DeFi',
  'Tokenization',
  'Risk Management',
  'Blockchain',
  'Smart Contracts',
  'Sales',
  'Legal',
  'Product',
  'Engineering',
  'Data',
  'Operations',
  'Marketing',
] as const

export const SALARY_BRACKETS = [50_000, 100_000, 150_000, 200_000, 250_000, 300_000] as const

export const BENEFITS = [
  'Equity',
  'Token Allocation',
  'Remote Work',
  'Health Insurance',
  'Visa Sponsorship',
  '401k/Pension',
  'Learning Budget',
  'Flexible Hours',
] as const

export type Sector = (typeof SECTORS)[number]
export type JobType = (typeof JOB_TYPES)[number]
export type SeniorityLevel = (typeof SENIORITY_LEVELS)[number]
export type WorkArrangement = (typeof WORK_ARRANGEMENTS)[number]
export type Skill = (typeof SKILLS)[number]
