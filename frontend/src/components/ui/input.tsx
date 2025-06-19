import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'error' | 'success';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      id,
      required,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [internalId] = React.useState(() => id || `input-${Math.random().toString(36).substr(2, 9)}`);
    
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    
    const hasError = Boolean(error) || variant === 'error';
    const hasSuccess = variant === 'success';
    
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={internalId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-4 w-4 text-muted-foreground">
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            type={inputType}
            id={internalId}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              hasError && 'border-destructive focus-visible:ring-destructive',
              hasSuccess && 'border-green-500 focus-visible:ring-green-500',
              leftIcon && 'pl-10',
              (rightIcon || isPassword || hasError) && 'pr-10',
              className
            )}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${internalId}-error` : 
              helperText ? `${internalId}-helper` : 
              undefined
            }
            {...props}
          />
          
          {hasError && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          )}
          
          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              )}
            </button>
          )}
          
          {rightIcon && !hasError && !isPassword && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="h-4 w-4 text-muted-foreground">
                {rightIcon}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p
            id={`${internalId}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p
            id={`${internalId}-helper`}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
