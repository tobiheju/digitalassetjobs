"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronRight, User, Bookmark, Briefcase, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Jobs", href: "/jobs" },
  { label: "Salaries", href: "/salaries" },
  { label: "Companies", href: "/companies" },
  { label: "Blog", href: "/blog" },
  { label: "Tools", href: "/tools" },
]

const profileMenuItems = [
  { label: "My Profile", href: "/profile", icon: User },
  { label: "Saved Jobs", href: "/saved", icon: Bookmark },
  { label: "Applied Jobs", href: "/applied", icon: Briefcase },
  { label: "Settings", href: "/profile", icon: Settings },
]

function AvatarDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  return (
    <div
      ref={ref}
      className="relative hidden md:block"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className="flex size-8 items-center justify-center rounded-full bg-[#1a365d] text-white transition-shadow hover:ring-2 hover:ring-[#1a365d]/20 hover:ring-offset-1"
        aria-label="Account menu"
      >
        <User className="size-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-white py-1.5 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_4px_8px_-2px_rgba(0,0,0,0.1),0_8px_16px_-4px_rgba(0,0,0,0.08)]"
          >
            {profileMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#1a365d]"
                >
                  <Icon className="size-3.5 text-slate-400" />
                  {item.label}
                </Link>
              )
            })}
            <div className="my-1 border-t border-slate-100" />
            <button
              className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-red-500"
            >
              <LogOut className="size-3.5" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 w-full border-b"
        animate={
          scrolled
            ? {
                backgroundColor: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
                borderBottomColor: "rgba(226,232,240,0.6)",
              }
            : {
                backgroundColor: "rgba(255,255,255,1)",
                backdropFilter: "blur(0px)",
                borderBottomColor: "rgba(226,232,240,0.3)",
              }
        }
        transition={{ duration: 0.2 }}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <img
              src="/logos/primary-logo-dark.svg"
              alt="Digital Asset Jobs"
              className="block h-6 w-auto select-none"
              draggable={false}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/")
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    isActive
                      ? "text-[#1a365d]"
                      : "text-slate-500 hover:text-[#1a365d]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute inset-x-1 -bottom-[13px] h-[2px] rounded-full bg-[#1a365d]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link href="/post-job" className="hidden md:block">
              <Button
                size="sm"
                className="bg-[#d4a038] text-[13px] text-white hover:bg-[#c49030] active:scale-[0.96] transition-transform duration-150 ease-out"
              >
                Post a Job
              </Button>
            </Link>
            <AvatarDropdown />

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex size-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 top-14 z-40 bg-white md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col p-4">
              {[...navLinks, { label: "Post a Job", href: "/post-job" }].map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium transition-colors ${
                      isActive
                        ? "bg-slate-50 text-[#1a365d]"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                    <ChevronRight className="size-4 text-slate-400" />
                  </Link>
                )
              })}
              <div className="my-2 border-t border-slate-100" />
              {profileMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-[15px] font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Icon className="size-4 text-slate-400" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
