'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const PALETTE = [
  'bg-[#1e3a5f] text-white',   // navy
  'bg-slate-600 text-white',    // slate
  'bg-emerald-700 text-white',  // emerald
  'bg-amber-600 text-white',    // amber
  'bg-indigo-600 text-white',   // indigo
  'bg-rose-600 text-white',     // rose
] as const

function hashName(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const SIZES = {
  sm: 32,
  md: 40,
  lg: 56,
} as const

interface CompanyLogoProps {
  name: string
  logoUrl?: string
  size?: 'sm' | 'md' | 'lg'
}

export function CompanyLogo({ name, logoUrl, size = 'md' }: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false)
  const px = SIZES[size]
  const colorClass = PALETTE[hashName(name) % PALETTE.length]
  const initial = name.charAt(0).toUpperCase()

  const fontSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-xl'

  if (logoUrl && !imgError) {
    return (
      <div
        className="shrink-0 overflow-hidden rounded-lg"
        style={{ width: px, height: px }}
      >
        <img
          src={logoUrl}
          alt={`${name} logo`}
          width={px}
          height={px}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'shrink-0 overflow-hidden rounded-lg flex items-center justify-center font-semibold',
        colorClass,
        fontSize,
      )}
      style={{ width: px, height: px }}
      aria-label={`${name} logo`}
    >
      {initial}
    </div>
  )
}
