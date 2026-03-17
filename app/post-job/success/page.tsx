'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'

function SuccessContent() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md text-center"
      >
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="size-8 text-emerald-600" />
        </div>

        <h1 className="font-serif text-2xl font-normal text-[#1a365d]">
          Payment confirmed
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          Your job listing has been submitted and payment has been processed. We'll review your listing and notify you once it's live.
        </p>

        {sessionId && (
          <div className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5">
            <Receipt className="size-3.5 text-slate-400" />
            <span className="text-xs text-slate-500">
              Reference: {sessionId.slice(0, 20)}...
            </span>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button className="w-full gap-1.5 bg-[#1a365d] hover:bg-[#2a4a7f] active:scale-[0.98] sm:w-auto sm:px-8">
              Browse Jobs
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/post-job">
            <Button
              variant="outline"
              className="w-full active:scale-[0.98] sm:w-auto sm:px-8"
            >
              Post Another Job
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function PostJobSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="size-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#1a365d]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
