"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Compass, Heart, Send, Wrench, User } from "lucide-react"
import { spring } from "@/lib/motion"
import type { LucideIcon } from "lucide-react"

interface NavTab {
  label: string
  href: string
  icon: LucideIcon
}

const tabs: NavTab[] = [
  { label: "Discover", href: "/", icon: Compass },
  { label: "Saved", href: "/saved", icon: Heart },
  { label: "Applied", href: "/applied", icon: Send },
  { label: "Tools", href: "/tools", icon: Wrench },
  { label: "Profile", href: "/profile", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-stretch justify-around">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href)
          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 pt-2 pb-1"
            >
              {/* Active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 left-3 right-3 h-0.5 rounded-full bg-[#1a365d]"
                  transition={spring.snappy}
                />
              )}

              <Icon
                className={`size-5 ${
                  isActive ? "text-[#1a365d]" : "text-slate-400"
                }`}
              />
              <span
                className={`text-[10px] leading-tight ${
                  isActive
                    ? "font-medium text-[#1a365d]"
                    : "text-slate-400"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
