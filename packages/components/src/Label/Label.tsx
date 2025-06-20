import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@company/core'
import type { 
  BaseComponentProps, 
  ComponentWithChildren,
  ComponentSize 
} from '@company/core'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        error: 'text-destructive',
        success: 'text-green-600',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      weight: 'medium',
    },
  }
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Visual variant of the label */
  variant?: 'default' | 'muted' | 'error' | 'success'
  /** Size of the label */
  size?: ComponentSize
  /** Font weight of the label */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  /** Whether the field is required (shows asterisk) */
  required?: boolean
  /** Whether the label is disabled */
  disabled?: boolean
  /** Optional description text */
  description?: string
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ 
  className, 
  variant, 
  size, 
  weight, 
  required = false, 
  disabled = false,
  description,
  children,
  'data-testid': testId,
  ...props 
}, ref) => (
  <div className="space-y-1">
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        labelVariants({ variant, size, weight }),
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      data-testid={testId}
      {...props}
    >
      {children}
      {required && (
        <span 
          className="text-destructive ml-1" 
          aria-label="required"
          title="This field is required"
        >
          *
        </span>
      )}
    </LabelPrimitive.Root>
    
    {description && (
      <p className={cn(
        'text-xs text-muted-foreground',
        disabled && 'opacity-50'
      )}>
        {description}
      </p>
    )}
  </div>
))

Label.displayName = 'Label'

export { Label, labelVariants }
