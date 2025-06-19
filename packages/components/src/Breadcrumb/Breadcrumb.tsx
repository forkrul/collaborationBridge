import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@company/core'
import { ChevronRight, MoreHorizontal, Home, Slash } from 'lucide-react'
import type { 
  BaseComponentProps, 
  ComponentWithChildren,
  ComponentSize 
} from '@company/core'

const breadcrumbVariants = cva(
  'flex flex-wrap items-center break-words text-muted-foreground',
  {
    variants: {
      variant: {
        default: '',
        pills: 'space-x-1',
        arrows: 'space-x-0',
      },
      size: {
        sm: 'gap-1 text-xs',
        md: 'gap-1.5 text-sm sm:gap-2.5',
        lg: 'gap-2 text-base sm:gap-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BreadcrumbProps
  extends React.ComponentPropsWithoutRef<'nav'>,
    VariantProps<typeof breadcrumbVariants>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Visual variant of the breadcrumb */
  variant?: 'default' | 'pills' | 'arrows'
  /** Size variant */
  size?: ComponentSize
  /** Custom separator component */
  separator?: React.ComponentType<{ className?: string }>
  /** Maximum number of items to show before collapsing */
  maxItems?: number
  /** Whether to show home icon for first item */
  showHomeIcon?: boolean
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ 
    className, 
    variant, 
    size, 
    separator, 
    maxItems, 
    showHomeIcon = false,
    'data-testid': testId,
    ...props 
  }, ref) => (
    <nav 
      ref={ref} 
      aria-label="breadcrumb" 
      className={cn(breadcrumbVariants({ variant, size }), className)}
      data-testid={testId}
      {...props} 
    />
  )
)
Breadcrumb.displayName = 'Breadcrumb'

export interface BreadcrumbListProps
  extends React.ComponentPropsWithoutRef<'ol'>,
    BaseComponentProps,
    ComponentWithChildren {}

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn('flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5', className)}
      data-testid={testId}
      {...props}
    />
  )
)
BreadcrumbList.displayName = 'BreadcrumbList'

export interface BreadcrumbItemProps
  extends React.ComponentPropsWithoutRef<'li'>,
    BaseComponentProps,
    ComponentWithChildren {}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <li
      ref={ref}
      className={cn('inline-flex items-center gap-1.5', className)}
      data-testid={testId}
      {...props}
    />
  )
)
BreadcrumbItem.displayName = 'BreadcrumbItem'

export interface BreadcrumbLinkProps
  extends React.ComponentPropsWithoutRef<'a'>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Render as child component */
  asChild?: boolean
  /** Link component (for Next.js Link, etc.) */
  linkComponent?: React.ComponentType<any>
  /** Whether this is the current page */
  current?: boolean
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ 
    asChild, 
    className, 
    linkComponent: LinkComponent,
    current = false,
    'data-testid': testId,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : LinkComponent || 'a'

    return (
      <Comp
        ref={ref}
        className={cn(
          'transition-colors hover:text-foreground',
          current && 'text-foreground font-medium',
          className
        )}
        aria-current={current ? 'page' : undefined}
        data-testid={testId}
        {...props}
      />
    )
  }
)
BreadcrumbLink.displayName = 'BreadcrumbLink'

export interface BreadcrumbPageProps
  extends React.ComponentPropsWithoutRef<'span'>,
    BaseComponentProps,
    ComponentWithChildren {}

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('font-normal text-foreground', className)}
      data-testid={testId}
      {...props}
    />
  )
)
BreadcrumbPage.displayName = 'BreadcrumbPage'

export interface BreadcrumbSeparatorProps
  extends React.ComponentProps<'li'>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Custom separator icon */
  icon?: React.ReactNode
}

const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ children, className, icon, 'data-testid': testId, ...props }, ref) => (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      data-testid={testId}
      {...props}
    >
      {children ?? icon ?? <ChevronRight />}
    </li>
  )
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

export interface BreadcrumbEllipsisProps
  extends React.ComponentProps<'span'>,
    BaseComponentProps {}

const BreadcrumbEllipsis = React.forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <span
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      data-testid={testId}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More</span>
    </span>
  )
)
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'

// Enhanced Breadcrumb with automatic generation
export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface AutoBreadcrumbProps
  extends Omit<BreadcrumbProps, 'children'>,
    BaseComponentProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[]
  /** Custom separator icon */
  separatorIcon?: React.ReactNode
  /** Link component (for Next.js Link, etc.) */
  linkComponent?: React.ComponentType<any>
  /** Whether to show home icon for first item */
  showHomeIcon?: boolean
  /** Home icon */
  homeIcon?: React.ReactNode
  /** Maximum items before showing ellipsis */
  maxItems?: number
}

const AutoBreadcrumb = React.forwardRef<HTMLElement, AutoBreadcrumbProps>(
  ({
    items,
    separatorIcon,
    linkComponent,
    showHomeIcon = false,
    homeIcon = <Home className="h-4 w-4" />,
    maxItems,
    'data-testid': testId,
    ...props
  }, ref) => {
    const shouldCollapse = maxItems && items.length > maxItems
    const visibleItems = shouldCollapse 
      ? [
          items[0], 
          ...items.slice(-(maxItems - 2))
        ]
      : items

    return (
      <Breadcrumb ref={ref} data-testid={testId} {...props}>
        <BreadcrumbList>
          {visibleItems.map((item, index) => (
            <React.Fragment key={index}>
              {/* Show ellipsis after first item if collapsed */}
              {shouldCollapse && index === 1 && (
                <>
                  <BreadcrumbEllipsis />
                  <BreadcrumbSeparator icon={separatorIcon} />
                </>
              )}
              
              <BreadcrumbItem>
                {item.current ? (
                  <BreadcrumbPage>
                    {index === 0 && showHomeIcon && homeIcon}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href={item.href} 
                    linkComponent={linkComponent}
                  >
                    {index === 0 && showHomeIcon && homeIcon}
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              
              {/* Separator (not after last item) */}
              {index < visibleItems.length - 1 && (
                <BreadcrumbSeparator icon={separatorIcon} />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }
)
AutoBreadcrumb.displayName = 'AutoBreadcrumb'

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  AutoBreadcrumb,
  breadcrumbVariants,
}
