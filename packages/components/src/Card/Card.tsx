import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@company/core'
import type { 
  BaseComponentProps, 
  ComponentWithChildren,
  StandardComponentSize 
} from '@company/core'

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: 'border-border',
        outlined: 'border-2 border-border',
        elevated: 'shadow-md border-0',
        filled: 'bg-muted border-0',
      },
      size: {
        sm: 'text-sm',
        md: '',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Visual variant of the card */
  variant?: 'default' | 'outlined' | 'elevated' | 'filled'
  /** Size variant of the card */
  size?: StandardComponentSize
  /** Whether the card is interactive (clickable) */
  interactive?: boolean
  /** Whether the card is disabled */
  disabled?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    size, 
    interactive = false, 
    disabled = false,
    'data-testid': testId,
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, size }),
        interactive && 'cursor-pointer transition-colors hover:bg-accent/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      data-testid={testId}
      {...props}
    />
  )
)
Card.displayName = 'Card'

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      data-testid={testId}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Heading level for semantic HTML */
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, level = 3, 'data-testid': testId, ...props }, ref) => {
    const Heading = `h${level}` as keyof JSX.IntrinsicElements
    
    return (
      <Heading
        ref={ref as any}
        className={cn(
          'text-2xl font-semibold leading-none tracking-tight',
          className
        )}
        data-testid={testId}
        {...props}
      />
    )
  }
)
CardTitle.displayName = 'CardTitle'

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      data-testid={testId}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn('p-6 pt-0', className)} 
      data-testid={testId}
      {...props} 
    />
  )
)
CardContent.displayName = 'CardContent'

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      data-testid={testId}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  cardVariants 
}
