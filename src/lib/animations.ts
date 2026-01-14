/**
 * ARCO Animation Utilities
 * 
 * Framer Motion variants and utilities for consistent animations
 * across the ARCO platform
 */

import { Variants } from 'framer-motion';

// ============================================================================
// Page Transitions
// ============================================================================

/**
 * Fade in animation for page content
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Fade in with slide up
 */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Fade in with slide down
 */
export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: { opacity: 0, y: -20 },
};

/**
 * Scale animation
 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: { opacity: 0, scale: 0.95 },
};

// ============================================================================
// Container Animations (Stagger Children)
// ============================================================================

/**
 * Container with staggered children
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Container with faster stagger
 */
export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// ============================================================================
// Item Animations (for staggered lists)
// ============================================================================

/**
 * Item fade in up (for staggered lists)
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// ============================================================================
// Interactive Animations (Hover, Tap)
// ============================================================================

/**
 * Button hover scale
 */
export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

/**
 * Button tap scale
 */
export const buttonTap = {
  scale: 0.98,
};

/**
 * Card hover lift
 */
export const cardHover = {
  y: -4,
  transition: { duration: 0.2 },
};

/**
 * Card tap
 */
export const cardTap = {
  scale: 0.98,
};

// ============================================================================
// Preset Transition Configs
// ============================================================================

/**
 * Spring transition (bouncy)
 */
export const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

/**
 * Smooth easing transition
 */
export const smoothTransition = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};

/**
 * Fast transition
 */
export const fastTransition = {
  duration: 0.15,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get delay for staggered items
 */
export function getStaggerDelay(index: number, baseDelay = 0.1) {
  return index * baseDelay;
}

/**
 * Create custom fade in with delay
 */
export function fadeInWithDelay(delay: number): Variants {
  return {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        delay,
        duration: 0.4,
      },
    },
    exit: { opacity: 0 },
  };
}
