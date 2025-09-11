'use client';

import React from 'react';
import { Container } from 'reshaped';
import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MigratedCardProps {
  children: React.ReactNode;
  className?: string;
  
  // Migration control
  useReshaped?: boolean;
  
  // Reshaped specific props
  padding?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  backgroundColor?: 'neutral' | 'elevated' | 'primary' | 'positive' | 'critical' | 'warning';
  
  // Additional props
  [key: string]: any;
}

/**
 * MigratedCard provides a gradual migration path from shadcn/ui Card to Reshaped Container
 */
export function MigratedCard({
  children,
  className,
  useReshaped = false,
  padding = 'medium',
  borderRadius = 'medium',
  backgroundColor = 'elevated',
  ...props
}: MigratedCardProps) {
  
  if (useReshaped) {
    return (
      <Container
        padding={padding}
        borderRadius={borderRadius}
        backgroundColor={backgroundColor}
        className={cn(className)}
        {...props}
      >
        {children}
      </Container>
    );
  }

  // Use existing shadcn Card
  return (
    <ShadcnCard className={cn(className)} {...props}>
      {children}
    </ShadcnCard>
  );
}

// Compound components for shadcn compatibility
MigratedCard.Header = function MigratedCardHeader({ 
  children, 
  className, 
  useReshaped = false,
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  useReshaped?: boolean;
  [key: string]: any;
}) {
  if (useReshaped) {
    return (
      <div className={cn('mb-4', className)} {...props}>
        {children}
      </div>
    );
  }
  
  return (
    <CardHeader className={cn(className)} {...props}>
      {children}
    </CardHeader>
  );
};

MigratedCard.Title = function MigratedCardTitle({ 
  children, 
  className, 
  useReshaped = false,
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  useReshaped?: boolean;
  [key: string]: any;
}) {
  if (useReshaped) {
    return (
      <h3 className={cn('text-lg font-semibold', className)} {...props}>
        {children}
      </h3>
    );
  }
  
  return (
    <CardTitle className={cn(className)} {...props}>
      {children}
    </CardTitle>
  );
};

MigratedCard.Description = function MigratedCardDescription({ 
  children, 
  className, 
  useReshaped = false,
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  useReshaped?: boolean;
  [key: string]: any;
}) {
  if (useReshaped) {
    return (
      <p className={cn('text-sm text-muted-foreground', className)} {...props}>
        {children}
      </p>
    );
  }
  
  return (
    <CardDescription className={cn(className)} {...props}>
      {children}
    </CardDescription>
  );
};

MigratedCard.Content = function MigratedCardContent({ 
  children, 
  className, 
  useReshaped = false,
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  useReshaped?: boolean;
  [key: string]: any;
}) {
  if (useReshaped) {
    return (
      <div className={cn(className)} {...props}>
        {children}
      </div>
    );
  }
  
  return (
    <CardContent className={cn(className)} {...props}>
      {children}
    </CardContent>
  );
};

MigratedCard.Footer = function MigratedCardFooter({ 
  children, 
  className, 
  useReshaped = false,
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  useReshaped?: boolean;
  [key: string]: any;
}) {
  if (useReshaped) {
    return (
      <div className={cn('mt-4', className)} {...props}>
        {children}
      </div>
    );
  }
  
  return (
    <CardFooter className={cn(className)} {...props}>
      {children}
    </CardFooter>
  );
};

// Export with compound components
export { MigratedCard as Card };
