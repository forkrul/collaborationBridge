import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, generateId } from '@company/core'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import type { 
  BaseComponentProps, 
  FormComponentProps,
  StandardComponentSize 
} from '@company/core'

const inputVariants = cva(
  'flex w-full rounded-md border bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
      size: {
        sm: 'h-8 px-2 py-1 text-xs',
        md: 'h-10 px-3 py-2',
        lg: 'h-12 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants>,
    BaseComponentProps,
    FormComponentProps {
  /** Label text for the input */
  label?: string
  /** Left icon element */
  leftIcon?: React.ReactNode
  /** Right icon element */
  rightIcon?: React.ReactNode
  /** Input variant */
  variant?: 'default' | 'error' | 'success'
  /** Input size */
  size?: StandardComponentSize
  /** Whether to show character count */
  showCharacterCount?: boolean
  /** Maximum character count */
  maxLength?: number
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type,
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    size = 'md',
    id,
    required,
    disabled,
    showCharacterCount = false,
    maxLength,
    value,
    'data-testid': testId,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [internalId] = React.useState(() => id || generateId('input'))
    
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type
    
    // Determine variant based on error state
    const effectiveVariant = error ? 'error' : variant
    const hasError = Boolean(error) || variant === 'error'
    const hasSuccess = variant === 'success'
    
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    // Calculate character count
    const characterCount = typeof value === 'string' ? value.length : 0
    const showCount = showCharacterCount && (maxLength || characterCount > 0)

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={internalId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              disabled && 'opacity-50'
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-4 w-4 text-muted-foreground">
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            type={inputType}
            id={internalId}
            className={cn(
              inputVariants({ variant: effectiveVariant, size }),
              leftIcon && 'pl-10',
              (rightIcon || isPassword || hasError || hasSuccess) && 'pr-10',
              className
            )}
            ref={ref}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            value={value}
            aria-invalid={hasError}
            aria-describedby={cn(
              error && `${internalId}-error`,
              helperText && !error && `${internalId}-helper`,
              showCount && `${internalId}-count`
            )}
            data-testid={testId}
            {...props}
          />
          
          {/* Error icon */}
          {hasError && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          )}
          
          {/* Success icon */}
          {hasSuccess && !hasError && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          )}
          
          {/* Password toggle */}
          {isPassword && !hasError && !hasSuccess && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={disabled}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              )}
            </button>
          )}
          
          {/* Right icon */}
          {rightIcon && !hasError && !hasSuccess && !isPassword && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="h-4 w-4 text-muted-foreground">
                {rightIcon}
              </div>
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
        
        {/* Character count */}
        {showCount && (
          <p
            id={`${internalId}-count`}
            className={cn(
              'text-xs text-right',
              maxLength && characterCount > maxLength * 0.9 
                ? 'text-warning' 
                : 'text-muted-foreground'
            )}
          >
            {characterCount}{maxLength && `/${maxLength}`}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
