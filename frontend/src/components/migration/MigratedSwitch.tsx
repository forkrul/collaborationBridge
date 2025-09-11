'use client';

import React from 'react';
import { Switch as ReshapedSwitch, FormControl } from 'reshaped';
import { Label as ShadcnLabel } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MigratedSwitchProps {
  children?: React.ReactNode;
  
  // Common props
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  
  // Event handlers
  onChange?: (args: { name?: string; value: boolean; event?: Event }) => void;
  
  // Validation
  hasError?: boolean;
  required?: boolean;
  
  // Reshaped specific props
  size?: 'small' | 'medium' | 'large';
  
  // Form integration props
  label?: string;
  description?: string;
  
  // Migration control
  useReshaped?: boolean;
  
  // Additional props
  [key: string]: any;
}

/**
 * MigratedSwitch provides a Reshaped Switch component with fallback to custom implementation
 * 
 * Note: shadcn/ui doesn't have a native Switch component, so this primarily showcases
 * Reshaped Switch with a basic fallback implementation.
 * 
 * Usage:
 * - Set useReshaped={true} to use Reshaped Switch (recommended)
 * - Set useReshaped={false} for a basic checkbox-based fallback
 */
export function MigratedSwitch({
  children,
  name,
  checked,
  defaultChecked,
  disabled = false,
  className,
  id,
  onChange,
  hasError = false,
  required = false,
  size = 'medium',
  label,
  description,
  useReshaped = true, // Default to true since shadcn doesn't have Switch
  ...props
}: MigratedSwitchProps) {
  
  if (useReshaped) {
    const switchElement = (
      <ReshapedSwitch
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        size={size}
        inputAttributes={{
          id,
          required,
          className: cn(className),
          ...props,
        }}
      >
        {children || label}
      </ReshapedSwitch>
    );

    // If we have description, wrap with additional content
    if (description) {
      return (
        <div className="space-y-2">
          {switchElement}
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      );
    }

    return switchElement;
  }

  // Fallback implementation using checkbox styled as switch
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);
  const isControlled = checked !== undefined;
  const switchChecked = isControlled ? checked : internalChecked;

  const handleChange = () => {
    const newValue = !switchChecked;
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    onChange?.({ 
      name, 
      value: newValue,
      event: new Event('change') 
    });
  };

  const switchElement = (
    <button
      type="button"
      role="switch"
      aria-checked={switchChecked}
      disabled={disabled}
      onClick={handleChange}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        switchChecked ? "bg-primary" : "bg-input",
        hasError && "border-destructive",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          switchChecked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );

  // If we have a label or children, wrap with Label
  if (children || label) {
    return (
      <div className="flex items-center space-x-2">
        {switchElement}
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

  return switchElement;
}

// Export both for convenience
export { MigratedSwitch as Switch };
