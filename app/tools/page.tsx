"use client"

import Link from "next/link"
import { DollarSign, TrendingUp, Target, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { listContainer, listItem } from "@/lib/motion"

const tools = [
  {
    title: "Salary Explorer",
    description: "Compare salaries by sector, location, and seniority",
    href: "/tools/salary",
    icon: DollarSign,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  {
    title: "Skills Demand",
    description: "See which skills are most in-demand right now",
    href: "/tools/skills",
    icon: TrendingUp,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    title: "Job Match Quiz",
    description: "Find your perfect role in 5 questions",
    href: "/tools/quiz",
    icon: Target,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
  },
  {
    title: "Market Insights",
    description: "Data-driven view of the digital asset job market",
    href: "/tools/insights",
    icon: BarChart3,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700",
  },
] as const

export default function ToolsPage() {
  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-[#1a365d]">Tools</h1>
      <p className="mt-1 text-slate-600">Explore the digital asset job market</p>

      <motion.div
        className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2"
        variants={listContainer}
        initial="hidden"
        animate="show"
      >
        {tools.map((tool) => (
          <motion.div key={tool.href} variants={listItem}>
            <Link
              href={tool.href}
              className="flex items-start gap-4 rounded-xl border p-6 transition-shadow hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tool.iconBg}`}
              >
                <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
              </div>
              <div>
                <p className="font-semibold text-[#1a365d]">{tool.title}</p>
                <p className="text-sm text-slate-600">{tool.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </PageWrapper>
  )
}
