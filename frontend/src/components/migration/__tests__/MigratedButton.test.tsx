import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { MigratedButton } from '../MigratedButton';

// Mock the migration theme hook to avoid provider issues
jest.mock('../CoexistenceProvider', () => ({
  CoexistenceProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useMigrationTheme: () => ({
    currentTheme: 'blue',
    appearance: 'light' as const,
    setTheme: jest.fn(),
    setAppearance: jest.fn(),
    availableThemes: ['blue', 'green', 'purple'],
    reshapedTheme: {
      color: 'primary',
      appearance: 'light' as const,
    },
  }),
}));

describe('MigratedButton', () => {
  it('renders with shadcn/ui by default', () => {
    render(<MigratedButton>Test Button</MigratedButton>);

    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
  });

  it('renders with Reshaped UI when useReshaped is true', () => {
    render(<MigratedButton useReshaped>Test Button</MigratedButton>);

    const button = screen.getByTestId('reshaped-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Button');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();

    render(<MigratedButton onClick={handleClick}>Test Button</MigratedButton>);

    const button = screen.getByRole('button', { name: 'Test Button' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles disabled state', () => {
    render(<MigratedButton disabled>Test Button</MigratedButton>);

    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeDisabled();
  });

  it('handles loading state', () => {
    render(<MigratedButton loading>Test Button</MigratedButton>);

    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
  });

  it('maps variants correctly for Reshaped', () => {
    render(
      <MigratedButton useReshaped variant="destructive">
        Destructive Button
      </MigratedButton>
    );

    const button = screen.getByTestId('reshaped-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Destructive Button');
  });
});
