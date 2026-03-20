import type { Metadata } from 'next'
import { getJobs, getJobStats } from '@/lib/queries/jobs'
import { getCompanies } from '@/lib/queries/companies'
import { getRecentPosts } from '@/lib/blog'
import { HomeClient } from './home-client'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Digital Asset Jobs — Crypto, Blockchain & Web3 Careers',
  description: 'The premium job board for TradFi-to-crypto professionals. Find digital asset jobs at Coinbase, Fireblocks, Galaxy Digital, and 50+ leading companies.',
  keywords: ['digital asset jobs', 'crypto jobs', 'blockchain careers', 'TradFi to crypto', 'web3 jobs', 'defi jobs', 'fintech careers'],
}

export default async function HomePage() {
  const [stats, { jobs: recentJobs }, companies] = await Promise.all([
    getJobStats(),
    getJobs(undefined, 1, 5),
    getCompanies(),
  ])

  const topCompanies = companies
    .sort((a, b) => b.jobCount - a.jobCount)
    .slice(0, 12)

  const blogPosts = getRecentPosts(3)

  return (
    <>
      <HomeClient
        stats={stats}
        recentJobs={recentJobs}
        topCompanies={topCompanies}
        companyCount={companies.length}
        blogPosts={blogPosts}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Digital Asset Jobs',
            url: 'https://digitalassetjobs.com',
            description: 'Premium job board for TradFi-to-crypto professionals',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://digitalassetjobs.com/jobs?search={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </>
  )
}
