'use client'

import { motion } from 'framer-motion'
import { List, LayoutGrid } from 'lucide-react'
import { spring } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface ViewToggleProps {
  view: 'list' | 'card'
  onChange: (view: 'list' | 'card') => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-0.5 rounded-full bg-slate-100 p-1">
      <motion.button
        className={cn(
          'rounded-full p-2',
          view === 'list'
            ? 'bg-[#1a365d] text-white'
            : 'bg-slate-100 text-slate-600'
        )}
        onClick={() => onChange('list')}
        animate={{
          backgroundColor: view === 'list' ? '#1a365d' : '#f1f5f9',
          color: view === 'list' ? '#ffffff' : '#475569',
        }}
        transition={spring.snappy}
        aria-label="List view"
      >
        <List className="size-4" />
      </motion.button>
      <motion.button
        className={cn(
          'rounded-full p-2',
          view === 'card'
            ? 'bg-[#1a365d] text-white'
            : 'bg-slate-100 text-slate-600'
        )}
        onClick={() => onChange('card')}
        animate={{
          backgroundColor: view === 'card' ? '#1a365d' : '#f1f5f9',
          color: view === 'card' ? '#ffffff' : '#475569',
        }}
        transition={spring.snappy}
        aria-label="Card view"
      >
        <LayoutGrid className="size-4" />
      </motion.button>
    </div>
  )
}
