# DAJ App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a premium, responsive job board web app for digital asset / TradFi-to-crypto professionals, powered by Supabase and live API aggregation.

**Architecture:** Next.js 16 App Router with Supabase as the data layer. Jobs are aggregated from free public APIs (Jobicy, Arbeitnow, Remotive) via edge functions, normalized to a unified schema, and verified by crawling source URLs. The frontend uses shadcn/ui + Tailwind v4 + Framer Motion for a refined, professional experience.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, Visx, Supabase (Postgres + Edge Functions), Vercel

**Supabase Project:** `https://lrzgibiilqlsgqyhwwyh.supabase.co`

**Reference codebase:** `/Users/marius/daj/digitalassetjobs/` (existing site — use for data models, job data seed, design patterns)

---

## Phase 1: Project Scaffolding

### Task 1: Initialize Next.js 16 Project

**Files:**
- Create: `/Users/marius/daj/daj-app/package.json`
- Create: `/Users/marius/daj/daj-app/tsconfig.json`
- Create: `/Users/marius/daj/daj-app/next.config.ts`
- Create: `/Users/marius/daj/daj-app/app/layout.tsx`
- Create: `/Users/marius/daj/daj-app/app/page.tsx`

**Step 1: Scaffold project**

```bash
cd /Users/marius/daj
npx create-next-app@latest daj-app --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack
```

Accept defaults. This creates the base Next.js 16 project with Tailwind v4.

**Step 2: Verify it runs**

```bash
cd /Users/marius/daj/daj-app
npm run dev
```

Expected: Dev server at localhost:3000 with default Next.js page.

**Step 3: Install core dependencies**

```bash
cd /Users/marius/daj/daj-app
npm install framer-motion @supabase/supabase-js @supabase/ssr lucide-react class-variance-authority clsx tailwind-merge
npm install -D @types/node
```

**Step 4: Initialize shadcn**

Use the shadcn skill (@shadcn) to initialize. Run:

```bash
cd /Users/marius/daj/daj-app
npx shadcn@latest init
```

Choose: New York style, Slate base color, CSS variables: yes.

**Step 5: Add core shadcn components**

```bash
npx shadcn@latest add button badge card input separator sheet dialog slider tabs tooltip skeleton
```

**Step 6: Initialize git and commit**

```bash
cd /Users/marius/daj/daj-app
git init
git add -A
git commit -m "feat: scaffold Next.js 16 project with Tailwind v4, shadcn/ui, Framer Motion, Supabase"
```

---

### Task 2: Configure Design System & Globals

**Files:**
- Modify: `app/globals.css`
- Create: `lib/motion.ts`
- Create: `lib/constants.ts`
- Create: `lib/utils.ts` (may already exist from shadcn init)
- Modify: `app/layout.tsx`

**Step 1: Configure Tailwind theme colors in globals.css**

Add custom CSS variables to the existing globals.css (shadcn will have created some already). Extend with:

```css
:root {
  --color-navy: #1a365d;
  --color-navy-light: #2c5282;
  --color-gold: #d4a038;
  --color-gold-light: #e8b954;
}
```

Also add global scrollbar hiding:

```css
* {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
*::-webkit-scrollbar {
  display: none;
}
```

**Step 2: Create centralized animation module**

Create `lib/motion.ts`:

```typescript
// Easing curves
export const easing = {
  standard: [0.25, 0.1, 0.25, 1] as const,
  emphasis: [0.0, 0.0, 0.2, 1] as const,
  micro: [0.4, 0.0, 0.6, 1] as const,
}

// Duration presets (seconds)
export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
}

// Spring configs
export const spring = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  default: { type: 'spring' as const, stiffness: 300, damping: 24 },
  snappy: { type: 'spring' as const, stiffness: 500, damping: 30 },
}

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 8, filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: duration.normal, ease: easing.emphasis },
  },
  exit: {
    opacity: 0,
    y: -4,
    filter: 'blur(6px)',
    transition: { duration: duration.fast, ease: easing.standard },
  },
}

// Stagger config
export const stagger = {
  item: 0.06,
  container: 0.15,
}

// List container variants
export const listContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.item,
      delayChildren: stagger.container,
    },
  },
}

// List item variants
export const listItem = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easing.emphasis },
  },
}

// Micro-interaction props for interactive elements
export const interactive = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: spring.snappy,
}

// Reduced motion media query helper
export const reducedMotion = {
  initial: { opacity: 1, y: 0, filter: 'blur(0px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.01 } },
  exit: { opacity: 0, transition: { duration: 0.01 } },
}
```

**Step 3: Create taxonomy constants**

Create `lib/constants.ts`:

```typescript
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
```

**Step 4: Configure layout with Inter font**

Modify `app/layout.tsx` to use Inter from `next/font/google`, set metadata (title: "Digital Asset Jobs", description), and wrap children in a body with `antialiased` class.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: configure design system — colors, motion module, taxonomy constants"
```

---

### Task 3: Supabase Setup — Create Schema

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/types/database.ts`

**Step 1: Create Supabase tables via MCP**

Use the Supabase MCP `apply_migration` tool to create the schema. Migration name: `create_initial_schema`.

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Jobs table
CREATE TABLE public.jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_type TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Full-time',
  department TEXT,
  salary_display TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  url TEXT NOT NULL,
  posted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  is_remote BOOLEAN DEFAULT FALSE,
  country TEXT,
  country_code TEXT,
  city TEXT,
  seniority TEXT,
  work_arrangement TEXT DEFAULT 'Remote',
  skills TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  source TEXT,
  source_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Companies table
CREATE TABLE public.companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT,
  description TEXT,
  long_description TEXT,
  website TEXT,
  careers_url TEXT,
  logo_url TEXT,
  founded INTEGER,
  headquarters TEXT,
  employee_count TEXT,
  funding TEXT,
  tags TEXT[] DEFAULT '{}',
  linkedin_url TEXT,
  twitter_url TEXT,
  why_work_here TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  job_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job sources tracking
CREATE TABLE public.job_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,
  last_fetched_at TIMESTAMPTZ,
  jobs_fetched INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification logs
CREATE TABLE public.verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT REFERENCES public.jobs(id) ON DELETE CASCADE,
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  status_code INTEGER,
  is_valid BOOLEAN DEFAULT FALSE,
  error_message TEXT
);

-- Indexes
CREATE INDEX idx_jobs_company ON public.jobs(company);
CREATE INDEX idx_jobs_company_type ON public.jobs(company_type);
CREATE INDEX idx_jobs_department ON public.jobs(department);
CREATE INDEX idx_jobs_is_remote ON public.jobs(is_remote);
CREATE INDEX idx_jobs_country ON public.jobs(country);
CREATE INDEX idx_jobs_verified ON public.jobs(verified);
CREATE INDEX idx_jobs_posted_date ON public.jobs(posted_date DESC);
CREATE INDEX idx_jobs_salary_min ON public.jobs(salary_min);
CREATE INDEX idx_jobs_featured ON public.jobs(featured);
CREATE INDEX idx_jobs_title_trgm ON public.jobs USING gin(title gin_trgm_ops);
CREATE INDEX idx_jobs_source ON public.jobs(source);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS policies (public read, service role write)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Service insert jobs" ON public.jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update jobs" ON public.jobs FOR UPDATE USING (true);
CREATE POLICY "Service insert companies" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update companies" ON public.companies FOR UPDATE USING (true);
CREATE POLICY "Service insert sources" ON public.job_sources FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update sources" ON public.job_sources FOR UPDATE USING (true);
CREATE POLICY "Service insert verification" ON public.verification_logs FOR INSERT WITH CHECK (true);
```

**Step 2: Create Supabase client utilities**

Create `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

Create `lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server component — ignore
          }
        },
      },
    }
  )
}
```

**Step 3: Create `.env.local`**

```env
NEXT_PUBLIC_SUPABASE_URL=https://lrzgibiilqlsgqyhwwyh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyemdpYmlpbHFsc2dxeWh3d3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NDEwMzMsImV4cCI6MjA4OTIxNzAzM30.6EiBB97yyFG2yp5VTeUFIjgSFRZAJpKN0pbXFJm1KiE
```

**Step 4: Create TypeScript types for database**

Create `lib/types/database.ts` matching the schema above. Use the Supabase MCP `generate_typescript_types` tool.

**Step 5: Commit**

```bash
git add lib/supabase lib/types .env.local
git commit -m "feat: configure Supabase schema, client, server utils, and types"
```

---

### Task 4: Seed Supabase with Existing Job Data

**Files:**
- Create: `scripts/seed.ts`
- Read: `/Users/marius/daj/digitalassetjobs/data/jobs.json` (reference)

**Step 1: Write seed script**

Create `scripts/seed.ts` that:
1. Reads all 321 jobs from the reference `data/jobs.json`
2. Maps camelCase fields to snake_case DB columns
3. Extracts unique companies and builds company records (using the `companyDescriptions` from reference `lib/jobs.ts`)
4. Upserts companies first, then jobs, in batches of 50
5. Uses Supabase service role key (from env) for writes

**Step 2: Run seed script**

```bash
npx tsx scripts/seed.ts
```

Expected: 321 jobs and ~56 companies inserted.

**Step 3: Verify via Supabase MCP**

Use `execute_sql` to run:
```sql
SELECT COUNT(*) as job_count FROM public.jobs;
SELECT COUNT(*) as company_count FROM public.companies;
```

Expected: 321 jobs, ~56 companies.

**Step 4: Commit**

```bash
git add scripts/seed.ts
git commit -m "feat: add seed script — populate Supabase with 321 jobs from reference data"
```

---

## Phase 2: Data Access Layer

### Task 5: Supabase Data Queries

**Files:**
- Create: `lib/queries/jobs.ts`
- Create: `lib/queries/companies.ts`
- Create: `lib/types/index.ts`

**Step 1: Create shared types**

Create `lib/types/index.ts` that re-exports database types and defines app-level types:

```typescript
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
}
```

**Step 2: Create jobs query module**

Create `lib/queries/jobs.ts` with functions:
- `getJobs(filters?: JobFilters, page?: number, pageSize?: number)` — paginated, filtered query
- `getJobById(id: string)` — single job
- `getFeaturedJobs(limit?: number)` — featured jobs
- `getJobStats()` — total count, remote count, salary stats
- `getFilterOptions()` — distinct departments, countries, etc. for filter dropdowns

All queries use the Supabase server client. Map snake_case DB rows to camelCase app types.

**Step 3: Create companies query module**

Create `lib/queries/companies.ts` with functions:
- `getCompanies()` — all companies with job counts
- `getCompanyById(id: string)` — single company with its jobs

**Step 4: Commit**

```bash
git add lib/queries lib/types
git commit -m "feat: add Supabase query layer — jobs, companies, filters"
```

---

### Task 6: Match Scoring Algorithm

**Files:**
- Create: `lib/scoring.ts`

**Step 1: Implement scoring module**

Create `lib/scoring.ts`:

```typescript
import { Job, UserPreferences } from '@/lib/types'

const WEIGHTS = {
  sector: 30,
  skills: 25,
  salary: 20,
  workArrangement: 10,
  jobType: 10,
  seniority: 5,
} as const

// Deterministic hash for fallback scores (65-95 range)
function hashScore(jobId: string): number {
  let hash = 0
  for (let i = 0; i < jobId.length; i++) {
    const char = jobId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return 65 + Math.abs(hash % 31) // 65-95
}

export function calculateMatchScore(job: Job, prefs: UserPreferences): number {
  const hasPrefs =
    prefs.sectors.length > 0 ||
    prefs.skills.length > 0 ||
    prefs.workArrangements.length > 0 ||
    prefs.jobTypes.length > 0 ||
    prefs.seniorityLevels.length > 0 ||
    prefs.salaryMin !== null ||
    prefs.salaryMax !== null

  if (!hasPrefs) return hashScore(job.id)

  let score = 0

  // Sector match (30pts)
  if (prefs.sectors.length > 0 && prefs.sectors.includes(job.companyType)) {
    score += WEIGHTS.sector
  }

  // Skills overlap (25pts, pro-rated)
  if (prefs.skills.length > 0) {
    const matching = job.skills.filter(s => prefs.skills.includes(s)).length
    score += Math.round((matching / prefs.skills.length) * WEIGHTS.skills)
  }

  // Salary distance (20pts)
  if ((prefs.salaryMin !== null || prefs.salaryMax !== null) && job.salaryMin !== null) {
    const prefMid = ((prefs.salaryMin ?? 0) + (prefs.salaryMax ?? 500000)) / 2
    const jobMid = ((job.salaryMin ?? 0) + (job.salaryMax ?? job.salaryMin ?? 0)) / 2
    const distance = Math.abs(prefMid - jobMid)
    const maxDistance = 300000
    score += Math.round(Math.max(0, 1 - distance / maxDistance) * WEIGHTS.salary)
  }

  // Work arrangement (10pts)
  if (prefs.workArrangements.length > 0) {
    if (prefs.workArrangements.includes(job.workArrangement)) {
      score += WEIGHTS.workArrangement
    } else if (prefs.workArrangements.includes('Remote') && job.isRemote) {
      score += WEIGHTS.workArrangement
    }
  }

  // Job type (10pts)
  if (prefs.jobTypes.length > 0 && prefs.jobTypes.includes(job.type)) {
    score += WEIGHTS.jobType
  }

  // Seniority (5pts)
  if (prefs.seniorityLevels.length > 0 && job.seniority && prefs.seniorityLevels.includes(job.seniority)) {
    score += WEIGHTS.seniority
  }

  // Clamp to 10-95
  return Math.max(10, Math.min(95, score))
}

export function getScoreColor(score: number) {
  if (score >= 85) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
  return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
}
```

**Step 2: Commit**

```bash
git add lib/scoring.ts
git commit -m "feat: add match scoring algorithm — weighted multi-factor with deterministic fallback"
```

---

## Phase 3: Core UI Components

### Task 7: Layout Shell — Header, Navigation, Page Wrapper

**Files:**
- Create: `components/layout/header.tsx`
- Create: `components/layout/bottom-nav.tsx`
- Create: `components/layout/page-wrapper.tsx`
- Modify: `app/layout.tsx`

**Step 1: Build Header**

`components/layout/header.tsx`:
- Logo mark (top-left): "DAJ" or "DigitalAssetJobs" text logo in navy
- Center: view toggle (list/card icons) — visible on discover page only
- Right: preferences button with active filter count badge (small emerald circle with number)
- Gradient fade background on scroll (transparent -> white with backdrop-blur)
- Sticky top, z-50

**Step 2: Build Bottom Nav (mobile)**

`components/layout/bottom-nav.tsx`:
- 5 tabs: Discover, Saved, Applied, Tools, Profile
- Lucide icons for each
- Active tab: navy fill + spring-animated indicator bar
- `hidden md:hidden` — only visible below 769px
- Safe area padding: `pb-[env(safe-area-inset-bottom)]`

**Step 3: Build Desktop Nav**

Integrate into header for `md:` breakpoint and above. Same 5 sections as horizontal links.

**Step 4: Build Page Wrapper**

`components/layout/page-wrapper.tsx`:
- Wraps page content with AnimatePresence + motion.div using `pageTransition` variants from `lib/motion.ts`
- Reduced motion support via `useReducedMotion()` from Framer Motion
- Max-width container: `max-w-[1100px] mx-auto px-4`

**Step 5: Wire into layout.tsx**

Update `app/layout.tsx` to include Header, main content area, and BottomNav.

**Step 6: Commit**

```bash
git add components/layout app/layout.tsx
git commit -m "feat: add layout shell — header, bottom nav, page wrapper with transitions"
```

---

### Task 8: Job Card Component

**Files:**
- Create: `components/jobs/job-card.tsx`
- Create: `components/jobs/match-badge.tsx`
- Create: `components/jobs/company-logo.tsx`

**Step 1: Build CompanyLogo**

`components/jobs/company-logo.tsx`:
- Takes `name: string` and optional `logoUrl: string`
- If logoUrl: render img with fallback to initials
- Initials fallback: colored circle (deterministic color from company name hash) + first letter
- Size variants: sm (32px), md (40px), lg (56px)

**Step 2: Build MatchBadge**

`components/jobs/match-badge.tsx`:
- Takes `score: number`
- Uses `getScoreColor()` from `lib/scoring.ts`
- Renders: `<Badge>` with `{score}% Match`
- Green for >= 85%, amber otherwise

**Step 3: Build JobCard — list variant**

`components/jobs/job-card.tsx`:
- Uses shadcn `Card`
- Layout: CompanyLogo (left), content (center), match badge + salary (right)
- Content: title (font-semibold, navy), company name, location + work arrangement badges
- Tags: max 3, `+N more` overflow text
- Description: 2-line clamp
- Posted date: relative format ("2 days ago")
- Hover: subtle lift via `motion.div` with `interactive` props from motion.ts
- `onClick` opens job detail sheet
- Responsive: stacks vertically on mobile

**Step 4: Build JobCard — compact card variant**

Same component, `variant="compact"` prop:
- Horizontal single-row: logo, title, company, salary, match badge
- No description, no tags
- For dense browsing

**Step 5: Commit**

```bash
git add components/jobs
git commit -m "feat: add JobCard component — list and compact variants with match scoring"
```

---

### Task 9: Preferences Panel

**Files:**
- Create: `components/preferences/preferences-panel.tsx`
- Create: `components/preferences/chip-select.tsx`
- Create: `components/preferences/salary-range-slider.tsx`
- Create: `lib/hooks/use-preferences.ts`

**Step 1: Create preferences hook**

`lib/hooks/use-preferences.ts`:
- `usePreferences()` hook using `useState` + `localStorage`
- Returns `{ preferences, setPreferences, resetPreferences, activeFilterCount }`
- `UserPreferences` type from `lib/types`
- Persist to localStorage key `daj-preferences`
- `activeFilterCount`: number of non-empty preference fields

**Step 2: Build ChipSelect**

`components/preferences/chip-select.tsx`:
- Takes `options: string[]`, `selected: string[]`, `onChange`
- Renders horizontally wrapping chips
- Selected: navy bg, white text. Unselected: slate-100 bg, slate-600 text
- Tap animation via `interactive` motion props
- Multi-select toggle behavior

**Step 3: Build SalaryRangeSlider**

`components/preferences/salary-range-slider.tsx`:
- Dual-thumb range slider using shadcn `Slider`
- Min: $0, Max: $500k, step: $10k
- Display formatted values: "$120k — $250k"
- Navy accent color on track fill

**Step 4: Build PreferencesPanel**

`components/preferences/preferences-panel.tsx`:
- Desktop (md+): right sidebar panel, fixed position, scrollable
- Mobile (< md): shadcn `Sheet` from bottom with drag handle
- Sections (each with ChipSelect):
  - Sectors (from SECTORS constant)
  - Skills (from SKILLS constant)
  - Work Arrangement (from WORK_ARRANGEMENTS)
  - Job Type (from JOB_TYPES)
  - Seniority (from SENIORITY_LEVELS)
  - Salary Range (SalaryRangeSlider)
- Footer: "Reset All" (ghost button) + "Apply Filters" (navy button)
- Spring animation on open/close (gentle config)

**Step 5: Commit**

```bash
git add components/preferences lib/hooks
git commit -m "feat: add preferences panel — chip selects, salary slider, responsive layout"
```

---

### Task 10: Job Detail Sheet

**Files:**
- Create: `components/jobs/job-detail-sheet.tsx`

**Step 1: Build JobDetailSheet**

`components/jobs/job-detail-sheet.tsx`:
- Portal-based overlay
- Desktop (md+): right sidebar panel (width ~480px), doesn't replace page content
- Mobile: full-height bottom sheet using shadcn `Sheet`
- Spring animation on open/close (gentle config from motion.ts)
- Close via: X button, overlay click, Escape key
- Content sections:
  - Header: company logo, title, company, location, salary, match badge
  - Description: full text, rendered as markdown or plain text
  - Requirements: bullet list
  - Skills: tag chips
  - Benefits: tag chips (if available)
  - Posted date, source
- Actions footer (sticky bottom):
  - "Apply" button (navy, opens external URL in new tab)
  - "Save" button (outline, heart icon toggle)
- Scroll body independently of page

**Step 2: Commit**

```bash
git add components/jobs/job-detail-sheet.tsx
git commit -m "feat: add job detail sheet — portal-based with spring animation"
```

---

## Phase 4: Pages

### Task 11: Discover Page (Home)

**Files:**
- Modify: `app/page.tsx`
- Create: `components/jobs/job-list.tsx`
- Create: `components/jobs/view-toggle.tsx`

**Step 1: Build ViewToggle**

`components/jobs/view-toggle.tsx`:
- Two icon buttons: list view, card/grid view
- Active state: navy bg. Inactive: slate-100
- Spring animation on toggle
- Persists to localStorage

**Step 2: Build JobList**

`components/jobs/job-list.tsx`:
- Takes `jobs: Job[]`, `view: 'list' | 'card'`, `preferences: UserPreferences`
- Computes match scores for each job via `calculateMatchScore()`
- Sorts by: featured first, then match score descending
- Renders with staggered animation (listContainer + listItem variants)
- List view: single column, full-width cards
- Card view: responsive grid (1 col mobile, 2 tablet, 3 desktop)
- Loading state: skeleton cards (shimmer)
- Empty state: "No jobs match your filters" with reset button
- Pagination: "Load more" button or intersection observer

**Step 3: Build Discover page**

`app/page.tsx`:
- Server component that fetches initial jobs from Supabase
- Passes to client component wrapper that handles:
  - Preferences state
  - View toggle state
  - Job detail sheet open/close
  - Client-side filtering + scoring
- Layout: main content (left/center) + preferences panel (right sidebar on desktop)
- Header shows: job count, active filter badge

**Step 4: Commit**

```bash
git add app/page.tsx components/jobs/job-list.tsx components/jobs/view-toggle.tsx
git commit -m "feat: build discover page — job list with filtering, scoring, and view toggle"
```

---

### Task 12: Saved & Applied Pages

**Files:**
- Create: `app/saved/page.tsx`
- Create: `app/applied/page.tsx`
- Create: `lib/hooks/use-saved-jobs.ts`

**Step 1: Create saved jobs hook**

`lib/hooks/use-saved-jobs.ts`:
- `useSavedJobs()` — localStorage-backed
- Returns `{ savedIds, save, unsave, isSaved }`
- Same pattern for applied: `useAppliedJobs()`

**Step 2: Build Saved page**

`app/saved/page.tsx`:
- Fetches saved job IDs from localStorage
- Queries Supabase for those jobs
- Renders same JobList component
- Empty state: "No saved jobs yet. Browse jobs and tap the heart to save."

**Step 3: Build Applied page**

`app/applied/page.tsx`:
- Same pattern as Saved
- Track when user clicks "Apply" — adds to applied list with timestamp
- Shows applied date on cards

**Step 4: Commit**

```bash
git add app/saved app/applied lib/hooks
git commit -m "feat: add saved and applied pages with localStorage persistence"
```

---

### Task 13: Tools Section

**Files:**
- Create: `app/tools/page.tsx`
- Create: `app/tools/salary/page.tsx`
- Create: `app/tools/skills/page.tsx`
- Create: `app/tools/quiz/page.tsx`
- Create: `app/tools/insights/page.tsx`

**Step 1: Install Visx**

```bash
npm install @visx/group @visx/shape @visx/scale @visx/axis @visx/grid @visx/tooltip @visx/responsive @visx/text @visx/gradient
```

**Step 2: Build Tools grid page**

`app/tools/page.tsx`:
- 2x2 grid of tool cards (responsive: 1 col mobile, 2 desktop)
- Each card: colored icon box (left), title + description (right)
- Cards:
  1. Salary Explorer — gold icon box — "Compare salaries by sector, location, and seniority"
  2. Skills Demand — emerald icon box — "See which skills are most in-demand right now"
  3. Job Match Quiz — blue icon box — "Find your perfect role in 5 questions"
  4. Market Insights — purple icon box — "Data-driven view of the digital asset job market"
- Stagger animation on mount
- Each card links to its sub-page

**Step 3: Build Salary Explorer**

`app/tools/salary/page.tsx`:
- Filters: sector dropdown, location dropdown, seniority dropdown
- Fetches aggregated salary data from Supabase (server component or client query)
- Display: min / avg / max stat cards
- Horizontal bar chart (Visx) showing salary ranges by selected dimension
- Responsive chart via `@visx/responsive` ParentSize

**Step 4: Build Skills Demand**

`app/tools/skills/page.tsx`:
- Aggregates `skills` array across all jobs
- Ranks by frequency
- Horizontal bar chart: skill name (left), bar (right), count label
- Filterable by sector
- Uses Visx BarGroupHorizontal or custom bars

**Step 5: Build Job Match Quiz**

`app/tools/quiz/page.tsx`:
- 5-question flow, one question per screen
- Questions:
  1. "Which sectors interest you?" (chip multi-select from SECTORS)
  2. "What are your key skills?" (chip multi-select from SKILLS)
  3. "What's your target salary range?" (salary slider)
  4. "How do you prefer to work?" (chip select from WORK_ARRANGEMENTS)
  5. "What seniority level?" (chip select from SENIORITY_LEVELS)
- Animated page transitions between questions (pageTransition variants)
- Progress bar at top
- Result: saves answers as preferences + shows top 10 matching jobs with scores
- "View All Matches" button goes to discover page with preferences applied

**Step 6: Build Market Insights**

`app/tools/insights/page.tsx`:
- Dashboard with 4-5 Visx charts:
  - Sector breakdown (donut chart)
  - Location distribution (horizontal bar)
  - Salary histogram (vertical bar)
  - Skills frequency heatmap (grid of colored cells)
  - Seniority vs. average salary (grouped bar)
- All data aggregated from Supabase
- Responsive layout: 2-col grid desktop, stacked mobile

**Step 7: Commit**

```bash
git add app/tools
git commit -m "feat: add tools section — salary explorer, skills demand, quiz, market insights"
```

---

### Task 14: Profile Page

**Files:**
- Create: `app/profile/page.tsx`

**Step 1: Build Profile page**

`app/profile/page.tsx`:
- Displays current preferences (read from localStorage hook)
- Edit preferences inline (reuses ChipSelect, SalaryRangeSlider)
- Stats: saved count, applied count
- "Reset All Preferences" button
- No auth — purely local

**Step 2: Commit**

```bash
git add app/profile
git commit -m "feat: add profile page — preferences display and management"
```

---

## Phase 5: Data Pipeline

### Task 15: Job Aggregation Edge Function

**Files:**
- Deploy via Supabase MCP: `aggregate-jobs` edge function

**Step 1: Build aggregation function**

Edge function `aggregate-jobs` that:
1. Fetches from 3 APIs in parallel via `Promise.allSettled`:
   - Jobicy: `https://jobicy.com/api/v2/remote-jobs?tag=crypto&count=50`
   - Arbeitnow: `https://www.arbeitnow.com/api/job-board-api` (filter for crypto/blockchain/fintech)
   - Remotive: `https://remotive.com/api/remote-jobs?category=finance&limit=50`
2. Normalizes each API response to the unified job schema (snake_case for DB)
3. Generates deterministic job ID from: source + company + title hash
4. Deduplicates by checking existing IDs in Supabase
5. Upserts new jobs
6. Updates `job_sources` table with fetch timestamp and count
7. Returns summary: `{ jobicy: N, arbeitnow: N, remotive: N, total_new: N }`

Graceful failure: if one API fails, the others still process.

**Step 2: Deploy via Supabase MCP**

Use `deploy_edge_function` tool.

**Step 3: Test by invoking the function**

Call the edge function URL and verify jobs appear in DB.

**Step 4: Commit (document the function)**

```bash
git add docs/edge-functions.md
git commit -m "feat: deploy aggregate-jobs edge function — 3 API sources with graceful failure"
```

---

### Task 16: Job Verification Edge Function

**Files:**
- Deploy via Supabase MCP: `verify-jobs` edge function

**Step 1: Build verification function**

Edge function `verify-jobs` that:
1. Queries unverified jobs (or jobs not verified in last 7 days), limit 50
2. For each job URL: HEAD request with 5s timeout
3. If 200: `verified = true`, `verified_at = NOW()`
4. If 404/timeout/error: `verified = false`
5. Logs result to `verification_logs` table
6. Returns summary: `{ checked: N, valid: N, invalid: N }`

**Step 2: Deploy via Supabase MCP**

**Step 3: Test with a batch**

**Step 4: Commit**

```bash
git add docs/edge-functions.md
git commit -m "feat: deploy verify-jobs edge function — URL validation with logging"
```

---

## Phase 6: Polish & Quality

### Task 17: Loading States & Skeletons

**Files:**
- Create: `components/skeletons/job-card-skeleton.tsx`
- Create: `components/skeletons/job-list-skeleton.tsx`

**Step 1: Build skeleton components**

Match the exact dimensions and layout of JobCard. Use shadcn `Skeleton` component. Staggered fade-in animation.

**Step 2: Wire into all pages**

Use React Suspense boundaries with skeleton fallbacks for async data loading.

**Step 3: Commit**

```bash
git add components/skeletons
git commit -m "feat: add loading skeletons for job cards and lists"
```

---

### Task 18: Accessibility & Reduced Motion

**Files:**
- Modify: `components/layout/page-wrapper.tsx`
- Modify: `lib/motion.ts`
- Audit: all interactive components

**Step 1: Add reduced motion support**

In `page-wrapper.tsx`, use `useReducedMotion()` from Framer Motion. When true, use `reducedMotion` variants instead of `pageTransition`.

Apply same pattern to all animated components.

**Step 2: Audit touch targets**

Ensure all buttons, links, and interactive elements are >= 44px height/width.

**Step 3: Audit focus states**

Ensure all interactive elements have `focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2`.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: accessibility pass — reduced motion, touch targets, focus rings"
```

---

### Task 19: Responsive Audit & Final Polish

**Files:**
- Various component tweaks

**Step 1: Test at all breakpoints**

Check at 375px, 480px, 768px, 1024px, 1200px. Fix any layout breaks.

**Step 2: Verify quality bar**

- [ ] No generic AI aesthetics
- [ ] All transitions use spring or custom easing
- [ ] Touch targets >= 44px
- [ ] focus-visible rings
- [ ] reduced-motion support
- [ ] Company logos with initials fallback
- [ ] Line-clamped text
- [ ] Skill/benefit caps
- [ ] No FOUC
- [ ] Loading skeletons (not spinners)
- [ ] Scrollbars hidden

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: responsive audit and final polish"
```

---

## Execution Summary

| Phase | Tasks | Focus |
|-------|-------|-------|
| 1. Scaffolding | 1-4 | Next.js project, design system, Supabase schema, seed data |
| 2. Data Layer | 5-6 | Query functions, match scoring |
| 3. Core UI | 7-10 | Layout, job cards, preferences, detail sheet |
| 4. Pages | 11-14 | Discover, saved, applied, tools, profile |
| 5. Data Pipeline | 15-16 | API aggregation + verification edge functions |
| 6. Polish | 17-19 | Skeletons, a11y, responsive audit |

**Total: 19 tasks across 6 phases.**
