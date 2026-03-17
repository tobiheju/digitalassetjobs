// Easing curves
export const easing = {
  standard: [0.25, 0.1, 0.25, 1] as const,
  emphasis: [0.0, 0.0, 0.2, 1] as const,
  micro: [0.4, 0.0, 0.6, 1] as const,
  // Smooth deceleration for CSS transition spring approximation
  smooth: [0.2, 0, 0, 1] as const,
}

// Duration presets (seconds)
export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
}

// Spring configs — bounce must always be 0
export const spring = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  default: { type: 'spring' as const, duration: 0.3, bounce: 0 },
  snappy: { type: 'spring' as const, stiffness: 500, damping: 30 },
}

// Page transition variants — split-and-stagger with blur
export const pageTransition = {
  initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: duration.normal, ease: easing.emphasis },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(4px)',
    transition: { duration: duration.fast, ease: easing.standard },
  },
}

// Stagger config
export const stagger = {
  item: 0.06,
  container: 0.1,
}

// Stagger container for split-and-stagger enters
export const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

// Stagger item with opacity + y + blur
export const staggerItem = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: duration.normal, ease: easing.emphasis },
  },
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

// List item variants — with blur for premium feel
export const listItem = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: duration.normal, ease: easing.emphasis },
  },
}

// Micro-interaction props for interactive elements
// Scale exactly 0.96 on press — never below 0.95
export const interactive = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.96 },
  transition: spring.default,
}

// Reduced motion media query helper
export const reducedMotion = {
  initial: { opacity: 1, y: 0, filter: 'blur(0px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.01 } },
  exit: { opacity: 0, transition: { duration: 0.01 } },
}
