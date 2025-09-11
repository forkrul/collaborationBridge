'use client';

import React from 'react';
import { Checkbox as ReshapedCheckbox, CheckboxGroup as ReshapedCheckboxGroup, FormControl } from 'reshaped';
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';
import { Label as ShadcnLabel } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MigratedCheckboxProps {
  children?: React.ReactNode;
  
  // Common props
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  
  // Event handlers
  onChange?: (args: { name?: string; value?: string; checked: boolean; event?: Event }) => void;
  
  // Validation
  hasError?: boolean;
  required?: boolean;
  
  // Reshaped specific props
  size?: 'small' | 'medium' | 'large';
  indeterminate?: boolean;
  
  // Form integration props
  label?: string;
  description?: string;
  
  // Migration control
  useReshaped?: boolean;
  
  // Additional props
  [key: string]: any;
}

/**
 * MigratedCheckbox provides a gradual migration path from shadcn/ui Checkbox to Reshaped Checkbox
 * 
 * Usage:
 * - Set useReshaped={true} to use Reshaped Checkbox
 * - Set useReshaped={false} or omit to use shadcn Checkbox
 * - Props are automatically mapped between the two systems
 */
export function MigratedCheckbox({
  children,
  name,
  value,
  checked,
  defaultChecked,
  disabled = false,
  className,
  id,
  onChange,
  hasError = false,
  required = false,
  size = 'medium',
  indeterminate = false,
  label,
  description,
  useReshaped = false,
  ...props
}: MigratedCheckboxProps) {
  
  if (useReshaped) {
    const checkbox = (
      <ReshapedCheckbox
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        hasError={hasError}
        size={size}
        indeterminate={indeterminate}
        inputAttributes={{
          id,
          required,
          className: cn(className),
          ...props,
        }}
      >
        {children || label}
      </ReshapedCheckbox>
    );

    // If we have description, wrap with additional content
    if (description) {
      return (
        <div className="space-y-2">
          {checkbox}
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      );
    }

    return checkbox;
  }

  // Use existing shadcn Checkbox
  const handleCheckedChange = (checkedValue: boolean) => {
    onChange?.({ 
      name, 
      value, 
      checked: checkedValue,
      event: new Event('change') 
    });
  };

  const checkboxElement = (
    <ShadcnCheckbox
      id={id}
      name={name}
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      required={required}
      onCheckedChange={handleCheckedChange}
      className={cn(
        hasError && 'border-destructive data-[state=checked]:bg-destructive',
        className
      )}
      {...props}
    />
  );

  // If we have a label or children, wrap with Label
  if (children || label) {
    return (
      <div className="flex items-center space-x-2">
        {checkboxElement}
        <ShadcnLabel 
          htmlFor={id}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            hasError && "text-destructive"
          )}
        >
          {children || label}
          {description && (
            <div className="text-xs text-muted-foreground mt-1">
              {description}
            </div>
          )}
        </ShadcnLabel>
      </div>
    );
  }

  return checkboxElement;
}

// CheckboxGroup component for managing multiple checkboxes
interface MigratedCheckboxGroupProps {
  children: React.ReactNode;
  name?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (args: { name?: string; value: string[] }) => void;
  useReshaped?: boolean;
  [key: string]: any;
}

export function MigratedCheckboxGroup({
  children,
  name,
  value,
  defaultValue,
  onChange,
  useReshaped = false,
  ...props
}: MigratedCheckboxGroupProps) {
  
  if (useReshaped) {
    return (
      <ReshapedCheckboxGroup
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        {...props}
      >
        {children}
      </ReshapedCheckboxGroup>
    );
  }

  // For shadcn, we just render the children as-is
  // Individual checkboxes handle their own state
  return <div {...props}>{children}</div>;
}

// Export both for convenience
export { MigratedCheckbox as Checkbox, MigratedCheckboxGroup as CheckboxGroup };
