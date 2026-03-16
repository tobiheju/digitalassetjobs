# DAJ App — Design Document

## Overview

A premium, responsive web application for discovering digital asset jobs at the intersection of traditional finance and crypto. Built as a fresh Next.js 16 project alongside the existing digitalassetjobs.xyz site, using Supabase (SupabaseDaj) as the data layer from day one.

**Target audience:** TradFi professionals — compliance officers, institutional sales, ops leads, legal counsel — exploring crypto. Not DeFi degens.

**Design tone:** Bloomberg meets Linear. Subtle, refined, trustworthy. No crypto-casino aesthetics.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Animation | Framer Motion |
| Charts | Visx |
| Database | Supabase (SupabaseDaj) |
| Hosting | Vercel |
| Data Sources | Free public APIs (Jobicy, Arbeitnow, Greenhouse) |

---

## Architecture

### Data Flow

```
Free Job APIs ──► Supabase Edge Functions ──► Supabase Postgres
                      (aggregate + normalize)        │
                                                     │
Verification Workers ──► Crawl career pages ──► Update verified status
                                                     │
                                                     ▼
                                              Next.js App (reads)
```

### Supabase Schema

**Tables:**
- `jobs` — normalized job listings with all fields from existing schema
- `companies` — company profiles with descriptions, logos, metadata
- `job_sources` — tracks which API each job came from
- `verification_logs` — crawl results for URL verification
- `user_preferences` — saved filter preferences (localStorage initially, DB later)

**Edge Functions:**
- `aggregate-jobs` — fetches from all 3 APIs via Promise.allSettled, normalizes to unified schema, upserts to DB
- `verify-jobs` — crawls company career pages to confirm listings are live, updates verified status
- `cleanup-expired` — removes jobs older than 60 days or with dead URLs

### Taxonomy Constants

```typescript
const SECTORS = ['TradFi', 'Infrastructure', 'Custody', 'Stablecoin', 'Exchange', 'Trading/Investment', 'Hardware'] as const
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'] as const
const SENIORITY_LEVELS = ['Junior', 'Mid', 'Senior', 'Lead', 'Director', 'VP', 'C-Suite'] as const
const WORK_ARRANGEMENTS = ['Remote', 'Hybrid', 'On-site'] as const
const SKILLS = ['Compliance', 'AML/KYC', 'Trading', 'Custody', 'DeFi', 'Tokenization', 'Risk Management', 'Blockchain', 'Smart Contracts', 'Sales', 'Legal', 'Product'] as const
const SALARY_BRACKETS = [50000, 100000, 150000, 200000, 250000, 300000] as const
const BENEFITS = ['Equity', 'Token Allocation', 'Remote Work', 'Health Insurance', 'Visa Sponsorship', '401k/Pension'] as const
```

---

## Animation System

Centralised in `lib/motion.ts`. Subtle and refined — no bouncy physics.

### Easing Curves
- **standard:** `cubic-bezier(0.25, 0.1, 0.25, 1)` — general purpose
- **emphasis:** `cubic-bezier(0.0, 0.0, 0.2, 1)` — enter/reveal
- **micro:** `cubic-bezier(0.4, 0.0, 0.6, 1)` — hover/tap feedback

### Duration Presets
- **instant:** 0.1s
- **fast:** 0.2s
- **normal:** 0.35s
- **slow:** 0.5s

### Spring Configs
- **gentle:** `{ stiffness: 120, damping: 14 }` — sheets, panels
- **default:** `{ stiffness: 300, damping: 24 }` — page transitions
- **snappy:** `{ stiffness: 500, damping: 30 }` — micro-interactions

### Page Transitions
- AnimatePresence with `filter: blur(6px)` + y-offset fade
- Exit duration shorter than enter (exit: 0.15s, enter: 0.35s)

### Stagger
- 0.06s between list items
- 0.15s container delay

### Micro-interactions
- Hover: `scale(1.02)` — subtle, not 1.08
- Tap: `scale(0.97)` — gentle press feedback
- All interactive elements get these

### Reduced Motion
- `prefers-reduced-motion: reduce` — all durations set to 0.01ms
- Respect system preference, no override toggle needed

---

## Match Scoring Algorithm

Weighted multi-factor scoring. Range: 10-95%.

| Factor | Points | Logic |
|--------|--------|-------|
| Sector match | 30 | Exact match on preferred sectors |
| Skills overlap | 25 | Pro-rated: (matching / total preferred) * 25 |
| Salary distance | 20 | Inverse distance from preferred range midpoint |
| Work arrangement | 10 | Exact match on remote/hybrid/onsite |
| Job type | 10 | Exact match on full-time/contract/etc |
| Seniority | 5 | Exact match on experience level |

**When no preferences set:** Deterministic hash fallback. Hash job ID to generate a score in 65-95 range. Consistent per job, no randomness.

**Display:** Colored badge on job cards.
- >= 85%: green (`bg-emerald-50 text-emerald-700`)
- < 85%: amber (`bg-amber-50 text-amber-700`)

---

## Views

### Job List View
- Default view. Card-based grid (1 col mobile, 2 col tablet, 3 col desktop)
- Each card: company logo (initials fallback), title, company, location, salary range, match score badge, tags (max 3, capped), posted date
- Line-clamped descriptions (2 lines)
- Hover: subtle lift + shadow transition (spring, not CSS ease)
- Infinite scroll or paginated (20 per page)

### Job Card View
- Compact horizontal list variant
- Company logo, title, company, salary, match badge — single row
- For dense browsing

### Preferences Panel
- **Desktop:** Right sidebar, always visible or toggleable
- **Mobile:** Bottom sheet with drag handle
- Chip-based multi-select for: sectors, skills, work arrangements, job types, seniority levels, locations
- Dual range slider for salary (min/max)
- Reset All + Apply Filters buttons
- Active filter count badge on the preferences button in header
- Preferences filter both list and card views

### Job Detail Sheet
- Portal-based overlay
- **Desktop:** Right sidebar panel (doesn't replace page)
- **Mobile:** Full-height bottom sheet
- Spring animation on open/close (gentle config)
- Content: full description, requirements, benefits, tags, salary, location map placeholder
- Actions: Apply (external link) + Save buttons
- Close via X button, overlay click, or Escape key

---

## Layout & Responsiveness

Responsive, not mobile-first. Works well at all breakpoints.

### Breakpoints
- Mobile: up to 480px
- Tablet: 481px - 768px
- Desktop: 769px+
- Max content width: 1100px

### Header
- Logo mark (top-left)
- View toggle: list/card (center, discover page only)
- Preferences button (top-right) with active filter count badge
- Gradient fade background on scroll

### Bottom Navigation (mobile only, < 769px)
- 5 tabs: Discover, Saved, Applied, Tools, Profile
- Full-width bar with safe area padding for notched devices
- Active tab indicator with spring animation

### Desktop Navigation
- Standard horizontal nav in header
- Same 5 sections as tabs

### Global
- All scrollbars hidden
- Smooth scroll behavior
- Focus-visible rings on all interactive elements
- Touch targets >= 44px

---

## Tools Section

Grid of 4 tool cards with colored icon boxes.

### 1. Salary Explorer
- Filter by sector, location, seniority
- Display min / avg / max stats
- Horizontal bar chart (Visx)
- Data from Supabase aggregation of job salary fields

### 2. Skills Demand
- Top skills ranked by frequency across all jobs
- Horizontal ranked list with bar visualization
- Filterable by sector

### 3. Job Match Quiz
- 5-question interactive flow
- Animated transitions between questions (page transition style)
- Questions determine: preferred sector, skills, salary range, work arrangement, seniority
- Result: saves as preferences + shows top matching jobs
- Recommendation engine uses the match scoring algorithm

### 4. Market Insights Dashboard
Visx-based charts:
- Sector breakdown (donut/pie)
- Location distribution (horizontal bar)
- Salary histogram
- Skills heatmap (grid)
- Seniority-pay comparison (grouped bar)

---

## Data Layer Detail

### API Aggregation
- 3 sources: Jobicy, Arbeitnow, Greenhouse (free public APIs from public-apis repo)
- `Promise.allSettled` — graceful per-API failure, never blocks on one source
- Normalize all responses to unified job schema
- Deduplicate by company+title+location hash
- Run via Supabase Edge Function on schedule (e.g. every 6 hours)

### Verification Pipeline
- After aggregation, queue new jobs for verification
- Edge function or worker crawls the job URL
- If 200 OK and page contains job-related content: `verified = true`
- If 404/timeout/redirect to generic page: `verified = false`
- Option to use Firecrawl/Cloudflare for more robust crawling
- Only show verified jobs in the UI by default

### Seed Data
- Import existing 321 jobs from digitalassetjobs `data/jobs.json` into Supabase
- Use as baseline while API aggregation pipeline ramps up

---

## Design System

### Colors
- Primary: `#1a365d` (navy blue)
- Accent: `#d4a038` (gold)
- Background: `slate-50`
- Surface: `white`
- Text primary: `slate-800`
- Text secondary: `slate-600`
- Border: `slate-200`
- Success: `emerald-600`
- Warning: `amber-600`

### Typography
- Font: Inter
- Headings: `font-bold`, navy
- Body: `font-normal`, slate
- Monospace numbers in salary displays

### Component Quality
- Company logos via Unavatar with initials fallback (colored circle + first letter)
- Line-clamped descriptions (2 lines on cards)
- Skill tags capped at 3 per card, "+N more" overflow
- Benefit tags capped similarly
- Deterministic animations — no random delays, no FOUC
- No generic AI aesthetics — warm, opinionated design language

---

## Pages / Routes

```
/                    — Landing / Discover (job list + filters)
/jobs/[id]           — Job detail (or sheet overlay)
/saved               — Saved jobs (localStorage initially)
/applied             — Applied jobs tracker
/tools               — Tools grid
/tools/salary        — Salary Explorer
/tools/skills        — Skills Demand
/tools/quiz          — Job Match Quiz
/tools/insights      — Market Insights
/profile             — User preferences (no auth, localStorage)
```

---

## Quality Bar

- No generic AI aesthetics
- Every state transition has spring physics or eased motion
- Touch targets >= 44px
- `focus-visible` rings on all interactive elements
- `prefers-reduced-motion` support
- Company logos with initials fallback
- Line-clamped text, skill/benefit caps to prevent overflow
- Deterministic animations (no random delays or FOUC)
- Graceful API failure — app works with partial data
- Loading skeletons for async data, not spinners
