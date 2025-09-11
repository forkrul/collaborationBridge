'use client';

import React from 'react';
import { Select as ReshapedSelect, FormControl } from 'reshaped';
import { 
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label as ShadcnLabel } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface MigratedSelectProps {
  // Common props
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  
  // Options
  options?: SelectOption[];
  children?: React.ReactNode; // For shadcn SelectItem children
  
  // Event handlers
  onChange?: (args: { name?: string; value: string; event?: Event }) => void;
  onValueChange?: (value: string) => void; // shadcn compatibility
  
  // Validation
  hasError?: boolean;
  required?: boolean;
  
  // Reshaped specific props
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'solid' | 'faded' | 'headless';
  icon?: React.ComponentType<any>;
  startSlot?: React.ReactNode;
  
  // Form integration props
  label?: string;
  helperText?: string;
  errorMessage?: string;
  
  // Migration control
  useReshaped?: boolean;
  
  // Additional props
  [key: string]: any;
}

/**
 * MigratedSelect provides a gradual migration path from shadcn/ui Select to Reshaped Select
 * 
 * Usage:
 * - Set useReshaped={true} to use Reshaped Select
 * - Set useReshaped={false} or omit to use shadcn Select
 * - Props are automatically mapped between the two systems
 */
export function MigratedSelect({
  name,
  value,
  defaultValue,
  placeholder,
  disabled = false,
  className,
  options = [],
  children,
  onChange,
  onValueChange,
  hasError = false,
  required = false,
  size = 'medium',
  variant = 'solid',
  icon,
  startSlot,
  label,
  helperText,
  errorMessage,
  useReshaped = false,
  ...props
}: MigratedSelectProps) {
  
  if (useReshaped) {
    const select = (
      <ReshapedSelect
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(args) => {
          onChange?.(args);
          onValueChange?.(args.value);
        }}
        hasError={hasError}
        size={size}
        variant={variant}
        icon={icon}
        startSlot={startSlot}
        options={options}
        inputAttributes={{
          required,
          className: cn(className),
          ...props,
        }}
      />
    );

    // If we have form-related props, wrap with FormControl
    if (label || helperText || errorMessage) {
      return (
        <FormControl invalid={hasError}>
          {label && <FormControl.Label>{label}</FormControl.Label>}
          {select}
          {helperText && !hasError && (
            <FormControl.Message>{helperText}</FormControl.Message>
          )}
          {errorMessage && hasError && (
            <FormControl.Error>{errorMessage}</FormControl.Error>
          )}
        </FormControl>
      );
    }

    return select;
  }

  // Use existing shadcn Select
  const handleValueChange = (newValue: string) => {
    onChange?.({ name, value: newValue });
    onValueChange?.(newValue);
  };

  const select = (
    <ShadcnSelect
      name={name}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      required={required}
      onValueChange={handleValueChange}
      {...props}
    >
      <SelectTrigger 
        className={cn(
          hasError && 'border-destructive focus:ring-destructive',
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* Use options if provided, otherwise use children */}
        {options.length > 0 
          ? options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))
          : children
        }
      </SelectContent>
    </ShadcnSelect>
  );

  // If we have form-related props, wrap with Label and helper text
  if (label || helperText || errorMessage) {
    return (
      <div className="space-y-2">
        {label && (
          <ShadcnLabel htmlFor={name} className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}>
            {label}
          </ShadcnLabel>
        )}
        {select}
        {helperText && !hasError && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
        {errorMessage && hasError && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }

  return select;
}

// Export both for convenience
export { MigratedSelect as Select };
