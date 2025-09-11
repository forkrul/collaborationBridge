'use client';

import React from 'react';
import { Breadcrumbs as ReshapedBreadcrumbs } from 'reshaped';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MigratedBreadcrumbsProps {
  children: React.ReactNode;
  className?: string;
  
  // Reshaped specific props
  color?: 'primary' | string;
  defaultVisibleItems?: number;
  expandAriaLabel?: string;
  disableExpand?: boolean;
  separator?: React.ReactNode | string;
  
  // Accessibility
  ariaLabel?: string;
  
  // Migration control
  useReshaped?: boolean;
  
  // Additional props
  [key: string]: any;
}

/**
 * MigratedBreadcrumbs provides a gradual migration path from custom breadcrumbs to Reshaped Breadcrumbs
 * 
 * Note: shadcn/ui doesn't have a native Breadcrumbs component, so this primarily showcases
 * Reshaped Breadcrumbs with a basic fallback implementation.
 * 
 * Usage:
 * - Set useReshaped={true} to use Reshaped Breadcrumbs (recommended)
 * - Set useReshaped={false} for a basic breadcrumb implementation
 */
export function MigratedBreadcrumbs({
  children,
  className,
  color,
  defaultVisibleItems,
  expandAriaLabel,
  disableExpand,
  separator = <ChevronRight className="h-4 w-4" />,
  ariaLabel,
  useReshaped = true, // Default to true since shadcn doesn't have Breadcrumbs
  ...props
}: MigratedBreadcrumbsProps) {
  
  if (useReshaped) {
    return (
      <ReshapedBreadcrumbs
        color={color}
        defaultVisibleItems={defaultVisibleItems}
        expandAriaLabel={expandAriaLabel}
        disableExpand={disableExpand}
        separator={separator}
        attributes={{ ariaLabel }}
        className={cn(className)}
        {...props}
      >
        {children}
      </ReshapedBreadcrumbs>
    );
  }

  // Fallback implementation using basic HTML structure
  const childrenArray = React.Children.toArray(children);
  
  return (
    <nav 
      aria-label={ariaLabel || 'Breadcrumb'}
      className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}
      {...props}
    >
      <ol className="flex items-center space-x-1">
        {childrenArray.map((child, index) => (
          <li key={index} className="flex items-center">
            {child}
            {index < childrenArray.length - 1 && (
              <span className="mx-2 text-muted-foreground">
                {typeof separator === 'string' ? separator : separator}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Breadcrumbs Item Component
interface MigratedBreadcrumbsItemProps {
  children: React.ReactNode;
  className?: string;
  
  // Navigation props
  onClick?: () => void;
  href?: string;
  
  // Visual props
  icon?: React.ReactNode;
  disabled?: boolean;
  
  // Migration control
  useReshaped?: boolean;
  
  // Additional props
  [key: string]: any;
}

export function MigratedBreadcrumbsItem({
  children,
  className,
  onClick,
  href,
  icon,
  disabled = false,
  useReshaped = true, // Default to true since shadcn doesn't have Breadcrumbs
  ...props
}: MigratedBreadcrumbsItemProps) {
  
  if (useReshaped) {
    return (
      <ReshapedBreadcrumbs.Item
        onClick={onClick}
        href={href}
        icon={icon}
        disabled={disabled}
        className={cn(className)}
        {...props}
      >
        {children}
      </ReshapedBreadcrumbs.Item>
    );
  }

  // Fallback implementation
  const isActive = !onClick && !href;
  
  if (href) {
    return (
      <a
        href={href}
        className={cn(
          'hover:text-foreground transition-colors',
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-1">
          {icon}
          {children}
        </span>
      </a>
    );
  }
  
  if (onClick && !disabled) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'hover:text-foreground transition-colors',
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-1">
          {icon}
          {children}
        </span>
      </button>
    );
  }
  
  // Active/current item
  return (
    <span 
      className={cn(
        'text-foreground font-medium',
        disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-1">
        {icon}
        {children}
      </span>
    </span>
  );
}

// Export compound components
export { 
  MigratedBreadcrumbs as Breadcrumbs,
  MigratedBreadcrumbsItem as BreadcrumbsItem,
};
