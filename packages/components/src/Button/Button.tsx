import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@company/core'
import { Loader2 } from 'lucide-react'
import type { 
  BaseComponentProps, 
  InteractiveComponentProps, 
  LoadingProps,
  StandardComponentSize,
  ComponentVariant 
} from '@company/core'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        tertiary: 'bg-tertiary text-tertiary-foreground hover:bg-tertiary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-8 rounded px-2 text-xs',
        sm: 'h-9 rounded-md px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onBlur'>,
    VariantProps<typeof buttonVariants>,
    BaseComponentProps,
    LoadingProps {
  /** Render as a different component */
  asChild?: boolean
  /** Left icon element */
  leftIcon?: React.ReactNode
  /** Right icon element */
  rightIcon?: React.ReactNode
  /** Button variant */
  variant?: ComponentVariant | 'destructive' | 'link'
  /** Button size */
  size?: StandardComponentSize | 'icon'
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    loadingText,
    loadingIndicator,
    leftIcon,
    rightIcon,
    children,
    disabled,
    'data-testid': testId,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || loading

    const renderLoadingIndicator = () => {
      if (loadingIndicator) {
        return <span className="mr-2">{loadingIndicator}</span>
      }
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    }

    const renderContent = () => {
      if (loading) {
        return (
          <>
            {renderLoadingIndicator()}
            {loadingText || children}
          </>
        )
      }

      return (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        data-testid={testId}
        {...props}
      >
        {renderContent()}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
