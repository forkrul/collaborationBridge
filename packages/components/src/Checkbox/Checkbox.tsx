import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, generateId } from '@company/core'
import { Check, Minus } from 'lucide-react'
import type { 
  BaseComponentProps, 
  FormComponentProps,
  StandardComponentSize 
} from '@company/core'

const checkboxVariants = cva(
  'peer shrink-0 rounded-sm border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        secondary: 'border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground',
        success: 'border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white',
        warning: 'border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-white',
        error: 'border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground',
      },
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants>,
    BaseComponentProps,
    Omit<FormComponentProps, 'readOnly'> {
  /** Label text for the checkbox */
  label?: string
  /** Description text */
  description?: string
  /** Visual variant */
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error'
  /** Size variant */
  size?: StandardComponentSize
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean
  /** Custom icon for checked state */
  checkedIcon?: React.ReactNode
  /** Custom icon for indeterminate state */
  indeterminateIcon?: React.ReactNode
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({
  className,
  variant,
  size,
  label,
  description,
  error,
  helperText,
  required,
  disabled,
  indeterminate,
  checkedIcon,
  indeterminateIcon,
  id,
  'data-testid': testId,
  ...props
}, ref) => {
  const [internalId] = React.useState(() => id || generateId('checkbox'))
  
  // Handle indeterminate state
  const checkboxRef = React.useRef<HTMLButtonElement>(null)
  
  React.useEffect(() => {
    if (checkboxRef.current) {
      // Set indeterminate state via DOM property
      const element = checkboxRef.current as any
      if (element && 'indeterminate' in element) {
        element.indeterminate = Boolean(indeterminate)
      }
    }
  }, [indeterminate])

  const effectiveVariant = error ? 'error' : variant
  const hasError = Boolean(error)

  const renderIndicator = () => {
    if (indeterminate && indeterminateIcon) {
      return indeterminateIcon
    }
    if (indeterminate) {
      return <Minus className={cn(size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-4 w-4' : 'h-3 w-3')} />
    }
    if (checkedIcon) {
      return checkedIcon
    }
    return <Check className={cn(size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-4 w-4' : 'h-3 w-3')} />
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-2">
        <CheckboxPrimitive.Root
          ref={(node) => {
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
            if (checkboxRef) {
              (checkboxRef as any).current = node
            }
          }}
          id={internalId}
          className={cn(checkboxVariants({ variant: effectiveVariant, size }), className)}
          disabled={disabled}
          required={required}
          checked={indeterminate ? 'indeterminate' : undefined}
          aria-invalid={hasError}
          aria-describedby={cn(
            error && `${internalId}-error`,
            helperText && !error && `${internalId}-helper`,
            description && `${internalId}-description`
          )}
          data-testid={testId}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
            {renderIndicator()}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {(label || description) && (
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label
                htmlFor={internalId}
                className={cn(
                  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </label>
            )}
            
            {description && (
              <p
                id={`${internalId}-description`}
                className={cn(
                  'text-xs text-muted-foreground',
                  disabled && 'opacity-50'
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p
          id={`${internalId}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p
          id={`${internalId}-helper`}
          className="text-sm text-muted-foreground"
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export { Checkbox, checkboxVariants }
