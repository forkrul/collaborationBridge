/**
 * Animation tokens for the design system
 * Includes timing functions, durations, and common animations
 */

export const animationDuration = {
  instant: '0ms',
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '750ms',
  slowest: '1000ms',
} as const

export const animationTimingFunction = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  
  // Custom cubic-bezier curves
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
} as const

export const animationDelay = {
  none: '0ms',
  short: '75ms',
  medium: '150ms',
  long: '300ms',
} as const

// Semantic animation mappings
export const semanticAnimations = {
  // Transitions
  transition: {
    fast: {
      duration: animationDuration.fast,
      timingFunction: animationTimingFunction.smooth,
    },
    normal: {
      duration: animationDuration.normal,
      timingFunction: animationTimingFunction.smooth,
    },
    slow: {
      duration: animationDuration.slow,
      timingFunction: animationTimingFunction.smooth,
    },
  },
  
  // Interactive states
  interactive: {
    hover: {
      duration: animationDuration.fast,
      timingFunction: animationTimingFunction.easeOut,
    },
    focus: {
      duration: animationDuration.fast,
      timingFunction: animationTimingFunction.easeOut,
    },
    active: {
      duration: animationDuration.instant,
      timingFunction: animationTimingFunction.easeIn,
    },
  },
  
  // Component animations
  component: {
    modal: {
      enter: {
        duration: animationDuration.normal,
        timingFunction: animationTimingFunction.spring,
      },
      exit: {
        duration: animationDuration.fast,
        timingFunction: animationTimingFunction.easeIn,
      },
    },
    dropdown: {
      enter: {
        duration: animationDuration.fast,
        timingFunction: animationTimingFunction.easeOut,
      },
      exit: {
        duration: animationDuration.fast,
        timingFunction: animationTimingFunction.easeIn,
      },
    },
    tooltip: {
      enter: {
        duration: animationDuration.fast,
        timingFunction: animationTimingFunction.easeOut,
      },
      exit: {
        duration: animationDuration.fast,
        timingFunction: animationTimingFunction.easeIn,
      },
    },
  },
} as const

// Common keyframe animations
export const keyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  slideInUp: {
    from: { transform: 'translateY(100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInDown: {
    from: { transform: 'translateY(-100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInLeft: {
    from: { transform: 'translateX(-100%)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  slideInRight: {
    from: { transform: 'translateX(100%)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  scaleIn: {
    from: { transform: 'scale(0.9)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
  scaleOut: {
    from: { transform: 'scale(1)', opacity: 1 },
    to: { transform: 'scale(0.9)', opacity: 0 },
  },
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
  bounce: {
    '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
    '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
  },
} as const

export type AnimationDuration = typeof animationDuration
export type AnimationTimingFunction = typeof animationTimingFunction
export type AnimationDelay = typeof animationDelay
export type SemanticAnimations = typeof semanticAnimations
export type Keyframes = typeof keyframes
