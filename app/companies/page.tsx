import { PageWrapper } from '@/components/layout/page-wrapper'
import { getCompanies } from '@/lib/queries/companies'
import { getJobs } from '@/lib/queries/jobs'
import { CompaniesClient } from './companies-client'

export const metadata = {
  title: 'Companies | Digital Asset Jobs',
  description: 'Explore leading companies hiring in digital assets, crypto, and blockchain.',
}

export default async function CompaniesPage() {
  const companies = await getCompanies()

  // Get verified company names (companies that have at least one verified job)
  const { jobs } = await getJobs({ verifiedOnly: true }, 1, 5000)
  const verifiedCompanyNames = new Set(jobs.map((j) => j.company))

  const companiesWithVerification = companies.map((c) => ({
    ...c,
    verified: verifiedCompanyNames.has(c.name),
  }))

  return (
    <PageWrapper>
      <CompaniesClient companies={companiesWithVerification} />
    </PageWrapper>
  )
}
