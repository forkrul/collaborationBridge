'use client';

import React from 'react';
import { Button as ReshapedButton } from 'reshaped';
import { Button as ShadcnButton } from '@/components/ui/button';
import { themeUtils } from '@/lib/reshaped-theme';
import { cn } from '@/lib/utils';

interface MigratedButtonProps {
  children: React.ReactNode;
  
  // Common props
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  
  // shadcn/ui specific props
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  
  // Migration control
  useReshaped?: boolean;
  
  // Additional props
  [key: string]: any;
}

/**
 * MigratedButton provides a gradual migration path from shadcn/ui to Reshaped UI
 * 
 * Usage:
 * - Set useReshaped={true} to use Reshaped Button
 * - Set useReshaped={false} or omit to use shadcn Button
 * - Props are automatically mapped between the two systems
 */
export function MigratedButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  className,
  type = 'button',
  variant = 'default',
  size = 'default',
  useReshaped = false,
  ...props
}: MigratedButtonProps) {
  
  if (useReshaped) {
    // Map shadcn props to Reshaped props
    const { color, variant: reshapedVariant } = themeUtils.mapButtonVariant(variant);
    const reshapedSize = themeUtils.mapSize(size);
    
    return (
      <ReshapedButton
        color={color as any}
        variant={reshapedVariant as any}
        size={reshapedSize as any}
        disabled={disabled}
        loading={loading}
        onClick={onClick}
        attributes={{
          type,
          className: cn(className),
          ...props,
        }}
      >
        {children}
      </ReshapedButton>
    );
  }

  // Use existing shadcn Button
  return (
    <ShadcnButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(className)}
      type={type}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </ShadcnButton>
  );
}

// Export both for convenience
export { MigratedButton as Button };
