'use client';

import React from 'react';
import { TextArea as ReshapedTextArea, FormControl } from 'reshaped';
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';
import { Label as ShadcnLabel } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MigratedTextareaProps {
  // Common props
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  
  // Event handlers
  onChange?: (args: { name?: string; value: string; event: React.ChangeEvent<HTMLTextAreaElement> }) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  
  // Validation
  hasError?: boolean;
  required?: boolean;
  
  // Textarea specific props
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  
  // Reshaped specific props
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  
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
 * MigratedTextarea provides a gradual migration path from shadcn/ui Textarea to Reshaped TextArea
 * 
 * Usage:
 * - Set useReshaped={true} to use Reshaped TextArea
 * - Set useReshaped={false} or omit to use shadcn Textarea
 * - Props are automatically mapped between the two systems
 */
export function MigratedTextarea({
  name,
  value,
  defaultValue,
  placeholder,
  disabled = false,
  className,
  id,
  onChange,
  onBlur,
  onFocus,
  hasError = false,
  required = false,
  rows = 3,
  cols,
  maxLength,
  minLength,
  size = 'medium',
  label,
  helperText,
  errorMessage,
  useReshaped = false,
  ...props
}: MigratedTextareaProps) {
  
  if (useReshaped) {
    const textarea = (
      <ReshapedTextArea
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
        attributes={{
          id,
          required,
          rows,
          cols,
          maxLength,
          minLength,
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
          {textarea}
          {helperText && !hasError && (
            <FormControl.Helper>{helperText}</FormControl.Helper>
          )}
          {errorMessage && hasError && (
            <FormControl.Error>{errorMessage}</FormControl.Error>
          )}
        </FormControl>
      );
    }

    return textarea;
  }

  // Use existing shadcn Textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.({ name, value: e.target.value, event: e });
  };

  const textarea = (
    <ShadcnTextarea
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      onChange={handleChange}
      onBlur={onBlur}
      onFocus={onFocus}
      required={required}
      rows={rows}
      cols={cols}
      maxLength={maxLength}
      minLength={minLength}
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
          <ShadcnLabel 
            htmlFor={id} 
            className={cn(
              required && "after:content-['*'] after:ml-0.5 after:text-destructive",
              hasError && "text-destructive"
            )}
          >
            {label}
          </ShadcnLabel>
        )}
        {textarea}
        {helperText && !hasError && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
        {errorMessage && hasError && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }

  return textarea;
}

// Export both for convenience
export { MigratedTextarea as Textarea };
