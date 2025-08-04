import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@company/core'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../Button'
import type { 
  BaseComponentProps, 
  ComponentWithChildren,
  StandardComponentSize 
} from '@company/core'

const sidebarVariants = cva(
  'flex flex-col h-full bg-background border-r transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-border',
        floating: 'border-border bg-background/80 backdrop-blur-md rounded-lg m-4 h-[calc(100%-2rem)]',
        minimal: 'border-transparent bg-transparent',
      },
      size: {
        sm: 'w-12',
        md: 'w-64',
        lg: 'w-80',
      },
      position: {
        left: '',
        right: 'border-l border-r-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      position: 'left',
    },
  }
)

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Visual variant of the sidebar */
  variant?: 'default' | 'floating' | 'minimal'
  /** Size variant when expanded */
  size?: StandardComponentSize
  /** Position of the sidebar */
  position?: 'left' | 'right'
  /** Whether the sidebar is collapsible */
  collapsible?: boolean
  /** Whether the sidebar is collapsed */
  collapsed?: boolean
  /** Callback when collapse state changes */
  onCollapsedChange?: (collapsed: boolean) => void
  /** Header content */
  header?: React.ReactNode
  /** Footer content */
  footer?: React.ReactNode
  /** Navigation content */
  navigation?: React.ReactNode
  /** Collapsed width */
  collapsedWidth?: string
  /** Expanded width */
  expandedWidth?: string
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({
    className,
    variant,
    size,
    position,
    collapsible = true,
    collapsed = false,
    onCollapsedChange,
    header,
    footer,
    navigation,
    children,
    collapsedWidth = 'w-16',
    expandedWidth,
    'data-testid': testId,
    ...props
  }, ref) => {
    const [internalCollapsed, setInternalCollapsed] = React.useState(collapsed)
    
    const isCollapsed = collapsed ?? internalCollapsed
    const handleCollapsedChange = onCollapsedChange ?? setInternalCollapsed

    const toggleCollapsed = () => {
      handleCollapsedChange(!isCollapsed)
    }

    const getWidth = () => {
      if (isCollapsed) return collapsedWidth
      if (expandedWidth) return expandedWidth
      return size === 'sm' ? 'w-48' : size === 'lg' ? 'w-80' : 'w-64'
    }

    return (
      <div
        ref={ref}
        className={cn(
          sidebarVariants({ variant, position }),
          getWidth(),
          className
        )}
        data-testid={testId}
        {...props}
      >
        {/* Header */}
        {header && (
          <div className="flex items-center justify-between p-4 border-b">
            {!isCollapsed && (
              <div className="flex-1">
                {header}
              </div>
            )}
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapsed}
                className="h-8 w-8 p-0 flex-shrink-0"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {position === 'right' ? (
                  isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                ) : (
                  isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        )}

        {/* Navigation */}
        {navigation && (
          <nav className="flex-1 p-4">
            {navigation}
          </nav>
        )}

        {/* Custom children content */}
        {children && (
          <div className="flex-1 p-4">
            {children}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t">
            {footer}
          </div>
        )}
      </div>
    )
  }
)

Sidebar.displayName = 'Sidebar'

// Sidebar Header Component
export interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Logo or brand element */
  logo?: React.ReactNode
  /** Title text */
  title?: string
}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, logo, title, children, 'data-testid': testId, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center space-x-2', className)}
      data-testid={testId}
      {...props}
    >
      {logo}
      {title && <span className="font-bold text-lg">{title}</span>}
      {children}
    </div>
  )
)

SidebarHeader.displayName = 'SidebarHeader'

// Sidebar Navigation Component
export interface SidebarNavigationProps
  extends React.HTMLAttributes<HTMLElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const SidebarNavigation = React.forwardRef<HTMLElement, SidebarNavigationProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn('space-y-2', className)}
      data-testid={testId}
      {...props}
    />
  )
)

SidebarNavigation.displayName = 'SidebarNavigation'

// Sidebar Item Component
export interface SidebarItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Icon element */
  icon?: React.ReactNode
  /** Item text */
  text?: string
  /** Badge element */
  badge?: React.ReactNode
  /** Whether the item is active */
  active?: boolean
  /** Whether the sidebar is collapsed */
  collapsed?: boolean
  /** Link href */
  href?: string
  /** Link component (for Next.js Link, etc.) */
  linkComponent?: React.ComponentType<any>
  /** Click handler */
  onClick?: () => void
}

const SidebarItem = React.forwardRef<HTMLDivElement, SidebarItemProps>(
  ({
    className,
    icon,
    text,
    badge,
    active = false,
    collapsed = false,
    href,
    linkComponent: LinkComponent,
    onClick,
    children,
    'data-testid': testId,
    ...props
  }, ref) => {
    const content = (
      <div
        className={cn(
          'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
          active
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent',
          collapsed && 'justify-center',
          className
        )}
        onClick={onClick}
        title={collapsed ? text : undefined}
      >
        {icon && <div className="flex-shrink-0">{icon}</div>}
        {!collapsed && (
          <>
            {text && <span className="flex-1">{text}</span>}
            {badge && <div className="flex-shrink-0">{badge}</div>}
            {children}
          </>
        )}
      </div>
    )

    if (href) {
      if (LinkComponent) {
        return (
          <LinkComponent href={href} ref={ref} data-testid={testId} {...props}>
            {content}
          </LinkComponent>
        )
      }
      return (
        <a href={href} ref={ref} data-testid={testId} {...props}>
          {content}
        </a>
      )
    }

    return (
      <div ref={ref} data-testid={testId} {...props}>
        {content}
      </div>
    )
  }
)

SidebarItem.displayName = 'SidebarItem'

// Sidebar Footer Component
export interface SidebarFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-xs text-muted-foreground', className)}
      data-testid={testId}
      {...props}
    />
  )
)

SidebarFooter.displayName = 'SidebarFooter'

export {
  Sidebar,
  SidebarHeader,
  SidebarNavigation,
  SidebarItem,
  SidebarFooter,
  sidebarVariants,
}
