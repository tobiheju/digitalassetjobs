import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Users,
  Globe,
  Calendar,
  Linkedin,
  BadgeCheck,
} from 'lucide-react'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { CompanyLogo } from '@/components/jobs/company-logo'
import { VerifiedBadge } from '@/components/ui/verified-badge'
import { JobCard } from '@/components/jobs/job-card'
import { getCompanyById } from '@/lib/queries/companies'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getCompanyById(id)
  if (!result) return { title: 'Not Found' }
  return {
    title: `${result.company.name} | Digital Asset Jobs`,
    description: result.company.description ?? `Jobs at ${result.company.name}`,
    openGraph: {
      title: result.company.name,
      images: [`/api/og?title=${encodeURIComponent(result.company.name)}&subtitle=${encodeURIComponent(`${result.jobs.length} open positions · ${result.company.type || 'Digital Assets'}`)}`],
    },
  }
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getCompanyById(id)
  if (!result) notFound()

  const { company, jobs } = result
  const hasVerifiedJobs = jobs.some((j) => j.verified)

  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl">
        {/* Back link */}
        <Link
          href="/companies"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-[#1a365d]"
        >
          <ArrowLeft className="size-3.5" />
          Back to Companies
        </Link>

        {/* Company hero */}
        <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <CompanyLogo name={company.name} size="lg" />
            <div className="min-w-0 flex-1">
              <h1 className="flex items-center gap-2 font-serif text-2xl text-[#1a365d] md:text-3xl">
                {company.name}
                {hasVerifiedJobs && <VerifiedBadge />}
              </h1>
              {company.type && (
                <p className="mt-1 text-sm text-slate-500">{company.type}</p>
              )}
              {company.description && (
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
                  {company.description}
                </p>
              )}

              {/* Meta pills */}
              <div className="mt-4 flex flex-wrap gap-3">
                {company.headquarters && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200">
                    <MapPin className="size-3.5 text-slate-400" />
                    {company.headquarters}
                  </span>
                )}
                {company.employeeCount && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200">
                    <Users className="size-3.5 text-slate-400" />
                    {company.employeeCount} employees
                  </span>
                )}
                {company.funding && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200">
                    {company.funding}
                  </span>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-medium text-[#1a365d] border border-slate-200 hover:bg-white transition-colors"
                  >
                    <Globe className="size-3.5" />
                    Website
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Open positions */}
        <section className="mt-10">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-lg font-medium text-[#1a365d]">
              Open Positions
            </h2>
            <span className="font-sans text-sm text-slate-400">
              {jobs.length} {jobs.length === 1 ? 'role' : 'roles'}
            </span>
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-3">
              {jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <JobCard job={job} variant="list" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
              <p className="text-sm text-slate-500">
                No open positions at this time.
              </p>
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  )
}
