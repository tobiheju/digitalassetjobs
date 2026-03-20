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
    iconBg: "bg-[#d4a038]/10",
    iconColor: "text-[#d4a038]",
    stat: "Real-time data",
    statLabel: "from 300+ listings",
    badge: "Popular",
  },
  {
    title: "Skills Demand",
    description: "Discover which technical skills employers are looking for most. Track demand trends and identify gaps in your skillset.",
    href: "/tools/skills",
    icon: TrendingUp,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    stat: "Top 20 skills",
    statLabel: "ranked by demand",
  },
  {
    title: "Job Match Quiz",
    description: "Answer 5 quick questions and we'll match you with roles that fit your experience, preferences, and career goals.",
    href: "/tools/quiz",
    icon: Target,
    iconBg: "bg-[#1a365d]/[0.06]",
    iconColor: "text-[#1a365d]",
    stat: "5 questions",
    statLabel: "personalized results",
    badge: "Quick",
    isQuiz: true,
  },
  {
    title: "Market Insights",
    description: "Data-driven overview of the digital asset job market. Sector breakdowns, geographic trends, and hiring velocity.",
    href: "/tools/insights",
    icon: BarChart3,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
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
            const badge = "badge" in tool ? tool.badge : undefined

            const cardContent = (
              <div className="flex h-full flex-col p-6">
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className={`flex size-12 items-center justify-center rounded-xl ${tool.iconBg}`}>
                    <tool.icon className={`size-5.5 ${tool.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    {badge && (
                      <span className="rounded-md bg-[#d4a038]/10 px-2 py-0.5 text-[11px] font-medium text-[#d4a038]">
                        {badge}
                      </span>
                    )}
                    <div className="flex size-8 items-center justify-center rounded-lg text-slate-300 transition-all duration-150 group-hover:bg-[#1a365d]/[0.04] group-hover:text-[#1a365d]">
                      <ArrowRight className="size-4" />
                    </div>
                  </div>
                </div>

                {/* Title + description */}
                <h2 className="mt-5 text-[17px] font-medium text-[#1a365d]">{tool.title}</h2>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-slate-500">
                  {tool.description}
                </p>

                {/* Footer stat */}
                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <span className="font-sans text-sm font-medium tabular-nums text-[#1a365d]">{tool.stat}</span>
                  <span className="text-[11px] text-slate-400">{tool.statLabel}</span>
                </div>
              </div>
            )

            const cardClass = "group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100/80 bg-white transition-[border-color,box-shadow] duration-150 ease-out hover:border-slate-200 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"

            return (
              <motion.div key={tool.href} variants={listItem} whileTap={{ scale: 0.98 }}>
                {isQuiz ? (
                  <button
                    type="button"
                    onClick={() => setQuizOpen(true)}
                    className={`${cardClass} w-full text-left`}
                  >
                    {cardContent}
                  </button>
                ) : (
                  <Link href={tool.href} className={cardClass}>
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
