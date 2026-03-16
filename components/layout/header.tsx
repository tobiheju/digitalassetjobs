"use client"

import { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  children?: ReactNode
  activeFilterCount?: number
  onPreferencesClick?: () => void
}

const navLinks = [
  { label: "Discover", href: "/" },
  { label: "Saved", href: "/saved" },
  { label: "Applied", href: "/applied" },
  { label: "Tools", href: "/tools" },
  { label: "Profile", href: "/profile" },
]

export function Header({
  children,
  activeFilterCount,
  onPreferencesClick,
}: HeaderProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className="sticky top-0 z-50 w-full"
      animate={
        scrolled
          ? {
              backgroundColor: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(226,232,240,0.5)",
            }
          : {
              backgroundColor: "rgba(255,255,255,0)",
              backdropFilter: "blur(0px)",
              borderBottomWidth: 0,
              borderBottomColor: "rgba(226,232,240,0)",
            }
      }
      transition={{ duration: 0.2 }}
    >
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#1a365d]">DAJ</span>
        </Link>

        {/* Center slot */}
        <div id="header-center" className="flex items-center">
          {children}
        </div>

        {/* Right side: desktop nav + preferences */}
        <div className="flex items-center gap-1">
          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "font-bold text-[#1a365d]"
                      : "text-slate-500 hover:text-[#1a365d]"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Preferences button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onPreferencesClick}
            className="relative ml-1"
            aria-label="Preferences"
          >
            <SlidersHorizontal className="size-5" />
            {activeFilterCount != null && activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
