import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@company/core'
import type { 
  BaseComponentProps, 
  StandardComponentSize 
} from '@company/core'

const progressVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-secondary',
  {
    variants: {
      variant: {
        default: '',
        success: '',
        warning: '',
        error: '',
      },
      size: {
        sm: 'h-2',
        md: 'h-4',
        lg: 'h-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

const progressIndicatorVariants = cva(
  'h-full w-full flex-1 transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants>,
    BaseComponentProps {
  /** Progress value (0-100) */
  value?: number
  /** Maximum value (default: 100) */
  max?: number
  /** Visual variant */
  variant?: 'default' | 'success' | 'warning' | 'error'
  /** Size variant */
  size?: StandardComponentSize
  /** Whether to show percentage text */
  showValue?: boolean
  /** Custom label text */
  label?: string
  /** Whether the progress is indeterminate (loading) */
  indeterminate?: boolean
  /** Custom format function for the value display */
  formatValue?: (value: number, max: number) => string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({
  className,
  value = 0,
  max = 100,
  variant,
  size,
  showValue = false,
  label,
  indeterminate = false,
  formatValue,
  'data-testid': testId,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const defaultFormatValue = (val: number, maxVal: number) => {
    return `${Math.round((val / maxVal) * 100)}%`
  }

  const displayValue = formatValue 
    ? formatValue(value, max) 
    : defaultFormatValue(value, max)

  return (
    <div className="space-y-2">
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-sm font-medium text-foreground">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm text-muted-foreground">
              {displayValue}
            </span>
          )}
        </div>
      )}
      
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(progressVariants({ variant, size }), className)}
        value={indeterminate ? undefined : value}
        max={max}
        data-testid={testId}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            progressIndicatorVariants({ variant }),
            indeterminate && 'animate-pulse'
          )}
          style={{
            transform: indeterminate 
              ? 'translateX(0%)' 
              : `translateX(-${100 - percentage}%)`
          }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
})

Progress.displayName = 'Progress'

export { Progress, progressVariants, progressIndicatorVariants }
