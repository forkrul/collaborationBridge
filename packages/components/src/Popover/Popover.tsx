import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@company/core'
import { X } from 'lucide-react'
import type { 
  BaseComponentProps, 
  ComponentWithChildren,
  StandardComponentSize 
} from '@company/core'

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor
const PopoverClose = PopoverPrimitive.Close

const popoverContentVariants = cva(
  'z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      size: {
        sm: 'w-56 p-3',
        md: 'w-72 p-4',
        lg: 'w-80 p-6',
        auto: 'p-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    VariantProps<typeof popoverContentVariants>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Size variant of the popover */
  size?: StandardComponentSize | 'auto'
  /** Whether to show close button */
  showCloseButton?: boolean
  /** Custom close button */
  closeButton?: React.ReactNode
  /** Whether the popover can be closed by clicking outside */
  closeOnOutsideClick?: boolean
  /** Whether the popover can be closed by pressing escape */
  closeOnEscape?: boolean
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ 
  className, 
  align = 'center', 
  sideOffset = 4,
  size,
  showCloseButton = false,
  closeButton,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  children,
  'data-testid': testId,
  ...props 
}, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(popoverContentVariants({ size }), className)}
      onPointerDownOutside={closeOnOutsideClick ? undefined : (e) => e.preventDefault()}
      onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
      data-testid={testId}
      {...props}
    >
      {children}
      {showCloseButton && (
        closeButton || (
          <PopoverPrimitive.Close className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </PopoverPrimitive.Close>
        )
      )}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

// Enhanced Popover with header and footer
export interface PopoverHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const PopoverHeader = React.forwardRef<HTMLDivElement, PopoverHeaderProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-3', className)}
      data-testid={testId}
      {...props}
    />
  )
)
PopoverHeader.displayName = 'PopoverHeader'

export interface PopoverTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const PopoverTitle = React.forwardRef<HTMLHeadingElement, PopoverTitleProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn('font-medium leading-none', className)}
      data-testid={testId}
      {...props}
    />
  )
)
PopoverTitle.displayName = 'PopoverTitle'

export interface PopoverDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const PopoverDescription = React.forwardRef<HTMLParagraphElement, PopoverDescriptionProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      data-testid={testId}
      {...props}
    />
  )
)
PopoverDescription.displayName = 'PopoverDescription'

export interface PopoverFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const PopoverFooter = React.forwardRef<HTMLDivElement, PopoverFooterProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-end space-x-2 pt-3', className)}
      data-testid={testId}
      {...props}
    />
  )
)
PopoverFooter.displayName = 'PopoverFooter'

// Tooltip-like popover for simple content
export interface TooltipProps
  extends Omit<PopoverContentProps, 'children'>,
    BaseComponentProps {
  /** Tooltip content */
  content: string
  /** Trigger element */
  children: React.ReactNode
  /** Delay before showing (ms) */
  delayDuration?: number
  /** Whether to disable the tooltip */
  disabled?: boolean
}

const Tooltip = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  TooltipProps
>(({ 
  content, 
  children, 
  delayDuration = 700,
  disabled = false,
  size = 'sm',
  'data-testid': testId,
  ...props 
}, ref) => {
  const [open, setOpen] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => setOpen(true), delayDuration)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setOpen(false)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (disabled) {
    return <>{children}</>
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        ref={ref}
        size={size}
        closeOnOutsideClick={false}
        closeOnEscape={false}
        data-testid={testId}
        {...props}
      >
        {content}
      </PopoverContent>
    </Popover>
  )
})
Tooltip.displayName = 'Tooltip'

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverClose,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverFooter,
  Tooltip,
  popoverContentVariants,
}
