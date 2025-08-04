import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@company/core'
import { X } from 'lucide-react'
import type {
  BaseComponentProps,
  ComponentWithChildren,
  StandardComponentSize
} from '@company/core'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        success: 'border-transparent bg-green-500 text-white hover:bg-green-600',
        warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
        error: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground border-border hover:bg-accent hover:text-accent-foreground',
        ghost: 'border-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>,
    VariantProps<typeof badgeVariants>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  /** Visual variant of the badge */
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost'
  /** Size of the badge */
  size?: StandardComponentSize
  /** Whether the badge is removable (shows close button) */
  removable?: boolean
  /** Callback when badge is removed */
  onRemove?: () => void
  /** Icon to display before the text */
  icon?: React.ReactNode
  /** Whether the badge is disabled */
  disabled?: boolean
  /** Whether the badge is interactive (clickable) */
  interactive?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({
    className,
    variant,
    size,
    children,
    removable = false,
    onRemove,
    icon,
    disabled = false,
    interactive = false,
    onClick,
    'data-testid': testId,
    ...props
  }, ref) => {
    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation()
      onRemove?.()
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return
      onClick?.(e)
    }

    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant, size }),
          (interactive || onClick) && 'cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        onClick={handleClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        aria-disabled={disabled}
        data-testid={testId}
        {...props}
      >
        {icon && (
          <span className="mr-1 flex items-center">
            {icon}
          </span>
        )}
        
        {children}
        
        {removable && (
          <button
            type="button"
            className="ml-1 flex items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-ring"
            onClick={handleRemove}
            aria-label="Remove badge"
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
