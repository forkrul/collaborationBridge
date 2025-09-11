'use client';

import React from 'react';
import { DropdownMenu as ReshapedDropdownMenu } from 'reshaped';
import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface MigratedDropdownMenuProps {
  children: React.ReactNode;
  className?: string;
  
  // Reshaped specific props
  position?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';
  width?: 'trigger' | number | string;
  onClose?: () => void;
  fallbackPositions?: string[];
  
  // Migration control
  useReshaped?: boolean;
  
  // Additional props
  [key: string]: any;
}

/**
 * MigratedDropdownMenu provides a gradual migration path from shadcn/ui DropdownMenu to Reshaped DropdownMenu
 * 
 * Usage:
 * - Set useReshaped={true} to use Reshaped DropdownMenu
 * - Set useReshaped={false} or omit to use shadcn DropdownMenu
 * - Props are automatically mapped between the two systems
 */
export function MigratedDropdownMenu({
  children,
  className,
  position,
  width,
  onClose,
  fallbackPositions,
  useReshaped = false,
  ...props
}: MigratedDropdownMenuProps) {
  
  if (useReshaped) {
    return (
      <ReshapedDropdownMenu
        position={position}
        width={width}
        onClose={onClose}
        fallbackPositions={fallbackPositions}
        className={cn(className)}
        {...props}
      >
        {children}
      </ReshapedDropdownMenu>
    );
  }

  // Use existing shadcn DropdownMenu
  return (
    <ShadcnDropdownMenu {...props}>
      {children}
    </ShadcnDropdownMenu>
  );
}

// DropdownMenu Trigger Component
interface MigratedDropdownMenuTriggerProps {
  children: React.ReactNode | ((attributes: any) => React.ReactNode);
  className?: string;
  useReshaped?: boolean;
  [key: string]: any;
}

export function MigratedDropdownMenuTrigger({
  children,
  className,
  useReshaped = false,
  ...props
}: MigratedDropdownMenuTriggerProps) {
  
  if (useReshaped) {
    return (
      <ReshapedDropdownMenu.Trigger className={cn(className)} {...props}>
        {children}
      </ReshapedDropdownMenu.Trigger>
    );
  }

  // Use existing shadcn DropdownMenuTrigger
  // Note: shadcn doesn't use render props pattern, so we handle both cases
  return (
    <DropdownMenuTrigger className={cn(className)} {...props}>
      {typeof children === 'function' ? children({}) : children}
    </DropdownMenuTrigger>
  );
}

// DropdownMenu Content Component
interface MigratedDropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  sideOffset?: number;
  useReshaped?: boolean;
  [key: string]: any;
}

export function MigratedDropdownMenuContent({
  children,
  className,
  sideOffset = 4,
  useReshaped = false,
  ...props
}: MigratedDropdownMenuContentProps) {
  
  if (useReshaped) {
    return (
      <ReshapedDropdownMenu.Content className={cn(className)} {...props}>
        {children}
      </ReshapedDropdownMenu.Content>
    );
  }

  // Use existing shadcn DropdownMenuContent
  return (
    <DropdownMenuContent 
      sideOffset={sideOffset}
      className={cn(className)} 
      {...props}
    >
      {children}
    </DropdownMenuContent>
  );
}

// DropdownMenu Item Component
interface MigratedDropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
  onClick?: () => void;
  useReshaped?: boolean;
  [key: string]: any;
}

export function MigratedDropdownMenuItem({
  children,
  className,
  inset,
  onClick,
  useReshaped = false,
  ...props
}: MigratedDropdownMenuItemProps) {
  
  if (useReshaped) {
    return (
      <ReshapedDropdownMenu.Item 
        onClick={onClick}
        className={cn(className)} 
        {...props}
      >
        {children}
      </ReshapedDropdownMenu.Item>
    );
  }

  // Use existing shadcn DropdownMenuItem
  return (
    <DropdownMenuItem 
      inset={inset}
      onClick={onClick}
      className={cn(className)} 
      {...props}
    >
      {children}
    </DropdownMenuItem>
  );
}

// DropdownMenu Section Component (Reshaped only)
interface MigratedDropdownMenuSectionProps {
  children: React.ReactNode;
  className?: string;
  useReshaped?: boolean;
  [key: string]: any;
}

export function MigratedDropdownMenuSection({
  children,
  className,
  useReshaped = false,
  ...props
}: MigratedDropdownMenuSectionProps) {
  
  if (useReshaped) {
    return (
      <ReshapedDropdownMenu.Section className={cn(className)} {...props}>
        {children}
      </ReshapedDropdownMenu.Section>
    );
  }

  // For shadcn, we use DropdownMenuGroup as the closest equivalent
  return (
    <DropdownMenuGroup className={cn(className)} {...props}>
      {children}
    </DropdownMenuGroup>
  );
}

// DropdownMenu SubMenu Component
interface MigratedDropdownMenuSubMenuProps {
  children: React.ReactNode;
  className?: string;
  useReshaped?: boolean;
  [key: string]: any;
}

export function MigratedDropdownMenuSubMenu({
  children,
  className,
  useReshaped = false,
  ...props
}: MigratedDropdownMenuSubMenuProps) {
  
  if (useReshaped) {
    return (
      <ReshapedDropdownMenu.SubMenu className={cn(className)} {...props}>
        {children}
      </ReshapedDropdownMenu.SubMenu>
    );
  }

  // Use existing shadcn DropdownMenuSub
  return (
    <DropdownMenuSub {...props}>
      {children}
    </DropdownMenuSub>
  );
}

// DropdownMenu SubTrigger Component
interface MigratedDropdownMenuSubTriggerProps {
  children: React.ReactNode;
  className?: string;
  useReshaped?: boolean;
  [key: string]: any;
}

export function MigratedDropdownMenuSubTrigger({
  children,
  className,
  useReshaped = false,
  ...props
}: MigratedDropdownMenuSubTriggerProps) {
  
  if (useReshaped) {
    return (
      <ReshapedDropdownMenu.SubTrigger className={cn(className)} {...props}>
        {children}
      </ReshapedDropdownMenu.SubTrigger>
    );
  }

  // Use existing shadcn DropdownMenuSubTrigger
  return (
    <DropdownMenuSubTrigger className={cn(className)} {...props}>
      {children}
    </DropdownMenuSubTrigger>
  );
}

// Export compound components
export { 
  MigratedDropdownMenu as DropdownMenu,
  MigratedDropdownMenuTrigger as DropdownMenuTrigger,
  MigratedDropdownMenuContent as DropdownMenuContent,
  MigratedDropdownMenuItem as DropdownMenuItem,
  MigratedDropdownMenuSection as DropdownMenuSection,
  MigratedDropdownMenuSubMenu as DropdownMenuSubMenu,
  MigratedDropdownMenuSubTrigger as DropdownMenuSubTrigger,
  // Re-export shadcn components that don't need migration
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSubContent,
};
