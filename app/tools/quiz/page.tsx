"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChipSelect } from "@/components/preferences/chip-select"
import { SalaryRangeSlider } from "@/components/preferences/salary-range-slider"
import { usePreferences } from "@/lib/hooks/use-preferences"
import { SECTORS, SKILLS, WORK_ARRANGEMENTS, SENIORITY_LEVELS } from "@/lib/constants"
import { pageTransition } from "@/lib/motion"
import { CheckCircle2 } from "lucide-react"

interface Answers {
  sectors: string[]
  skills: string[]
  salaryMin: number | null
  salaryMax: number | null
  workArrangements: string[]
  seniorityLevels: string[]
}

const defaultAnswers: Answers = {
  sectors: [],
  skills: [],
  salaryMin: null,
  salaryMax: null,
  workArrangements: [],
  seniorityLevels: [],
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answers>(defaultAnswers)
  const [completed, setCompleted] = useState(false)
  const { setPreferences } = usePreferences()

  const questions = [
    {
      title: "Which sectors interest you?",
      canProceed: answers.sectors.length > 0,
    },
    {
      title: "What are your key skills?",
      canProceed: answers.skills.length > 0,
    },
    {
      title: "What's your target salary range?",
      canProceed: true, // salary is optional
    },
    {
      title: "How do you prefer to work?",
      canProceed: answers.workArrangements.length > 0,
    },
    {
      title: "What seniority level?",
      canProceed: answers.seniorityLevels.length > 0,
    },
  ]

  function handleNext() {
    if (currentQuestion < 4) {
      setCurrentQuestion((q) => q + 1)
    } else {
      // Save to preferences
      setPreferences({
        sectors: answers.sectors,
        skills: answers.skills,
        workArrangements: answers.workArrangements,
        jobTypes: [],
        seniorityLevels: answers.seniorityLevels,
        salaryMin: answers.salaryMin,
        salaryMax: answers.salaryMax,
      })
      setCompleted(true)
    }
  }

  function handleBack() {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1)
    }
  }

  const progress = ((currentQuestion + 1) / 5) * 100

  if (completed) {
    return (
      <PageWrapper>
        <Card className="mx-auto max-w-lg p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a365d]">
            Your preferences have been saved!
          </h1>
          <p className="mt-2 text-slate-600">
            We will use these to match you with the best jobs.
          </p>
          <Link href="/">
            <Button className="mt-6 bg-[#1a365d] hover:bg-[#2a4a7f]">
              View Matching Jobs
            </Button>
          </Link>
        </Card>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-[#1a365d]">Job Match Quiz</h1>
      <p className="mt-1 text-slate-600">Find your perfect role in 5 questions</p>

      {/* Progress bar */}
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#1a365d] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Question {currentQuestion + 1} of 5
      </p>

      {/* Questions */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-[#1a365d]">
                {questions[currentQuestion].title}
              </h2>

              {currentQuestion === 0 && (
                <ChipSelect
                  label="Select one or more sectors"
                  options={SECTORS}
                  selected={answers.sectors}
                  onChange={(sectors) => setAnswers((a) => ({ ...a, sectors }))}
                />
              )}
              {currentQuestion === 1 && (
                <ChipSelect
                  label="Select your skills"
                  options={SKILLS}
                  selected={answers.skills}
                  onChange={(skills) => setAnswers((a) => ({ ...a, skills }))}
                />
              )}
              {currentQuestion === 2 && (
                <SalaryRangeSlider
                  min={30000}
                  max={400000}
                  value={[answers.salaryMin, answers.salaryMax]}
                  onChange={([salaryMin, salaryMax]) =>
                    setAnswers((a) => ({ ...a, salaryMin, salaryMax }))
                  }
                />
              )}
              {currentQuestion === 3 && (
                <ChipSelect
                  label="Select work arrangements"
                  options={WORK_ARRANGEMENTS}
                  selected={answers.workArrangements}
                  onChange={(workArrangements) =>
                    setAnswers((a) => ({ ...a, workArrangements }))
                  }
                />
              )}
              {currentQuestion === 4 && (
                <ChipSelect
                  label="Select seniority levels"
                  options={SENIORITY_LEVELS}
                  selected={answers.seniorityLevels}
                  onChange={(seniorityLevels) =>
                    setAnswers((a) => ({ ...a, seniorityLevels }))
                  }
                />
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentQuestion === 0}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!questions[currentQuestion].canProceed}
          className="bg-[#1a365d] hover:bg-[#2a4a7f]"
        >
          {currentQuestion === 4 ? "Finish" : "Next"}
        </Button>
      </div>
    </PageWrapper>
  )
}
