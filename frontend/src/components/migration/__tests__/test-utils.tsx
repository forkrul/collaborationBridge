import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Simple test wrapper that doesn't use the problematic theme provider
const SimpleTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div data-testid="test-wrapper">{children}</div>;
};

// Custom render function that uses our simple wrapper
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: SimpleTestWrapper, ...options });

export * from '@testing-library/react';
export { customRender as render };
