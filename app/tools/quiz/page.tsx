"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { QuizModal } from "@/components/tools/quiz-modal"

export default function QuizPage() {
  const [open, setOpen] = useState(true)
  const router = useRouter()

  function handleOpenChange(value: boolean) {
    setOpen(value)
    if (!value) {
      router.push("/tools")
    }
  }

  return <QuizModal open={open} onOpenChange={handleOpenChange} />
}
