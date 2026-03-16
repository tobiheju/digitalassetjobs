import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const SUPABASE_URL = 'https://lrzgibiilqlsgqyhwwyh.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyemdpYmlpbHFsc2dxeWh3d3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NDEwMzMsImV4cCI6MjA4OTIxNzAzM30.6EiBB97yyFG2yp5VTeUFIjgSFRZAJpKN0pbXFJm1KiE'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Company descriptions from reference codebase
const companyDescriptions: Record<string, { description: string; website: string }> = {
  Coinbase: {
    description:
      'The largest US-based cryptocurrency exchange, providing a platform for buying, selling, and storing digital assets.',
    website: 'https://coinbase.com',
  },
  Fireblocks: {
    description:
      'Enterprise-grade platform for digital asset operations, offering secure custody, transfer, and issuance of digital assets.',
    website: 'https://fireblocks.com',
  },
  Circle: {
    description:
      'Global fintech firm and the issuer of USDC, one of the largest stablecoins.',
    website: 'https://circle.com',
  },
  Kraken: {
    description:
      'One of the oldest and most trusted cryptocurrency exchanges, known for security and a wide range of trading pairs.',
    website: 'https://kraken.com',
  },
  Binance: {
    description:
      "The world's largest cryptocurrency exchange by trading volume, offering spot, derivatives, and DeFi services.",
    website: 'https://binance.com',
  },
  Gemini: {
    description:
      'Regulated cryptocurrency exchange and custodian founded by the Winklevoss twins.',
    website: 'https://gemini.com',
  },
  Chainalysis: {
    description:
      'Blockchain analytics company providing data and investigation tools to governments, exchanges, and financial institutions.',
    website: 'https://chainalysis.com',
  },
  Alchemy: {
    description:
      'Web3 development platform powering major blockchain applications.',
    website: 'https://alchemy.com',
  },
  'Anchorage Digital': {
    description:
      'Federally chartered digital asset bank offering custody, trading, and financing services.',
    website: 'https://anchorage.com',
  },
  BitGo: {
    description:
      'Digital asset custody, trading, and finance platform serving institutional investors.',
    website: 'https://bitgo.com',
  },
  Paxos: {
    description:
      'Regulated blockchain infrastructure company enabling digital asset movement.',
    website: 'https://paxos.com',
  },
  Ledger: {
    description:
      'Leader in hardware wallet technology, securing over 20% of global crypto assets.',
    website: 'https://ledger.com',
  },
  'BlackRock Digital Assets': {
    description:
      "Digital assets division of the world's largest asset manager.",
    website: 'https://blackrock.com',
  },
  'Fidelity Digital Assets': {
    description:
      'Crypto arm of Fidelity Investments, providing custody and trading services for institutional investors.',
    website: 'https://fidelitydigitalassets.com',
  },
  'Goldman Sachs Digital': {
    description:
      'Digital assets division of Goldman Sachs, offering crypto trading, custody, and advisory services.',
    website: 'https://goldmansachs.com',
  },
  'JPMorgan Onyx': {
    description:
      "JPMorgan's blockchain division building enterprise solutions including JPM Coin.",
    website: 'https://jpmorgan.com/onyx',
  },
  'Uniswap Labs': {
    description:
      'Team behind Uniswap, the largest decentralized exchange.',
    website: 'https://uniswap.org',
  },
  Aave: {
    description:
      'Leading decentralized lending protocol enabling permissionless borrowing and lending.',
    website: 'https://aave.com',
  },
  Messari: {
    description:
      'Crypto market intelligence platform providing research, data, and tools.',
    website: 'https://messari.io',
  },
  'Copper.co': {
    description:
      'Digital asset custody and prime brokerage for institutional investors.',
    website: 'https://copper.co',
  },
  'Stripe Crypto': {
    description:
      "Stripe's crypto division enabling businesses to accept and pay out in cryptocurrency.",
    website: 'https://stripe.com/use-cases/crypto',
  },
}

interface ReferenceJob {
  id: string
  title: string
  company: string
  companyType: string
  location: string
  type: string
  department: string
  salary?: string
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  description: string
  requirements: string[]
  url: string
  postedDate: string
  tags: string[]
  featured?: boolean
  isRemote: boolean
  country: string
  countryCode: string
  city?: string
  verified: boolean
  verifiedAt?: string
}

async function seed() {
  console.log('Reading reference jobs.json...')
  const raw = readFileSync(
    resolve(__dirname, '../../digitalassetjobs/data/jobs.json'),
    'utf-8'
  )
  const data = JSON.parse(raw) as { jobs: ReferenceJob[] }
  console.log(`Found ${data.jobs.length} jobs`)

  // Extract unique companies
  const companyMap = new Map<string, { name: string; type: string; jobCount: number }>()
  for (const job of data.jobs) {
    const existing = companyMap.get(job.company)
    if (existing) {
      existing.jobCount++
    } else {
      companyMap.set(job.company, {
        name: job.company,
        type: job.companyType,
        jobCount: 1,
      })
    }
  }

  // Upsert companies
  const companies = Array.from(companyMap.values()).map((c) => {
    const info = companyDescriptions[c.name]
    return {
      id: c.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: c.name,
      type: c.type,
      description: info?.description ?? null,
      website: info?.website ?? null,
      job_count: c.jobCount,
    }
  })

  console.log(`Upserting ${companies.length} companies...`)
  const BATCH = 50
  for (let i = 0; i < companies.length; i += BATCH) {
    const batch = companies.slice(i, i + BATCH)
    const { error } = await supabase
      .from('companies')
      .upsert(batch, { onConflict: 'id' })
    if (error) {
      console.error(`Company batch ${i} error:`, error.message)
    }
  }
  console.log('Companies done.')

  // Upsert jobs
  const jobs = data.jobs.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    company_type: j.companyType,
    location: j.location,
    type: j.type,
    department: j.department,
    salary: j.salary ?? null,
    salary_display: j.salary ?? null,
    salary_min: j.salaryMin ?? null,
    salary_max: j.salaryMax ?? null,
    salary_currency: j.salaryCurrency ?? 'USD',
    description: j.description,
    requirements: j.requirements,
    url: j.url,
    posted_date: j.postedDate,
    tags: j.tags,
    featured: j.featured ?? false,
    is_remote: j.isRemote,
    country: j.country,
    country_code: j.countryCode,
    city: j.city ?? null,
    verified: j.verified,
    verified_at: j.verifiedAt ?? null,
    source: 'seed',
    work_arrangement: j.isRemote ? 'Remote' : 'On-site',
  }))

  console.log(`Upserting ${jobs.length} jobs...`)
  for (let i = 0; i < jobs.length; i += BATCH) {
    const batch = jobs.slice(i, i + BATCH)
    const { error } = await supabase
      .from('jobs')
      .upsert(batch, { onConflict: 'id' })
    if (error) {
      console.error(`Job batch ${i} error:`, error.message)
    } else {
      console.log(`  Batch ${i}-${i + batch.length} OK`)
    }
  }

  // Verify counts
  const { count: jobCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
  const { count: companyCount } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })

  console.log(`\nDone! ${jobCount} jobs, ${companyCount} companies in Supabase.`)
}

seed().catch(console.error)
