import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Digital Asset Jobs',
  description: 'Industry analysis, market reports, and career insights for digital asset professionals.',
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
