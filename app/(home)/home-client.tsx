'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'
import { motion } from 'framer-motion'
import {
  Search,
  ArrowRight,
  Sliders,
  Sparkles,
  ArrowUpRight,
  Building2,
  Shield,
  Coins,
  ArrowLeftRight,
  TrendingUp,
  Server,
  Cpu,
  Briefcase,
  Users,
  MapPin,
  DollarSign,
  BarChart3,
  CheckCircle2,
  Mail,
  Loader2,
  Eye,
  Zap,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CompanyLogo } from '@/components/jobs/company-logo'
import { JobCard } from '@/components/jobs/job-card'
import { staggerContainer, staggerItem, listContainer, listItem } from '@/lib/motion'
import { TOPIC_LABELS, TOPIC_COLORS, formatBlogDate } from '@/lib/blog'
import type { Job, Company } from '@/lib/types'
import type { BlogPost } from '@/lib/blog'

const sectionVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.0, 0.0, 0.2, 1] as const },
  },
}

const SECTOR_ICONS: Record<string, typeof Building2> = {
  TradFi: Building2,
  Infrastructure: Server,
  Custody: Shield,
  Stablecoin: Coins,
  Exchange: ArrowLeftRight,
  'Trading/Investment': TrendingUp,
  Hardware: Cpu,
}

const SECTORS = ['TradFi', 'Infrastructure', 'Custody', 'Stablecoin', 'Exchange', 'Trading/Investment', 'Hardware']

interface HomeClientProps {
  stats: {
    totalJobs: number
    remoteJobs: number
    verifiedJobs: number
    avgSalary: number
  }
  recentJobs: Job[]
  topCompanies: Company[]
  companyCount: number
  blogPosts: BlogPost[]
}

export function HomeClient({ stats, recentJobs, topCompanies, companyCount, blogPosts }: HomeClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(searchQuery ? `/jobs?search=${encodeURIComponent(searchQuery)}` : '/jobs')
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setNewsletterStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setNewsletterStatus('success')
        setEmail('')
        track('newsletter_signup')
      } else {
        setNewsletterStatus('error')
      }
    } catch {
      setNewsletterStatus('error')
    }
  }

  const remotePercent = stats.totalJobs > 0 ? Math.round((stats.remoteJobs / stats.totalJobs) * 100) : 0

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-white to-[#1a365d]/[0.02] pb-16 pt-12 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-2xl text-center"
          >
            <motion.h1
              variants={staggerItem}
              className="font-serif text-4xl font-normal text-[#1a365d] md:text-5xl"
            >
              Where TradFi meets digital asset careers
            </motion.h1>
            <motion.p
              variants={staggerItem}
              className="mx-auto mt-4 max-w-lg text-base text-slate-500 md:text-lg"
            >
              The curated job board for professionals moving between traditional finance and the digital asset economy.
            </motion.p>

            <motion.form
              variants={staggerItem}
              onSubmit={handleSearch}
              className="mx-auto mt-8 flex max-w-md gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search roles, companies, skills..."
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 transition-colors placeholder:text-slate-400 focus:border-[#1a365d]/40 focus:outline-none focus:ring-2 focus:ring-[#1a365d]/10"
                />
              </div>
              <Button
                type="submit"
                className="h-11 bg-[#d4a038] px-5 text-sm text-white hover:bg-[#c49030] active:scale-[0.98]"
              >
                Search
              </Button>
            </motion.form>

            <motion.div variants={staggerItem} className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 md:gap-4">
              <span>Popular:</span>
              {['Smart Contracts', 'Compliance', 'Trading', 'Engineering'].map((term) => (
                <Link
                  key={term}
                  href={`/jobs?search=${encodeURIComponent(term)}`}
                  className="rounded-md bg-slate-50 px-2 py-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#1a365d]"
                >
                  {term}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="mx-auto -mt-8 max-w-6xl px-4 md:-mt-12 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={sectionVariants}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-100/80 bg-slate-100/60 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] md:grid-cols-4"
        >
          {[
            { value: `${stats.totalJobs}+`, label: 'Open roles', icon: Briefcase },
            { value: `${companyCount}`, label: 'Companies hiring', icon: Building2 },
            { value: `$${Math.round(stats.avgSalary / 1000)}k`, label: 'Avg. salary', icon: DollarSign },
            { value: `${remotePercent}%`, label: 'Remote friendly', icon: MapPin },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex items-center gap-3 bg-white px-5 py-5 md:px-6 md:py-6">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1a365d]/5">
                  <Icon className="size-4 text-[#1a365d]" />
                </div>
                <div>
                  <p className="text-xl font-medium tabular-nums text-[#1a365d]">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </motion.div>
      </section>

      {/* Featured companies */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={sectionVariants}
          className="text-center"
        >
          <p className="text-xs font-medium text-[#d4a038]">Trusted by</p>
          <h2 className="mt-1 font-serif text-2xl font-normal text-[#1a365d]">Leading companies in digital assets</h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {topCompanies.map((company) => (
              <Link key={company.id} href={`/companies/${company.id}`} className="group flex flex-col items-center gap-2 transition-opacity hover:opacity-80">
                <CompanyLogo name={company.name} size="lg" />
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-[#1a365d]">{company.name}</span>
              </Link>
            ))}
          </div>
          <Link href="/companies" className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-[#1a365d] transition-colors hover:text-[#d4a038]">
            View all companies <ArrowRight className="size-3.5" />
          </Link>
        </motion.div>
      </section>

      {/* Browse by sector */}
      <section className="bg-[#1a365d]/[0.02] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={sectionVariants}>
            <div className="text-center">
              <p className="text-xs font-medium text-[#d4a038]">Explore</p>
              <h2 className="mt-1 font-serif text-2xl font-normal text-[#1a365d]">Browse by sector</h2>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {SECTORS.map((sector) => {
                const Icon = SECTOR_ICONS[sector] || Building2
                return (
                  <Link key={sector} href={`/jobs?sector=${encodeURIComponent(sector)}`} className="flex flex-col items-center gap-2.5 rounded-xl border border-slate-100/80 bg-white px-4 py-5 text-center transition-[border-color,box-shadow] duration-150 ease-out hover:border-slate-200/80 hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#1a365d]/5">
                      <Icon className="size-5 text-[#1a365d]" />
                    </div>
                    <span className="text-[13px] font-medium text-[#1a365d]">{sector}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest jobs */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={sectionVariants}>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-[#d4a038]">Latest</p>
              <h2 className="mt-1 font-serif text-2xl font-normal text-[#1a365d]">Recently posted roles</h2>
            </div>
            <Link href="/jobs" className="hidden items-center gap-1 text-sm font-medium text-[#1a365d] transition-colors hover:text-[#d4a038] md:flex">
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <motion.div variants={listContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-6 space-y-3">
            {recentJobs.map((job) => (
              <motion.div key={job.id} variants={listItem}>
                <JobCard job={job} variant="list" onClick={() => router.push(`/jobs/${job.id}`)} />
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-6 text-center md:hidden">
            <Link href="/jobs"><Button variant="outline" className="gap-1.5">View all positions <ArrowRight className="size-3.5" /></Button></Link>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="bg-[#1a365d]/[0.02] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={sectionVariants}>
            <div className="text-center">
              <p className="text-xs font-medium text-[#d4a038]">How it works</p>
              <h2 className="mt-1 font-serif text-2xl font-normal text-[#1a365d]">Find your next role in three steps</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { step: '01', icon: Sliders, title: 'Set your preferences', description: 'Tell us about your target sectors, skills, salary expectations, and work arrangement preferences.' },
                { step: '02', icon: Sparkles, title: 'Get matched', description: 'Our scoring algorithm ranks every role by how well it fits your profile, so the best matches surface first.' },
                { step: '03', icon: ArrowUpRight, title: 'Apply directly', description: 'Apply through verified listings with transparent salary data and direct links to the hiring company.' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.step} className="rounded-xl border border-slate-100/60 bg-white p-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-[#d4a038]">{item.step}</span>
                      <div className="flex size-9 items-center justify-center rounded-lg bg-[#1a365d]/5"><Icon className="size-4 text-[#1a365d]" /></div>
                    </div>
                    <h3 className="mt-4 text-[15px] font-medium text-[#1a365d]">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog / Insights */}
      {blogPosts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={sectionVariants}>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-medium text-[#d4a038]">Insights</p>
                <h2 className="mt-1 font-serif text-2xl font-normal text-[#1a365d]">From the blog</h2>
              </div>
              <Link href="/blog" className="hidden items-center gap-1 text-sm font-medium text-[#1a365d] transition-colors hover:text-[#d4a038] md:flex">
                All articles <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-xl border border-slate-100/60 bg-white transition-[border-color,box-shadow] duration-150 ease-out hover:border-slate-200/60 hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]"
                >
                  {post.image && (
                    <div className="aspect-[16/9] overflow-hidden rounded-t-xl bg-slate-100">
                      <img src={post.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${TOPIC_COLORS[post.topic] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        {TOPIC_LABELS[post.topic] || post.topic}
                      </span>
                      <span className="text-[11px] text-slate-400">{formatBlogDate(post.publishedAt)}</span>
                    </div>
                    <h3 className="mt-2.5 text-[15px] font-medium leading-snug text-[#1a365d] group-hover:text-[#d4a038]">{post.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center md:hidden">
              <Link href="/blog"><Button variant="outline" className="gap-1.5">All articles <ArrowRight className="size-3.5" /></Button></Link>
            </div>
          </motion.div>
        </section>
      )}

      {/* Employer CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={sectionVariants}
          className="relative overflow-hidden rounded-2xl bg-[#1a365d]"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-[#d4a038]/[0.06]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-white/[0.03]" />

          <div className="relative grid gap-10 px-6 py-12 md:grid-cols-2 md:gap-16 md:px-12 md:py-16">
            <div>
              <p className="text-xs font-medium text-[#d4a038]">For employers</p>
              <h2 className="mt-2 font-serif text-2xl font-normal text-white md:text-3xl">
                Hire digital asset talent that delivers
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Your next compliance lead, protocol engineer, or business development hire is already here. Reach qualified professionals across crypto, DeFi, and institutional finance with listings designed for high-intent candidates.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { icon: Eye, label: 'Targeted visibility', desc: 'Reach active job seekers in digital assets' },
                  { icon: Users, label: 'Qualified candidates', desc: 'TradFi + crypto hybrid professionals' },
                  { icon: BarChart3, label: 'Hiring analytics', desc: 'Track views, clicks, and applications' },
                  { icon: Zap, label: 'Fast turnaround', desc: 'Listings live within 24 hours' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label}>
                      <div className="flex items-center gap-2">
                        <Icon className="size-3.5 text-[#d4a038]" />
                        <span className="text-[13px] font-medium text-white">{item.label}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">{item.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="space-y-3">
                {[
                  { name: 'Standard', price: '$199', period: '30 days', features: ['Search visibility', 'Email alerts', 'Applicant tracking'] },
                  { name: 'Featured', price: '$399', period: '30 days', popular: true, features: ['Priority placement', 'Newsletter feature', 'Social promotion'] },
                  { name: 'Premium', price: '$599', period: '45 days', features: ['Dedicated support', 'Candidate curation', 'Analytics report'] },
                ].map((tier) => (
                  <div key={tier.name} className={`flex items-center justify-between rounded-lg px-4 py-3 ${tier.popular ? 'bg-white/[0.08] ring-1 ring-[#d4a038]/30' : 'bg-white/[0.04]'}`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{tier.name}</span>
                        {tier.popular && <span className="rounded bg-[#d4a038]/20 px-1.5 py-0.5 text-[9px] font-medium text-[#d4a038]">Popular</span>}
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-400">{tier.features.join(' · ')}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-sm font-medium text-white">{tier.price}</span>
                      <span className="text-[11px] text-slate-400"> / {tier.period}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/post-job" className="mt-5">
                <Button className="w-full bg-[#d4a038] text-sm text-white hover:bg-[#c49030] active:scale-[0.98]">
                  Post a job <ArrowRight className="ml-1.5 size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Newsletter + SEO content */}
      <section className="border-t border-slate-100 bg-[#1a365d]/[0.02] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={sectionVariants}>
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#1a365d]/5">
                  <Mail className="size-5 text-[#1a365d]" />
                </div>
                <h2 className="mt-4 font-serif text-2xl font-normal text-[#1a365d]">Weekly market intelligence</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Get curated job market insights, salary benchmarks, and career advice for digital asset professionals. No spam, unsubscribe anytime.
                </p>
                {newsletterStatus === 'success' ? (
                  <div className="mt-5 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span className="text-sm text-emerald-700">Check your inbox for a welcome email.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="mt-5 flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors placeholder:text-slate-400 focus:border-[#1a365d]/40 focus:outline-none focus:ring-2 focus:ring-[#1a365d]/10"
                    />
                    <Button type="submit" disabled={newsletterStatus === 'loading'} className="h-10 bg-[#1a365d] px-4 text-sm text-white hover:bg-[#2a4a7f] active:scale-[0.98] disabled:opacity-60">
                      {newsletterStatus === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Subscribe'}
                    </Button>
                  </form>
                )}
                {newsletterStatus === 'error' && <p className="mt-2 text-xs text-red-500">Something went wrong. Please try again.</p>}
                <p className="mt-3 text-[11px] text-slate-400">Join 2,000+ professionals receiving weekly updates.</p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-normal text-[#1a365d]">The digital asset job market</h2>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-500">
                  <p>
                    The digital asset industry has matured into a global financial infrastructure sector. Major institutions including BlackRock, JPMorgan, and Fidelity now operate dedicated digital asset divisions, creating roles that require traditional finance expertise alongside blockchain knowledge.
                  </p>
                  <p>
                    Professionals in compliance, risk management, and quantitative analysis are uniquely positioned to bridge the gap between TradFi and crypto — whether exploring tokenization, navigating digital asset regulation, or building on-chain infrastructure.
                  </p>
                </div>
                <div className="mt-6 space-y-2">
                  {[
                    { sector: 'Custody and infrastructure', companies: 'Fireblocks, BitGo, Anchorage, Copper.co' },
                    { sector: 'Exchanges and trading', companies: 'Coinbase, Kraken, OKX, Gemini' },
                    { sector: 'Stablecoins and payments', companies: 'Circle, Paxos, Stripe, PayPal' },
                  ].map((item) => (
                    <div key={item.sector} className="flex items-start gap-2 text-sm">
                      <Globe className="mt-0.5 size-3.5 shrink-0 text-[#d4a038]" />
                      <p className="text-slate-500"><span className="font-medium text-slate-600">{item.sector}</span> — {item.companies}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants} className="mx-auto max-w-xl text-center">
            <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-[#d4a038]/10">
              <Sparkles className="size-5 text-[#d4a038]" />
            </div>
            <h2 className="font-serif text-3xl font-normal text-[#1a365d] md:text-4xl">
              Your next career move starts here
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
              Browse {stats.totalJobs}+ verified roles at {companyCount} companies building the future of finance. Set your preferences and let the right opportunities find you.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/jobs">
                <Button className="w-full gap-1.5 bg-[#1a365d] px-8 text-sm text-white hover:bg-[#2a4a7f] active:scale-[0.98] sm:w-auto">
                  Browse jobs <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/tools/salary">
                <Button variant="outline" className="w-full gap-1.5 px-8 text-sm active:scale-[0.98] sm:w-auto">
                  Explore salaries
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
