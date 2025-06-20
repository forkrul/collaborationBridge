import * as React from 'react'

/**
 * Base component props that all components should extend
 */
export interface BaseComponentProps {
  /** Additional CSS class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
  /** Test ID for testing purposes */
  'data-testid'?: string
  /** ARIA label for accessibility */
  'aria-label'?: string
  /** ARIA described by for accessibility */
  'aria-describedby'?: string
}

/**
 * Component props with children
 */
export interface ComponentWithChildren extends BaseComponentProps {
  children?: React.ReactNode
}

/**
 * Component size variants
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Component variant types
 */
export type ComponentVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outline'

/**
 * Component color schemes
 */
export type ComponentColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'

/**
 * Component state types
 */
export type ComponentState = 'default' | 'hover' | 'focus' | 'active' | 'disabled' | 'loading'

/**
 * Polymorphic component props
 * Allows components to render as different HTML elements
 */
export type PolymorphicComponentProps<T extends React.ElementType> = {
  as?: T
} & React.ComponentPropsWithoutRef<T>

/**
 * Form component props
 */
export interface FormComponentProps extends BaseComponentProps {
  /** Whether the component is disabled */
  disabled?: boolean
  /** Whether the component is required */
  required?: boolean
  /** Whether the component is read-only */
  readOnly?: boolean
  /** Error message to display */
  error?: string
  /** Helper text to display */
  helperText?: string
  /** Component name for form submission */
  name?: string
  /** Component ID */
  id?: string
}

/**
 * Interactive component props
 */
export interface InteractiveComponentProps extends BaseComponentProps {
  /** Click handler */
  onClick?: (event: React.MouseEvent) => void
  /** Key down handler */
  onKeyDown?: (event: React.KeyboardEvent) => void
  /** Focus handler */
  onFocus?: (event: React.FocusEvent) => void
  /** Blur handler */
  onBlur?: (event: React.FocusEvent) => void
  /** Whether the component is disabled */
  disabled?: boolean
  /** Tab index for keyboard navigation */
  tabIndex?: number
}

/**
 * Loading state props
 */
export interface LoadingProps {
  /** Whether the component is in loading state */
  loading?: boolean
  /** Loading text to display */
  loadingText?: string
  /** Custom loading indicator */
  loadingIndicator?: React.ReactNode
}

/**
 * Responsive props for different breakpoints
 */
export interface ResponsiveProps<T> {
  /** Value for mobile devices */
  mobile?: T
  /** Value for tablet devices */
  tablet?: T
  /** Value for desktop devices */
  desktop?: T
  /** Value for wide screens */
  wide?: T
}

/**
 * Animation props
 */
export interface AnimationProps {
  /** Animation duration */
  duration?: number
  /** Animation delay */
  delay?: number
  /** Animation easing function */
  easing?: string
  /** Whether animation is disabled */
  disableAnimation?: boolean
}

/**
 * Accessibility props
 */
export interface AccessibilityProps {
  /** ARIA role */
  role?: string
  /** ARIA expanded state */
  'aria-expanded'?: boolean
  /** ARIA selected state */
  'aria-selected'?: boolean
  /** ARIA checked state */
  'aria-checked'?: boolean
  /** ARIA disabled state */
  'aria-disabled'?: boolean
  /** ARIA hidden state */
  'aria-hidden'?: boolean
  /** ARIA live region */
  'aria-live'?: 'off' | 'polite' | 'assertive'
  /** ARIA controls */
  'aria-controls'?: string
  /** ARIA owns */
  'aria-owns'?: string
}

/**
 * Generic event handler types
 */
export type EventHandler<T = Element, E = Event> = (event: E & { target: T }) => void
export type ChangeEventHandler<T = Element> = EventHandler<T, React.ChangeEvent>
export type FocusEventHandler<T = Element> = EventHandler<T, React.FocusEvent>
export type KeyboardEventHandler<T = Element> = EventHandler<T, React.KeyboardEvent>
export type MouseEventHandler<T = Element> = EventHandler<T, React.MouseEvent>
