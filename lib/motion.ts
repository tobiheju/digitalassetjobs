// Easing curves
export const easing = {
  standard: [0.25, 0.1, 0.25, 1] as const,
  emphasis: [0.0, 0.0, 0.2, 1] as const,
  micro: [0.4, 0.0, 0.6, 1] as const,
}

// Duration presets (seconds)
export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
}

// Spring configs
export const spring = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  default: { type: 'spring' as const, stiffness: 300, damping: 24 },
  snappy: { type: 'spring' as const, stiffness: 500, damping: 30 },
}

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 8, filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: duration.normal, ease: easing.emphasis },
  },
  exit: {
    opacity: 0,
    y: -4,
    filter: 'blur(6px)',
    transition: { duration: duration.fast, ease: easing.standard },
  },
}

// Stagger config
export const stagger = {
  item: 0.06,
  container: 0.15,
}

// List container variants
export const listContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.item,
      delayChildren: stagger.container,
    },
  },
}

// List item variants
export const listItem = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easing.emphasis },
  },
}

// Micro-interaction props for interactive elements
export const interactive = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: spring.snappy,
}

// Reduced motion media query helper
export const reducedMotion = {
  initial: { opacity: 1, y: 0, filter: 'blur(0px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.01 } },
  exit: { opacity: 0, transition: { duration: 0.01 } },
}
