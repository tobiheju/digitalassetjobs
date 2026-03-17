'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, BadgeCheck, Search, ArrowRight, Shield, Users, BarChart3 } from 'lucide-react'
import { CompanyLogo } from '@/components/jobs/company-logo'
import { VerifiedBadge } from '@/components/ui/verified-badge'
import { cn } from '@/lib/utils'
import { listContainer, listItem } from '@/lib/motion'
import type { Company } from '@/lib/types'

interface CompanyWithVerified extends Company {
  verified: boolean
}

interface CompaniesClientProps {
  companies: CompanyWithVerified[]
}

export function CompaniesClient({ companies }: CompaniesClientProps) {
  const [search, setSearch] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const filtered = useMemo(() => {
    let list = companies
    if (verifiedOnly) list = list.filter((c) => c.verified)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.type?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      )
    }
    return list
  }, [companies, search, verifiedOnly])

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal text-[#1a365d]">Companies</h1>
        <p className="mt-2 text-sm text-slate-500">
          {filtered.length} {filtered.length === 1 ? 'company' : 'companies'} hiring in digital assets
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#1a365d] focus:outline-none focus:ring-1 focus:ring-[#1a365d]"
          />
        </div>
        <button
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-medium transition-[color,background-color,border-color,scale] duration-150 ease-out active:scale-[0.96]',
            verifiedOnly
              ? 'border-blue-200 bg-blue-50 text-blue-700'
              : 'border-slate-200 text-slate-500 hover:border-slate-300'
          )}
        >
          <BadgeCheck className="size-3.5" />
          Verified Only
        </button>
      </div>

      <motion.div variants={listContainer} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((company) => (
          <motion.div key={company.id} variants={listItem}>
            <Link
              href={`/companies/${company.id}`}
              className="group flex gap-4 rounded-xl border border-slate-100/60 bg-white p-4 transition-[border-color,box-shadow] duration-150 ease-out hover:border-slate-200/60 hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]"
            >
              <CompanyLogo name={company.name} size="lg" />
              <div className="min-w-0 flex-1">
                <h3 className="flex items-center gap-1 font-medium text-[#1a365d] group-hover:text-[#2c5282]">
                  {company.name}
                  {company.verified && <VerifiedBadge />}
                </h3>
                {company.type && (
                  <p className="text-xs text-slate-400">{company.type}</p>
                )}
                {company.description && (
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
                    {company.description}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-sans text-xs tabular-nums text-slate-400">
                    {company.jobCount} {company.jobCount === 1 ? 'job' : 'jobs'}
                  </span>
                  {company.website && (
                    <span
                      onClick={(e) => {
                        e.preventDefault()
                        window.open(company.website!, '_blank', 'noopener,noreferrer')
                      }}
                      className="inline-flex items-center gap-1 text-xs text-[#1a365d] hover:underline"
                    >
                      Website <ExternalLink className="size-3" />
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
          <p className="text-sm text-slate-500">No companies match your search.</p>
        </div>
      )}

      {/* Hiring manager CTA */}
      <div className="mt-12 rounded-2xl border border-[#1a365d]/10 bg-gradient-to-br from-[#1a365d] to-[#2c5282] p-8 md:p-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-lg">
            <h2 className="font-serif text-2xl font-normal text-white">
              Hire top digital asset talent
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Reach qualified candidates with verified experience in blockchain, DeFi, and traditional finance crossover roles.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-white/10">
                  <Shield className="size-3.5 text-[#d4a038]" />
                </div>
                <span className="text-xs text-white/80">Verified candidates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-white/10">
                  <Users className="size-3.5 text-[#d4a038]" />
                </div>
                <span className="text-xs text-white/80">Targeted reach</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-white/10">
                  <BarChart3 className="size-3.5 text-[#d4a038]" />
                </div>
                <span className="text-xs text-white/80">Hiring analytics</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/post-job"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d4a038] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#b8892f]"
            >
              Post a Job
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="mailto:employers@digitalassetjobs.com"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
