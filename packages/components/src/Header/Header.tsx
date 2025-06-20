import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@company/core'
import { Menu, X } from 'lucide-react'
import { Button } from '../Button'
import type { 
  BaseComponentProps, 
  ComponentWithChildren,
  ComponentSize 
} from '@company/core'

const headerVariants = cva(
  'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
  {
    variants: {
      variant: {
        default: 'border-border',
        transparent: 'border-transparent bg-transparent backdrop-blur-none',
        solid: 'bg-background border-border',
        floating: 'border-border bg-background/80 backdrop-blur-md rounded-lg mx-4 mt-4',
      },
      size: {
        sm: 'h-12',
        md: 'h-16',
        lg: 'h-20',
      },
      sticky: {
        true: 'sticky top-0 z-50',
        false: 'relative',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      sticky: true,
    },
  }
)

export interface HeaderProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof headerVariants>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Visual variant of the header */
  variant?: 'default' | 'transparent' | 'solid' | 'floating'
  /** Size variant of the header */
  size?: ComponentSize
  /** Whether the header is sticky */
  sticky?: boolean
  /** Logo element */
  logo?: React.ReactNode
  /** Navigation items */
  navigation?: React.ReactNode
  /** Actions on the right side */
  actions?: React.ReactNode
  /** Mobile menu content */
  mobileMenu?: React.ReactNode
  /** Whether to show mobile menu button */
  showMobileMenuButton?: boolean
  /** Mobile menu open state */
  mobileMenuOpen?: boolean
  /** Mobile menu toggle handler */
  onMobileMenuToggle?: (open: boolean) => void
  /** Container className */
  containerClassName?: string
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({
    className,
    variant,
    size,
    sticky,
    logo,
    navigation,
    actions,
    mobileMenu,
    showMobileMenuButton = true,
    mobileMenuOpen = false,
    onMobileMenuToggle,
    containerClassName,
    children,
    'data-testid': testId,
    ...props
  }, ref) => {
    const [internalMobileMenuOpen, setInternalMobileMenuOpen] = React.useState(false)
    
    const isMobileMenuOpen = mobileMenuOpen ?? internalMobileMenuOpen
    const handleMobileMenuToggle = onMobileMenuToggle ?? setInternalMobileMenuOpen

    const toggleMobileMenu = () => {
      handleMobileMenuToggle(!isMobileMenuOpen)
    }

    return (
      <header
        ref={ref}
        className={cn(headerVariants({ variant, size, sticky }), className)}
        data-testid={testId}
        {...props}
      >
        <div className={cn('container mx-auto px-4', containerClassName)}>
          <div className={cn(
            'flex items-center justify-between',
            size === 'sm' ? 'h-12' : size === 'lg' ? 'h-20' : 'h-16'
          )}>
            {/* Logo Section */}
            {logo && (
              <div className="flex items-center">
                {logo}
              </div>
            )}

            {/* Desktop Navigation */}
            {navigation && (
              <div className="hidden md:flex items-center">
                {navigation}
              </div>
            )}

            {/* Actions Section */}
            <div className="flex items-center space-x-4">
              {actions}
              
              {/* Mobile Menu Button */}
              {showMobileMenuButton && mobileMenu && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={toggleMobileMenu}
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenu && isMobileMenuOpen && (
            <div className="md:hidden border-t py-4">
              {mobileMenu}
            </div>
          )}

          {/* Custom children content */}
          {children}
        </div>
      </header>
    )
  }
)

Header.displayName = 'Header'

// Header Logo Component
export interface HeaderLogoProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Logo image or icon */
  icon?: React.ReactNode
  /** Logo text */
  text?: string
  /** Link href */
  href?: string
  /** Link component (for Next.js Link, etc.) */
  linkComponent?: React.ComponentType<any>
}

const HeaderLogo = React.forwardRef<HTMLDivElement, HeaderLogoProps>(
  ({ 
    className, 
    icon, 
    text, 
    href, 
    linkComponent: LinkComponent,
    children,
    'data-testid': testId,
    ...props 
  }, ref) => {
    const content = (
      <div className="flex items-center space-x-2">
        {icon}
        {text && <span className="font-bold text-xl">{text}</span>}
        {children}
      </div>
    )

    if (href) {
      if (LinkComponent) {
        return (
          <LinkComponent href={href} className={cn('flex items-center', className)}>
            {content}
          </LinkComponent>
        )
      }
      return (
        <a 
          ref={ref}
          href={href} 
          className={cn('flex items-center', className)}
          data-testid={testId}
          {...props}
        >
          {content}
        </a>
      )
    }

    return (
      <div 
        ref={ref}
        className={cn('flex items-center', className)}
        data-testid={testId}
        {...props}
      >
        {content}
      </div>
    )
  }
)

HeaderLogo.displayName = 'HeaderLogo'

// Header Navigation Component
export interface HeaderNavigationProps
  extends React.HTMLAttributes<HTMLNavElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const HeaderNavigation = React.forwardRef<HTMLElement, HeaderNavigationProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn('flex items-center space-x-6', className)}
      data-testid={testId}
      {...props}
    />
  )
)

HeaderNavigation.displayName = 'HeaderNavigation'

// Header Actions Component
export interface HeaderActionsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const HeaderActions = React.forwardRef<HTMLDivElement, HeaderActionsProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center space-x-4', className)}
      data-testid={testId}
      {...props}
    />
  )
)

HeaderActions.displayName = 'HeaderActions'

// Header Mobile Menu Component
export interface HeaderMobileMenuProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const HeaderMobileMenu = React.forwardRef<HTMLDivElement, HeaderMobileMenuProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-2', className)}
      data-testid={testId}
      {...props}
    />
  )
)

HeaderMobileMenu.displayName = 'HeaderMobileMenu'

export {
  Header,
  HeaderLogo,
  HeaderNavigation,
  HeaderActions,
  HeaderMobileMenu,
  headerVariants,
}
