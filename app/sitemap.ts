import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://digitalassetjobs.xyz'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/salaries`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/salary`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/skills`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/insights`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/saved`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.3,
    },
  ]

  // Dynamic job pages
  const supabase = await createClient()
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, posted_date')
    .order('posted_date', { ascending: false })
    .limit(500)

  const jobPages: MetadataRoute.Sitemap = (jobs ?? []).map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: new Date(job.posted_date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic company pages
  const { data: companies } = await supabase
    .from('jobs')
    .select('company')
  
  const uniqueCompanies = [...new Set((companies ?? []).map(c => c.company))]
  const companyPages: MetadataRoute.Sitemap = uniqueCompanies.map((company) => ({
    url: `${baseUrl}/companies/${encodeURIComponent(company.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...jobPages, ...companyPages]
}
