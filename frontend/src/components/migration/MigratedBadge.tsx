'use client';

import React from 'react';
import { Badge as ReshapedBadge } from 'reshaped';
import { Badge as ShadcnBadge } from '@/components/ui/badge';
import { themeUtils } from '@/lib/reshaped-theme';
import { cn } from '@/lib/utils';

interface MigratedBadgeProps {
  children: React.ReactNode;
  
  // Common props
  className?: string;
  
  // shadcn/ui specific props
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  
  // Reshaped specific props
  color?: 'neutral' | 'primary' | 'critical' | 'positive' | 'warning';
  size?: 'small' | 'medium' | 'large';
  
  // Dismissible functionality (Reshaped only)
  onDismiss?: () => void;
  dismissAriaLabel?: string;
  
  // Migration control
  useReshaped?: boolean;
  
  // Additional props
  [key: string]: any;
}

/**
 * MigratedBadge provides a gradual migration path from shadcn/ui Badge to Reshaped Badge
 * 
 * Usage:
 * - Set useReshaped={true} to use Reshaped Badge
 * - Set useReshaped={false} or omit to use shadcn Badge
 * - Props are automatically mapped between the two systems
 */
export function MigratedBadge({
  children,
  className,
  variant = 'default',
  color,
  size = 'medium',
  onDismiss,
  dismissAriaLabel,
  useReshaped = false,
  ...props
}: MigratedBadgeProps) {
  
  if (useReshaped) {
    // Map shadcn variant to Reshaped color if color not explicitly provided
    const reshapedColor = color || mapVariantToColor(variant);
    
    return (
      <ReshapedBadge
        color={reshapedColor}
        size={size}
        onDismiss={onDismiss}
        dismissAriaLabel={dismissAriaLabel}
        className={cn(className)}
        {...props}
      >
        {children}
      </ReshapedBadge>
    );
  }

  // Use existing shadcn Badge
  return (
    <ShadcnBadge
      variant={variant}
      className={cn(className)}
      {...props}
    >
      {children}
    </ShadcnBadge>
  );
}

/**
 * Maps shadcn/ui badge variants to Reshaped colors
 */
function mapVariantToColor(variant: string): 'neutral' | 'primary' | 'critical' | 'positive' | 'warning' {
  switch (variant) {
    case 'destructive':
      return 'critical';
    case 'secondary':
      return 'neutral';
    case 'outline':
      return 'neutral';
    default:
      return 'primary';
  }
}

// Export both for convenience
export { MigratedBadge as Badge };
