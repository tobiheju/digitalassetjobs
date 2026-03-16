"use client"

import { motion, useReducedMotion } from "framer-motion"
import { pageTransition, reducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface PageWrapperProps {
  children: ReactNode
  className?: string
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  const prefersReducedMotion = useReducedMotion()
  const variants = prefersReducedMotion ? reducedMotion : pageTransition

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn("mx-auto max-w-[1100px] px-4 py-6", className)}
    >
      {children}
    </motion.div>
  )
}
