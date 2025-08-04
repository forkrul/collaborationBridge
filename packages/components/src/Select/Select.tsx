import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, generateId } from '@company/core'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import type { 
  BaseComponentProps, 
  FormComponentProps,
  StandardComponentSize 
} from '@company/core'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const selectTriggerVariants = cva(
  'flex w-full items-center justify-between rounded-md border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
  {
    variants: {
      variant: {
        default: 'border-input',
        error: 'border-destructive focus:ring-destructive',
        success: 'border-green-500 focus:ring-green-500',
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

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants>,
    BaseComponentProps {
  /** Visual variant */
  variant?: 'default' | 'error' | 'success'
  /** Size variant */
  size?: StandardComponentSize
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, variant, size, 'data-testid': testId, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ variant, size }), className)}
    data-testid={testId}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> & BaseComponentProps
>(({ className, 'data-testid': testId, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    data-testid={testId}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> & BaseComponentProps
>(({ className, 'data-testid': testId, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    data-testid={testId}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

export interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>,
    BaseComponentProps {}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, position = 'popper', 'data-testid': testId, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      data-testid={testId}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

export interface SelectLabelProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>,
    BaseComponentProps {}

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, 'data-testid': testId, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    data-testid={testId}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>,
    BaseComponentProps {}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, 'data-testid': testId, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    data-testid={testId}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export interface SelectSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>,
    BaseComponentProps {}

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  SelectSeparatorProps
>(({ className, 'data-testid': testId, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    data-testid={testId}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Enhanced Select wrapper with form integration
export interface SelectFieldProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>, 'children'>,
    FormComponentProps,
    Pick<SelectTriggerProps, 'variant' | 'size'> {
  /** Label text */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Select options */
  children: React.ReactNode
  /** Trigger props */
  triggerProps?: Omit<SelectTriggerProps, 'variant' | 'size'>
  /** Content props */
  contentProps?: SelectContentProps
}

const SelectField = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectFieldProps
>(({
  label,
  placeholder,
  error,
  helperText,
  required,
  disabled,
  variant = 'default',
  size = 'md',
  id,
  children,
  triggerProps,
  contentProps,
  'data-testid': testId,
  ...props
}, ref) => {
  const [internalId] = React.useState(() => id || generateId('select'))
  const effectiveVariant = error ? 'error' : variant

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

      <Select disabled={disabled} {...props}>
        <SelectTrigger
          ref={ref}
          id={internalId}
          variant={effectiveVariant}
          size={size}
          aria-invalid={Boolean(error)}
          aria-describedby={cn(
            error && `${internalId}-error`,
            helperText && `${internalId}-helper`
          )}
          data-testid={testId}
          {...triggerProps}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent {...contentProps}>
          {children}
        </SelectContent>
      </Select>

      {error && (
        <p
          id={`${internalId}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}

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
SelectField.displayName = 'SelectField'

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectField,
  selectTriggerVariants,
}
