import blogData from '@/data/blog-posts.json'

export interface Author {
  id: string
  name: string
  role: string
  topic: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  authorId: string
  topic: 'stablecoins' | 'rwa' | 'crypto' | 'regulation' | 'institutional' | 'job-market'
  publishedAt: string
  tags: string[]
  featured?: boolean
  image?: string
}

export const AUTHORS: Record<string, Author> = {
  'sarah-chen': { id: 'sarah-chen', name: 'Sarah Chen', role: 'Stablecoin Analyst', topic: 'stablecoins' },
  'marcus-weber': { id: 'marcus-weber', name: 'Marcus Weber', role: 'RWA Correspondent', topic: 'rwa' },
  'alex-nakamoto': { id: 'alex-nakamoto', name: 'Alex Nakamoto', role: 'Crypto Editor', topic: 'crypto' },
  'elena-vasquez': { id: 'elena-vasquez', name: 'Elena Vasquez', role: 'Policy & Regulation', topic: 'regulation' },
  'james-blackwood': { id: 'james-blackwood', name: 'James Blackwood', role: 'Institutional Markets', topic: 'institutional' },
  'daj-research': { id: 'daj-research', name: 'DAJ Research Team', role: 'Job Market Analysis', topic: 'job-market' },
}

export const TOPIC_LABELS: Record<string, string> = {
  stablecoins: 'Stablecoins',
  rwa: 'Real World Assets',
  crypto: 'Crypto',
  regulation: 'Policy & Regulation',
  institutional: 'Institutional',
  'job-market': 'Job Market',
}

export const TOPIC_COLORS: Record<string, string> = {
  stablecoins: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rwa: 'bg-violet-50 text-violet-700 border-violet-200',
  crypto: 'bg-amber-50 text-amber-700 border-amber-200',
  regulation: 'bg-rose-50 text-rose-700 border-rose-200',
  institutional: 'bg-blue-50 text-blue-700 border-blue-200',
  'job-market': 'bg-yellow-50 text-yellow-700 border-yellow-200',
}

export function getAuthorById(id: string): Author | undefined {
  return AUTHORS[id]
}

export function getAllPosts(): BlogPost[] {
  return (blogData.posts as BlogPost[])
    .filter((post) => new Date(post.publishedAt) <= new Date())
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return (blogData.posts as BlogPost[]).find((post) => post.slug === slug)
}

export function getFeaturedPosts(limit = 3): BlogPost[] {
  return getAllPosts().filter((post) => post.featured).slice(0, limit)
}

export function getRecentPosts(limit = 6): BlogPost[] {
  return getAllPosts().slice(0, limit)
}

export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
