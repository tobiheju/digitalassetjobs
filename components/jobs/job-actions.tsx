"use client"

import { useState } from "react"
import { track } from "@vercel/analytics"
import { Heart, Share2, Check } from "lucide-react"
import { useSavedJobs } from "@/lib/hooks/use-saved-jobs"

interface JobActionsProps {
  jobId: string
  jobTitle: string
  company: string
}

export function JobActions({ jobId, jobTitle, company }: JobActionsProps) {
  const { isSaved, save, unsave } = useSavedJobs()
  const [copied, setCopied] = useState(false)

  const saved = isSaved(jobId)

  const handleSave = () => {
    if (saved) {
      unsave(jobId)
    } else {
      save(jobId)
    }
  }

  const handleShare = async () => {
    track('share_click', { jobId, jobTitle, company })
    const url = window.location.href
    const shareData = {
      title: `${jobTitle} at ${company}`,
      text: `Check out this job: ${jobTitle} at ${company}`,
      url,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled or share failed — ignore
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // Clipboard not available
      }
    }
  }

  return (
    <div className="mt-3 flex gap-2">
      <button
        onClick={handleSave}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
          saved
            ? "border-red-200 bg-red-50 text-red-500 hover:border-red-300"
            : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
        }`}
      >
        <Heart className={`size-3.5 ${saved ? "fill-current" : ""}`} />
        {saved ? "Saved" : "Save"}
      </button>
      <button
        onClick={handleShare}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
      >
        {copied ? (
          <>
            <Check className="size-3.5" />
            Link copied
          </>
        ) : (
          <>
            <Share2 className="size-3.5" />
            Share
          </>
        )}
      </button>
    </div>
  )
}
