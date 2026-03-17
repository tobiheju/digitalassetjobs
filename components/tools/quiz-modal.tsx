"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2, ArrowLeft, ArrowRight, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChipSelect } from "@/components/preferences/chip-select"
import { SalaryRangeSlider } from "@/components/preferences/salary-range-slider"
import { usePreferences } from "@/lib/hooks/use-preferences"
import { SECTORS, SKILLS, WORK_ARRANGEMENTS, SENIORITY_LEVELS } from "@/lib/constants"

interface QuizModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

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

const questionVariants = {
  initial: { opacity: 0, x: 40, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    x: -40,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const questionVariantsBack = {
  initial: { opacity: 0, x: -40, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    x: 40,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function QuizModal({ open, onOpenChange }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answers>(defaultAnswers)
  const [completed, setCompleted] = useState(false)
  const [direction, setDirection] = useState<"forward" | "back">("forward")
  const { setPreferences } = usePreferences()

  const questions = [
    {
      title: "Which sectors interest you?",
      subtitle: "Pick the industries you'd like to work in",
      canProceed: answers.sectors.length > 0,
    },
    {
      title: "What are your key skills?",
      subtitle: "Select the skills you bring to the table",
      canProceed: answers.skills.length > 0,
    },
    {
      title: "What's your target salary range?",
      subtitle: "Help us match you with the right compensation",
      canProceed: true,
    },
    {
      title: "How do you prefer to work?",
      subtitle: "Choose your ideal work arrangement",
      canProceed: answers.workArrangements.length > 0,
    },
    {
      title: "What seniority level?",
      subtitle: "Select the level that matches your experience",
      canProceed: answers.seniorityLevels.length > 0,
    },
  ]

  const progress = ((currentQuestion + 1) / 5) * 100

  const handleClose = useCallback(() => {
    onOpenChange(false)
    setTimeout(() => {
      setCurrentQuestion(0)
      setAnswers(defaultAnswers)
      setCompleted(false)
      setDirection("forward")
    }, 300)
  }, [onOpenChange])

  function handleNext() {
    setDirection("forward")
    if (currentQuestion < 4) {
      setCurrentQuestion((q) => q + 1)
    } else {
      setPreferences({
        sectors: answers.sectors,
        skills: answers.skills,
        workArrangements: answers.workArrangements,
        jobTypes: [],
        seniorityLevels: answers.seniorityLevels,
        salaryMin: answers.salaryMin,
        salaryMax: answers.salaryMax,
        verifiedOnly: false,
      })
      setCompleted(true)
    }
  }

  function handleBack() {
    if (currentQuestion > 0) {
      setDirection("back")
      setCurrentQuestion((q) => q - 1)
    }
  }

  const variants = direction === "forward" ? questionVariants : questionVariantsBack

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex flex-col bg-white"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-4 md:px-8">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#1a365d]/5">
                <Target className="size-4 text-[#1a365d]" />
              </div>
              <span className="text-sm font-medium text-[#1a365d]">
                Job Match Quiz
              </span>
            </div>
            <button
              onClick={handleClose}
              className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Progress bar */}
          {!completed && (
            <div className="mx-5 h-1 overflow-hidden rounded-full bg-slate-100 md:mx-8">
              <motion.div
                className="h-full rounded-full bg-[#1a365d]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
              />
            </div>
          )}

          {/* Main content — centered */}
          <div className="flex flex-1 items-center justify-center overflow-y-auto px-5 py-8 md:px-8">
            <div className="w-full max-w-lg">
              <AnimatePresence mode="wait">
                {completed ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-50">
                      <CheckCircle2 className="size-8 text-emerald-600" />
                    </div>
                    <h2 className="font-serif text-2xl font-normal text-[#1a365d]">
                      Preferences saved
                    </h2>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                      We'll use these to rank and match you with the most relevant jobs across the platform.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <Link href="/jobs" onClick={handleClose}>
                        <Button className="w-full bg-[#1a365d] hover:bg-[#2a4a7f] active:scale-[0.98] sm:w-auto sm:px-8">
                          View Matching Jobs
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={handleClose}
                        className="w-full active:scale-[0.98] sm:w-auto sm:px-8"
                      >
                        Close
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentQuestion}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {/* Question header */}
                    <div className="mb-6">
                      <p className="text-xs font-medium text-[#d4a038]">
                        Question {currentQuestion + 1} of 5
                      </p>
                      <h2 className="mt-1.5 font-serif text-2xl font-normal text-[#1a365d] md:text-3xl">
                        {questions[currentQuestion].title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {questions[currentQuestion].subtitle}
                      </p>
                    </div>

                    {/* Question content */}
                    <div>
                      {currentQuestion === 0 && (
                        <ChipSelect
                          label=""
                          options={SECTORS}
                          selected={answers.sectors}
                          onChange={(sectors) => setAnswers((a) => ({ ...a, sectors }))}
                        />
                      )}
                      {currentQuestion === 1 && (
                        <ChipSelect
                          label=""
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
                          label=""
                          options={WORK_ARRANGEMENTS}
                          selected={answers.workArrangements}
                          onChange={(workArrangements) =>
                            setAnswers((a) => ({ ...a, workArrangements }))
                          }
                        />
                      )}
                      {currentQuestion === 4 && (
                        <ChipSelect
                          label=""
                          options={SENIORITY_LEVELS}
                          selected={answers.seniorityLevels}
                          onChange={(seniorityLevels) =>
                            setAnswers((a) => ({ ...a, seniorityLevels }))
                          }
                        />
                      )}
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex justify-between">
                      <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentQuestion === 0}
                        className="gap-1.5 active:scale-[0.98]"
                      >
                        <ArrowLeft className="size-4" />
                        Back
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!questions[currentQuestion].canProceed}
                        className="gap-1.5 bg-[#1a365d] hover:bg-[#2a4a7f] active:scale-[0.98]"
                      >
                        {currentQuestion === 4 ? "Finish" : "Next"}
                        {currentQuestion < 4 && <ArrowRight className="size-4" />}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Step indicators at the bottom */}
          {!completed && (
            <div className="flex items-center justify-center gap-2 pb-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentQuestion
                      ? "w-6 bg-[#1a365d]"
                      : i < currentQuestion
                        ? "w-1.5 bg-[#1a365d]/40"
                        : "w-1.5 bg-slate-200"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
