import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, generateId } from '@company/core'
import type { 
  BaseComponentProps, 
  FormComponentProps,
  StandardComponentSize 
} from '@company/core'

const textareaVariants = cva(
  'flex w-full rounded-md border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
  {
    variants: {
      variant: {
        default: 'border-input',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
      size: {
        sm: 'min-h-[60px] px-2 py-1 text-xs',
        md: 'min-h-[80px] px-3 py-2',
        lg: 'min-h-[120px] px-4 py-3 text-base',
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      resize: 'vertical',
    },
  }
)

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants>,
    BaseComponentProps,
    FormComponentProps {
  /** Label text for the textarea */
  label?: string
  /** Textarea variant */
  variant?: 'default' | 'error' | 'success'
  /** Textarea size */
  size?: StandardComponentSize
  /** Resize behavior */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  /** Whether to show character count */
  showCharacterCount?: boolean
  /** Auto-resize based on content */
  autoResize?: boolean
  /** Minimum number of rows */
  minRows?: number
  /** Maximum number of rows */
  maxRows?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label,
    error,
    helperText,
    variant = 'default',
    size = 'md',
    resize = 'vertical',
    required,
    disabled,
    showCharacterCount = false,
    autoResize = false,
    minRows = 3,
    maxRows,
    maxLength,
    value,
    id,
    'data-testid': testId,
    onChange,
    ...props
  }, ref) => {
    const [internalId] = React.useState(() => id || generateId('textarea'))
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    
    // Combine refs
    React.useImperativeHandle(ref, () => textareaRef.current!)

    const effectiveVariant = error ? 'error' : variant
    const hasError = Boolean(error)

    // Auto-resize functionality
    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea || !autoResize) return

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'
      
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight)
      const minHeight = lineHeight * minRows
      const maxHeight = maxRows ? lineHeight * maxRows : Infinity
      
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
      textarea.style.height = `${newHeight}px`
    }, [autoResize, minRows, maxRows])

    // Handle value changes for auto-resize
    React.useEffect(() => {
      if (autoResize) {
        adjustHeight()
      }
    }, [value, adjustHeight, autoResize])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e)
      if (autoResize) {
        adjustHeight()
      }
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

        <textarea
          ref={textareaRef}
          id={internalId}
          className={cn(textareaVariants({ variant: effectiveVariant, size, resize }), className)}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          aria-invalid={hasError}
          aria-describedby={cn(
            error && `${internalId}-error`,
            helperText && `${internalId}-helper`,
            showCount && `${internalId}-count`
          )}
          data-testid={testId}
          style={autoResize ? { minHeight: `${minRows * 1.5}rem` } : undefined}
          {...props}
        />

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

Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
