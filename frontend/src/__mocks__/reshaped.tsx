import React from 'react';

// Mock Reshaped components for testing
export const Reshaped = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="reshaped-provider">{children}</div>
);

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: string;
    variant?: string;
    size?: string;
    loading?: boolean;
    attributes?: any;
  }
>(({ children, attributes, ...props }, ref) => (
  <button ref={ref} {...props} {...attributes}>
    {children}
  </button>
));

Button.displayName = 'Button';

export const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    padding?: string;
    borderRadius?: string;
    backgroundColor?: string;
  }
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

Container.displayName = 'Container';
