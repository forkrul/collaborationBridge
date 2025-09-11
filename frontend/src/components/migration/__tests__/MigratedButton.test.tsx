import React from 'react';
import { render, screen } from '@testing-library/react';
import { MigratedButton } from '../MigratedButton';
import { CoexistenceProvider } from '../CoexistenceProvider';
import { ThemeProvider } from '@/components/ui/theme-provider';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <CoexistenceProvider>
      {children}
    </CoexistenceProvider>
  </ThemeProvider>
);

describe('MigratedButton', () => {
  it('renders with shadcn/ui by default', () => {
    render(
      <TestWrapper>
        <MigratedButton>Test Button</MigratedButton>
      </TestWrapper>
    );
    
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
  });

  it('renders with Reshaped UI when useReshaped is true', () => {
    render(
      <TestWrapper>
        <MigratedButton useReshaped>Test Button</MigratedButton>
      </TestWrapper>
    );
    
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    
    render(
      <TestWrapper>
        <MigratedButton onClick={handleClick}>Test Button</MigratedButton>
      </TestWrapper>
    );
    
    const button = screen.getByRole('button', { name: 'Test Button' });
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles disabled state', () => {
    render(
      <TestWrapper>
        <MigratedButton disabled>Test Button</MigratedButton>
      </TestWrapper>
    );
    
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeDisabled();
  });

  it('handles loading state', () => {
    render(
      <TestWrapper>
        <MigratedButton loading>Test Button</MigratedButton>
      </TestWrapper>
    );
    
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
  });

  it('maps variants correctly for Reshaped', () => {
    render(
      <TestWrapper>
        <MigratedButton useReshaped variant="destructive">
          Destructive Button
        </MigratedButton>
      </TestWrapper>
    );
    
    const button = screen.getByRole('button', { name: 'Destructive Button' });
    expect(button).toBeInTheDocument();
  });
});
