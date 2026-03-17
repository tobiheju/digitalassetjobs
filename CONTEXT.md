# DigitalAssetJobs — AI Context Document

Use this document to onboard your AI assistant to the project.

---

## 🎯 What Is This?

**DigitalAssetJobs** is a niche job board focused on the intersection of traditional finance (TradFi) and digital assets/crypto. 

**Target audience:** Professionals from banks, asset managers, and fintech companies looking to transition into crypto — NOT crypto-native DeFi degens.

**Live site:** https://digitalassetjobs.xyz
**GitHub:** https://github.com/tobiheju/digitalassetjobs

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + custom |
| Animations | Framer Motion |
| Hosting | Vercel |
| Database | Supabase (PostgreSQL) |
| Email | Resend |
| Payments | Stripe |
| Analytics | Vercel Analytics |

---

## 📁 Project Structure (Post-Revamp)

```
digitalassetjobs/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage = Discover jobs (main feed)
│   ├── discover-client.tsx       # Client-side job discovery with filtering
│   ├── jobs/
│   │   └── [id]/page.tsx         # Individual job page
│   ├── companies/
│   │   ├── page.tsx              # Company directory
│   │   └── [id]/page.tsx         # Company profile
│   ├── saved/page.tsx            # Saved jobs (localStorage)
│   ├── applied/page.tsx          # Applied jobs tracking (localStorage)
│   ├── profile/page.tsx          # User preferences management
│   ├── tools/
│   │   ├── page.tsx              # Career tools hub
│   │   ├── salary/               # Salary explorer
│   │   ├── skills/               # Skills demand chart
│   │   ├── quiz/                 # Job match quiz
│   │   └── insights/             # Market insights
│   ├── salaries/page.tsx         # Salary data page
│   ├── blog/
│   │   ├── page.tsx              # Blog listing
│   │   └── [slug]/page.tsx       # Blog post
│   ├── post-job/                 # Paid job posting flow
│   └── api/
│       ├── og/route.tsx          # Dynamic OG image generation
│       ├── checkout/             # Stripe checkout
│       └── webhooks/stripe/      # Stripe webhook handler
├── components/
│   ├── jobs/
│   │   ├── job-card.tsx          # Job card (list + compact variants)
│   │   ├── job-list.tsx          # Job list with view modes
│   │   ├── job-detail-sheet.tsx  # Mobile bottom sheet for job details
│   │   └── view-toggle.tsx       # List/card view toggle
│   ├── layout/
│   │   ├── header.tsx            # Top navigation
│   │   ├── bottom-nav.tsx        # Mobile bottom navigation
│   │   └── page-wrapper.tsx      # Page layout wrapper with transitions
│   ├── preferences/
│   │   ├── filter-bar.tsx        # Quick filter chips
│   │   ├── preferences-sheet.tsx # Full preferences panel
│   │   ├── chip-select.tsx       # Multi-select chips
│   │   └── salary-range-slider.tsx
│   ├── skeletons/                # Loading skeleton components
│   ├── tools/
│   │   └── quiz-modal.tsx        # Job match quiz modal
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── types/
│   │   ├── index.ts              # Job, Company, Preferences types
│   │   └── database.ts           # Supabase generated types
│   ├── queries/
│   │   ├── jobs.ts               # Job queries (getJobs, getJobById, etc.)
│   │   ├── companies.ts          # Company queries
│   │   └── mappers.ts            # DB row → TypeScript mappers
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   └── server.ts             # Server Supabase client
│   ├── hooks/
│   │   ├── use-preferences.ts    # User preferences hook (localStorage)
│   │   └── use-saved-jobs.ts     # Saved/applied jobs hooks
│   ├── scoring.ts                # Job match scoring algorithm
│   ├── constants.ts              # Sectors, skills, job types options
│   ├── motion.ts                 # Framer Motion variants
│   └── stripe.ts                 # Stripe config & pricing
├── data/
│   └── blog-posts.json           # Blog content
└── public/
    └── brand/                    # Logo, favicon, etc.
```

---

## 📊 Data Models

### Job (from Supabase)

```typescript
interface Job {
  id: string
  title: string
  company: string
  companyType: string              // "Infrastructure", "Custody", "Exchange", etc.
  location: string
  type: string                     // "Full-time", "Part-time", "Contract"
  department: string | null
  salaryDisplay: string | null     // "$120,000 - $180,000"
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
  seniority: string | null         // "Junior", "Mid", "Senior", "Lead", "Director"
  workArrangement: string          // "Remote", "Hybrid", "On-site"
  skills: string[]                 // ["Solidity", "Compliance", "Sales", etc.]
  benefits: string[]
  verified: boolean
  source: string | null
}
```

### UserPreferences (localStorage)

```typescript
interface UserPreferences {
  sectors: string[]
  skills: string[]
  workArrangements: string[]
  jobTypes: string[]
  seniorityLevels: string[]
  salaryMin: number | null
  salaryMax: number | null
  verifiedOnly: boolean
}
```

---

## ✅ New Features (March 2026 Revamp)

### Job Discovery
- [x] **Discover page** — Main job feed with filtering and scoring
- [x] **Match scoring** — Jobs scored 0-100 based on user preferences
- [x] **Filter bar** — Quick chip filters for sectors, skills, arrangements
- [x] **Preferences sheet** — Full preference panel (sectors, skills, salary range)
- [x] **View toggle** — List view / card view
- [x] **Mobile detail sheet** — Spring-animated bottom sheet for job details

### User Features
- [x] **Save jobs** — Heart icon, persisted to localStorage
- [x] **Track applications** — Mark jobs as applied
- [x] **Saved page** — View all saved jobs
- [x] **Applied page** — View all applied jobs
- [x] **Profile page** — Manage preferences, view stats

### Career Tools
- [x] **Salary Explorer** — Interactive salary comparison by sector/location/seniority
- [x] **Skills Demand** — Chart of most in-demand skills
- [x] **Job Match Quiz** — 5-question quiz to set preferences
- [x] **Market Insights** — Data-driven market overview

### UI/UX
- [x] **Loading skeletons** — Smooth loading states
- [x] **Page transitions** — Framer Motion animations
- [x] **Bottom navigation** — Mobile-first navigation
- [x] **Accessibility pass** — ARIA labels, keyboard navigation

### Technical
- [x] **Supabase integration** — All jobs from PostgreSQL
- [x] **Vercel OG** — Dynamic social card images
- [x] **Vercel Analytics** — Visitor tracking

---

## 💰 Monetization

### Pricing Tiers (`lib/stripe.ts`)

| Tier | Price | Duration | Features |
|------|-------|----------|----------|
| Standard | $199 | 30 days | Basic listing |
| Featured | $349 | 30 days | ⭐ badge, priority, newsletter |
| Premium | $599 | 45 days | Twitter promo, blog mention |

---

## 🧮 Match Scoring Algorithm

Jobs are scored 0-100 based on user preferences:

| Factor | Weight |
|--------|--------|
| Sector match | 30 pts |
| Skills overlap | 25 pts |
| Salary alignment | 20 pts |
| Work arrangement | 10 pts |
| Job type | 10 pts |
| Seniority | 5 pts |

When no preferences are set, a deterministic hash creates "realistic" scores (65-95 range).

---

## 🎨 Design System

### Colors
- Primary: `#1a365d` (navy blue)
- Accent: `#d4a038` (gold)
- Background: `slate-50`
- Cards: `white` with subtle borders

### Typography
- Font: System (Geist)
- Headings: Serif style via `font-serif` class
- Body: Sans-serif

### Key Patterns
- Cards with `hover:shadow-lg` transitions
- Chip selects for multi-select filters
- Bottom sheets for mobile detail views
- Skeleton loaders matching content layout

---

## 🔧 Development

### Setup
```bash
git clone https://github.com/tobiheju/digitalassetjobs
cd digitalassetjobs
npm install
```

### Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Email
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=https://digitalassetjobs.xyz
```

### Run Dev Server
```bash
npm run dev
```

### Deploy
```bash
git push origin main  # Auto-deploys via Vercel
```

---

## 📝 Key Files to Know

| File | Purpose |
|------|---------|
| `app/discover-client.tsx` | Main job discovery logic with filtering |
| `lib/queries/jobs.ts` | All Supabase job queries |
| `lib/scoring.ts` | Match scoring algorithm |
| `lib/hooks/use-preferences.ts` | User preferences management |
| `lib/constants.ts` | Sectors, skills, job types options |
| `components/jobs/job-card.tsx` | Job card component |
| `components/preferences/` | Filter and preference components |

---

## 🐛 Known Issues / TODOs

1. Blog content still in JSON file (could move to Supabase)
2. No user authentication yet (localStorage only)
3. Company data is derived from jobs (no separate company table)
4. Email alerts not implemented yet

---

*Updated: 2026-03-17 (post-revamp)*
