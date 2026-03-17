'use client'

import { useState, useRef } from 'react'
import { BadgeCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface VerifiedBadgeProps {
  size?: 'sm' | 'md'
  className?: string
}

export function VerifiedBadge({ size = 'md', className }: VerifiedBadgeProps) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const iconSize = size === 'sm' ? 'size-3' : 'size-3.5'

  return (
    <span
      ref={ref}
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <BadgeCheck className={cn(iconSize, 'text-blue-500')} />
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[11px] font-medium text-white shadow-lg"
          >
            Verified Employer
            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
