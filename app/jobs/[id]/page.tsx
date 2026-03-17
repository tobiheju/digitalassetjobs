import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  DollarSign,
  Share2,
  Clock,
  Monitor,
  Layers,
} from 'lucide-react'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { Badge } from '@/components/ui/badge'
import { VerifiedBadge } from '@/components/ui/verified-badge'
import { CompanyLogo } from '@/components/jobs/company-logo'
import { toTitleCase } from '@/lib/utils'
import { getJobById, getJobs } from '@/lib/queries/jobs'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await getJobById(id)
  if (!job) return { title: 'Not Found' }
  const ogTitle = `${job.title} at ${job.company}`
  const ogSubtitle = [job.location, job.workArrangement, job.salaryDisplay].filter(Boolean).join(' · ')
  return {
    title: `${job.title} at ${job.company} | Digital Asset Jobs`,
    description: job.description?.slice(0, 160),
    openGraph: {
      title: ogTitle,
      images: [`/api/og?title=${encodeURIComponent(ogTitle)}&subtitle=${encodeURIComponent(ogSubtitle)}`],
    },
  }
}

function formatRelativeDate(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return '1 week ago'
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 60) return '1 month ago'
  return `${Math.floor(diffDays / 30)} months ago`
}

// ---------------------------------------------------------------------------
// Rich description generator — builds multiple paragraphs from job metadata
// ---------------------------------------------------------------------------

function generateRichDescription(job: {
  title: string
  company: string
  companyType: string
  department: string | null
  location: string
  workArrangement: string
  type: string
  seniority: string | null
  salaryDisplay: string | null
  description: string
  requirements: string[]
  tags: string[]
  benefits: string[]
}) {
  const paragraphs: string[] = []

  // ── 1. Role overview ──
  const seniorityLabel = job.seniority ? `${job.seniority.toLowerCase()}-level ` : ''
  const deptLabel = job.department ? ` within the ${job.department} team` : ''
  paragraphs.push(
    `${job.company} is looking for a ${seniorityLabel}${job.title}${deptLabel}. ` +
    `This ${job.type.toLowerCase()} role is based in ${job.location} (${job.workArrangement}) ` +
    `and is part of the ${job.companyType.toLowerCase()} sector of the digital asset industry.`
  )

  // ── 2. What you'll do (from requirements & tags) ──
  if (job.requirements.length > 0) {
    const reqIntro = job.requirements.length >= 3
      ? `In this role, you will leverage expertise in ${job.requirements.slice(0, 2).join(' and ').toLowerCase()}. ` +
        `The position also requires ${job.requirements.slice(2).join(', ').toLowerCase()}.`
      : `This role requires experience with ${job.requirements.join(' and ').toLowerCase()}.`

    const tagContext = job.tags.length > 0
      ? ` You will be working across areas including ${job.tags.slice(0, 4).map(t => t.replace(/-/g, ' ')).join(', ')}.`
      : ''

    paragraphs.push(reqIntro + tagContext)
  }

  // ── 3. Company & sector context ──
  const sectorDescriptions: Record<string, string> = {
    'Infrastructure': 'building the foundational technology that powers the digital asset ecosystem',
    'Exchange': 'operating at the core of digital asset trading and market access',
    'Custody': 'securing and safeguarding digital assets for institutional and retail clients',
    'DeFi': 'pioneering decentralized financial protocols and on-chain innovation',
    'TradFi': 'bridging traditional finance with digital asset markets',
    'Trading/Investment': 'driving trading strategies and investment decisions in digital asset markets',
    'Stablecoin': 'developing and managing stablecoin infrastructure and payment systems',
    'Payments': 'enabling seamless digital payments and cross-border financial transactions',
    'Payments/Fintech': 'enabling seamless digital payments and cross-border financial transactions',
    'Research': 'providing intelligence and analytics to the digital asset industry',
    'Wallet': 'building secure wallet infrastructure for digital asset management',
  }

  const sectorDesc = sectorDescriptions[job.companyType] || 'operating in the digital asset space'
  paragraphs.push(
    `${job.company} is a ${job.companyType.toLowerCase()} company ${sectorDesc}. ` +
    `As a member of the team, you will play a key role in shaping the company's growth and impact in the evolving Web3 landscape.`
  )

  // ── 4. Compensation & logistics ──
  const parts: string[] = []
  if (job.salaryDisplay) {
    parts.push(`Compensation for this position ranges from ${job.salaryDisplay}`)
  }
  if (job.workArrangement === 'Remote') {
    parts.push('this is a fully remote position, offering flexibility to work from anywhere')
  } else if (job.workArrangement === 'Hybrid') {
    parts.push(`this hybrid role combines in-office presence in ${job.location.replace(/ \(.*\)/, '')} with remote flexibility`)
  } else {
    parts.push(`this role is based on-site at the ${job.location} office`)
  }

  if (job.benefits.length > 0) {
    parts.push(`benefits include ${job.benefits.slice(0, 3).join(', ')}`)
  }

  if (parts.length > 0) {
    paragraphs.push(parts[0] + (parts.length > 1 ? '. ' + parts.slice(1).map((p, i) => i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p).join('. ') + '.' : '.'))
  }

  return paragraphs
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await getJobById(id)
  if (!job) notFound()

  // Fetch a few similar jobs for the sidebar
  const { jobs: similarJobs } = await getJobs(
    { sectors: [job.companyType] },
    1,
    4,
  )
  const related = similarJobs.filter((j) => j.id !== job.id).slice(0, 3)

  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl">
        {/* Back link */}
        <Link
          href="/jobs"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-[#1a365d]"
        >
          <ArrowLeft className="size-3.5" />
          Back to Jobs
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main content */}
          <div>
            {/* Company hero banner */}
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6">
              <div className="flex items-start gap-4">
                <CompanyLogo name={job.company} size="lg" />
                <div className="min-w-0 flex-1">
                  <h1 className="font-serif text-2xl leading-tight text-[#1a365d]">
                    {job.title}
                  </h1>
                  <p className="mt-1 flex items-center gap-1 text-sm font-medium text-blue-600">
                    {job.company}
                    {job.verified && (
                      <VerifiedBadge />
                    )}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className="gap-1 text-xs bg-white/80">
                      <MapPin className="size-3" />
                      {job.location}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-white/80">
                      {job.workArrangement}
                    </Badge>
                    {job.type && (
                      <Badge variant="outline" className="text-xs bg-white/80">
                        {job.type}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Role Overview summary grid */}
            <div className="mt-6">
              <h2 className="mb-3 text-xs font-medium text-slate-400">
                Role Overview
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-slate-100 bg-white p-3">
                  <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                    <MapPin className="size-3.5" />
                    Location
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-[#1a365d]">
                    {job.location}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-white p-3">
                  <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                    <Monitor className="size-3.5" />
                    Work Type
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-[#1a365d]">
                    {job.workArrangement}
                  </p>
                </div>
                {job.type && (
                  <div className="rounded-lg border border-slate-100 bg-white p-3">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                      <Briefcase className="size-3.5" />
                      Job Type
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-[#1a365d]">
                      {job.type}
                    </p>
                  </div>
                )}
                {job.seniority && (
                  <div className="rounded-lg border border-slate-100 bg-white p-3">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                      <Layers className="size-3.5" />
                      Seniority
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-[#1a365d]">
                      {job.seniority}
                    </p>
                  </div>
                )}
                {job.department && (
                  <div className="rounded-lg border border-slate-100 bg-white p-3">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                      <Building2 className="size-3.5" />
                      Department
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-[#1a365d]">
                      {job.department}
                    </p>
                  </div>
                )}
                <div className="rounded-lg border border-slate-100 bg-white p-3">
                  <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                    <Calendar className="size-3.5" />
                    Posted Date
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-[#1a365d]">
                    {formatRelativeDate(job.postedDate)}
                  </p>
                </div>
                {job.salaryDisplay && (
                  <div className="rounded-lg border border-slate-100 bg-white p-3">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                      <DollarSign className="size-3.5" />
                      Salary
                    </div>
                    <p className="mt-1.5 font-sans text-sm font-medium tabular-nums text-[#1a365d]">
                      {job.salaryDisplay}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* About this role - expanded description */}
            <section className="mt-8">
              <h2 className="mb-3 text-xs font-medium text-slate-400">
                About this role
              </h2>
              {job.description && (
                <p className="border-l-2 border-[#d4a038] pl-4 text-base leading-relaxed text-slate-700 whitespace-pre-line">
                  {job.description}
                </p>
              )}
              <div className="mt-4 space-y-4">
                {generateRichDescription(job).map((paragraph, i) => (
                  <p key={i} className="text-[15px] leading-relaxed text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Apply CTA banner */}
            <div className="mt-8 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-6 py-4">
              <p className="text-sm font-medium text-[#1a365d]">Interested in this role?</p>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#d4a038] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b8892f]"
              >
                <ExternalLink className="size-3.5" />
                Apply Now
              </a>
            </div>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-3 text-xs font-medium text-slate-400">
                  Requirements
                </h2>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                  <ul className="space-y-3">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15px] text-slate-600">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1a365d]/10 font-sans text-[11px] font-medium tabular-nums text-[#1a365d]">
                          {i + 1}
                        </span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Skills */}
            {job.skills.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-3 text-xs font-medium text-slate-400">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="rounded-md bg-[#1a365d]/5 text-xs font-medium text-[#1a365d]"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Benefits */}
            {job.benefits.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-3 text-xs font-medium text-slate-400">
                  Benefits
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {job.benefits.map((benefit) => (
                    <Badge
                      key={benefit}
                      variant="outline"
                      className="rounded-md text-xs"
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            {job.tags.length > 0 && (
              <section className="mt-8 border-t pt-6">
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500"
                    >
                      {toTitleCase(tag)}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply card */}
            <div className="sticky top-20 space-y-4">
              <div className="rounded-xl border border-slate-100 bg-white p-5">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a365d] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2c5282]"
                >
                  <ExternalLink className="size-4" />
                  Apply Now
                </a>
                <div className="mt-3 flex items-center justify-between">
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="size-3" />
                    Posted {formatRelativeDate(job.postedDate)}
                  </p>
                  <Badge variant="outline" className="text-[10px] font-medium text-slate-500">
                    {job.companyType}
                  </Badge>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700">
                    <Heart className="size-3.5" />
                    Save
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700">
                    <Share2 className="size-3.5" />
                    Share
                  </button>
                </div>
              </div>

              {/* Company info */}
              <div className="rounded-xl border border-slate-100 bg-white p-5">
                <h3 className="mb-3 text-xs font-medium text-slate-400">
                  About {job.company}
                </h3>
                <div className="flex items-center gap-3">
                  <CompanyLogo name={job.company} size="md" />
                  <div>
                    <p className="flex items-center gap-1 text-sm font-medium text-[#1a365d]">
                      {job.company}
                      {job.verified && <VerifiedBadge />}
                    </p>
                    <p className="text-xs text-slate-500">{job.companyType}</p>
                  </div>
                </div>
              </div>

              {/* Similar jobs */}
              {related.length > 0 && (
                <div className="rounded-xl border border-slate-100 bg-white p-5">
                  <h3 className="mb-3 text-xs font-medium text-slate-400">
                    Similar Roles
                  </h3>
                  <div className="space-y-3">
                    {related.map((r) => (
                      <Link
                        key={r.id}
                        href={`/jobs/${r.id}`}
                        className="group block"
                      >
                        <p className="text-sm font-medium text-[#1a365d] group-hover:text-[#2c5282]">
                          {r.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {r.company} · {r.location}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
