"use client"

import { useState } from "react"
import Link from "next/link"
import { DollarSign, TrendingUp, Target, BarChart3, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { QuizModal } from "@/components/tools/quiz-modal"
import { listContainer, listItem } from "@/lib/motion"

const tools = [
  {
    title: "Salary Explorer",
    description: "Compare salaries across sectors, locations, and seniority levels. See how your compensation stacks up against the market.",
    href: "/tools/salary",
    icon: DollarSign,
    gradient: "from-amber-500 to-orange-600",
    stat: "Real-time data",
    statLabel: "from 300+ listings",
  },
  {
    title: "Skills Demand",
    description: "Discover which technical skills employers are looking for most. Track demand trends and identify gaps in your skillset.",
    href: "/tools/skills",
    icon: TrendingUp,
    gradient: "from-emerald-500 to-teal-600",
    stat: "Top 20 skills",
    statLabel: "ranked by demand",
  },
  {
    title: "Job Match Quiz",
    description: "Answer 5 quick questions and we'll match you with roles that fit your experience, preferences, and career goals.",
    href: "/tools/quiz",
    icon: Target,
    gradient: "from-blue-500 to-indigo-600",
    stat: "5 questions",
    statLabel: "personalized results",
    isQuiz: true,
  },
  {
    title: "Market Insights",
    description: "Data-driven overview of the digital asset job market. Sector breakdowns, geographic trends, and hiring velocity.",
    href: "/tools/insights",
    icon: BarChart3,
    gradient: "from-purple-500 to-violet-600",
    stat: "Live analytics",
    statLabel: "updated daily",
  },
] as const

export default function ToolsPage() {
  const [quizOpen, setQuizOpen] = useState(false)

  return (
    <>
    <PageWrapper>
      <div className="mx-auto max-w-5xl">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-normal text-[#1a365d]">Career Tools</h1>
          <p className="mt-2 max-w-lg text-sm text-slate-500">
            Data-driven tools to help you navigate the digital asset job market,
            benchmark your compensation, and find the perfect role.
          </p>
        </div>

        {/* Tool cards */}
        <motion.div
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
          variants={listContainer}
          initial="hidden"
          animate="show"
        >
          {tools.map((tool) => {
            const isQuiz = "isQuiz" in tool && tool.isQuiz

            const cardContent = (
              <>
                {/* Gradient header */}
                <div className={`bg-gradient-to-r ${tool.gradient} px-6 py-5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <tool.icon className="size-5 text-white" />
                    </div>
                    <ArrowRight className="size-5 text-white/60 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <h2 className="mt-4 text-lg font-medium text-white">{tool.title}</h2>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col px-6 py-5">
                  <p className="flex-1 text-[14px] leading-relaxed text-slate-500">
                    {tool.description}
                  </p>
                  <div className="mt-4 flex items-baseline gap-2 border-t border-slate-100 pt-4">
                    <span className="font-sans text-sm font-medium tabular-nums text-[#1a365d]">{tool.stat}</span>
                    <span className="text-xs text-slate-400">{tool.statLabel}</span>
                  </div>
                </div>
              </>
            )

            return (
              <motion.div key={tool.href} variants={listItem} whileTap={{ scale: 0.96 }}>
                {isQuiz ? (
                  <button
                    type="button"
                    onClick={() => setQuizOpen(true)}
                    className="group flex w-full flex-col overflow-hidden rounded-2xl border border-slate-100/60 bg-white text-left transition-[border-color,box-shadow] duration-150 ease-out hover:border-slate-200/60 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)]"
                  >
                    {cardContent}
                  </button>
                ) : (
                  <Link
                    href={tool.href}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100/60 bg-white transition-[border-color,box-shadow] duration-150 ease-out hover:border-slate-200/60 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)]"
                  >
                    {cardContent}
                  </Link>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </PageWrapper>
    <QuizModal open={quizOpen} onOpenChange={setQuizOpen} />
    </>
  )
}
