'use client';

import React from 'react';
import { Progress as ReshapedProgress } from 'reshaped';
import { Progress as ShadcnProgress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface MigratedProgressProps {
  // Common props
  value?: number;
  max?: number;
  className?: string;
  
  // Reshaped specific props
  color?: 'primary' | 'critical' | 'warning' | 'positive' | 'media';
  size?: 'small' | 'medium';
  min?: number;
  duration?: number; // Animation duration in ms
  
  // shadcn specific props (for backward compatibility)
  
  // Display props
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number, max: number) => string;
  
  // Migration control
  useReshaped?: boolean;
  
  // Additional props
  [key: string]: any;
}

/**
 * MigratedProgress provides a gradual migration path from shadcn/ui Progress to Reshaped Progress
 * 
 * Usage:
 * - Set useReshaped={true} to use Reshaped Progress
 * - Set useReshaped={false} or omit to use shadcn Progress
 * - Props are automatically mapped between the two systems
 */
export function MigratedProgress({
  value = 0,
  max = 100,
  className,
  color = 'primary',
  size = 'medium',
  min = 0,
  duration,
  label,
  showValue = false,
  formatValue,
  useReshaped = false,
  ...props
}: MigratedProgressProps) {
  
  if (useReshaped) {
    const progress = (
      <ReshapedProgress
        value={value}
        max={max}
        min={min}
        color={color}
        size={size}
        duration={duration}
        className={cn(className)}
        {...props}
      />
    );

    // If we have label or showValue, wrap with additional content
    if (label || showValue) {
      const percentage = Math.round(((value - min) / (max - min)) * 100);
      const displayValue = formatValue 
        ? formatValue(value, max)
        : `${percentage}%`;

      return (
        <div className="space-y-2">
          {(label || showValue) && (
            <div className="flex justify-between items-center">
              {label && (
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
              )}
              {showValue && (
                <span className="text-sm text-muted-foreground">
                  {displayValue}
                </span>
              )}
            </div>
          )}
          {progress}
        </div>
      );
    }

    return progress;
  }

  // Use existing shadcn Progress
  const progress = (
    <ShadcnProgress
      value={value}
      max={max}
      className={cn(className)}
      {...props}
    />
  );

  // If we have label or showValue, wrap with additional content
  if (label || showValue) {
    const percentage = Math.round((value / max) * 100);
    const displayValue = formatValue 
      ? formatValue(value, max)
      : `${percentage}%`;

    return (
      <div className="space-y-2">
        {(label || showValue) && (
          <div className="flex justify-between items-center">
            {label && (
              <span className="text-sm font-medium text-foreground">
                {label}
              </span>
            )}
            {showValue && (
              <span className="text-sm text-muted-foreground">
                {displayValue}
              </span>
            )}
          </div>
        )}
        {progress}
      </div>
    );
  }

  return progress;
}

// Export both for convenience
export { MigratedProgress as Progress };
