'use client'

import { track } from '@vercel/analytics'
import { ExternalLink } from 'lucide-react'

interface ApplyButtonProps {
  url: string
  jobId: string
  title: string
  company: string
  variant?: 'primary' | 'sidebar'
}

const VARIANT_CLASSES = {
  primary:
    'inline-flex items-center gap-2 rounded-lg bg-[#d4a038] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b8892f]',
  sidebar:
    'flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a365d] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2c5282]',
}

export function ApplyButton({ url, jobId, title, company, variant = 'primary' }: ApplyButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('job_applied', { jobId, title, company })}
      className={VARIANT_CLASSES[variant]}
    >
      <ExternalLink className={variant === 'primary' ? 'size-3.5' : 'size-4'} />
      Apply Now
    </a>
  )
}
