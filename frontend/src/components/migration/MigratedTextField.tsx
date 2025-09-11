'use client';

import React from 'react';
import { TextField as ReshapedTextField, FormControl } from 'reshaped';
import { Input as ShadcnInput } from '@/components/ui/input';
import { Label as ShadcnLabel } from '@/components/ui/label';
import { themeUtils } from '@/lib/reshaped-theme';
import { cn } from '@/lib/utils';

interface MigratedTextFieldProps {
  // Common props
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  
  // Event handlers
  onChange?: (args: { name?: string; value: string; event: React.ChangeEvent<HTMLInputElement> }) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  
  // Validation
  hasError?: boolean;
  required?: boolean;
  
  // shadcn/ui specific props
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  
  // Reshaped specific props
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  icon?: React.ComponentType<any>;
  endIcon?: React.ComponentType<any>;
  startSlot?: React.ReactNode;
  endSlot?: React.ReactNode;
  multiline?: boolean;
  
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
 * MigratedTextField provides a gradual migration path from shadcn/ui Input to Reshaped TextField
 * 
 * Usage:
 * - Set useReshaped={true} to use Reshaped TextField
 * - Set useReshaped={false} or omit to use shadcn Input
 * - Props are automatically mapped between the two systems
 */
export function MigratedTextField({
  name,
  value,
  defaultValue,
  placeholder,
  disabled = false,
  className,
  onChange,
  onBlur,
  onFocus,
  hasError = false,
  required = false,
  type = 'text',
  size = 'medium',
  icon,
  endIcon,
  startSlot,
  endSlot,
  multiline = false,
  label,
  helperText,
  errorMessage,
  useReshaped = false,
  ...props
}: MigratedTextFieldProps) {
  
  if (useReshaped) {
    const textField = (
      <ReshapedTextField
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        hasError={hasError}
        size={size}
        icon={icon}
        endIcon={endIcon}
        startSlot={startSlot}
        endSlot={endSlot}
        multiline={multiline}
        inputAttributes={{
          type,
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
          {textField}
          {helperText && !hasError && (
            <FormControl.Message>{helperText}</FormControl.Message>
          )}
          {errorMessage && hasError && (
            <FormControl.Error>{errorMessage}</FormControl.Error>
          )}
        </FormControl>
      );
    }

    return textField;
  }

  // Use existing shadcn Input with optional Label
  const input = (
    <ShadcnInput
      name={name}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange?.({ name, value: e.target.value, event: e })}
      onBlur={onBlur}
      onFocus={onFocus}
      type={type}
      required={required}
      className={cn(
        hasError && 'border-destructive focus-visible:ring-destructive',
        className
      )}
      {...props}
    />
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
        {input}
        {helperText && !hasError && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
        {errorMessage && hasError && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }

  return input;
}

// Export both for convenience
export { MigratedTextField as TextField };
