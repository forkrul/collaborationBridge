import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { MigratedTextField } from '../MigratedTextField';

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

describe('MigratedTextField', () => {
  describe('shadcn/ui mode (default)', () => {
    it('renders shadcn input by default', () => {
      render(
        <MigratedTextField name="test" placeholder="Test input" />
      );
      
      const input = screen.getByPlaceholderText('Test input');
      expect(input).toBeInTheDocument();
      expect(screen.queryByTestId('reshaped-textfield')).not.toBeInTheDocument();
    });

    it('handles onChange events correctly', () => {
      const handleChange = jest.fn();
      render(
        <MigratedTextField 
          name="test" 
          placeholder="Test input"
          onChange={handleChange}
        />
      );
      
      const input = screen.getByPlaceholderText('Test input');
      fireEvent.change(input, { target: { value: 'test value' } });
      
      expect(handleChange).toHaveBeenCalledWith({
        name: 'test',
        value: 'test value',
        event: expect.any(Object),
      });
    });

    it('renders with label and helper text', () => {
      render(
        <MigratedTextField 
          name="test"
          label="Test Label"
          helperText="This is helper text"
          placeholder="Test input"
        />
      );
      
      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    it('shows error state correctly', () => {
      render(
        <MigratedTextField 
          name="test"
          label="Test Label"
          hasError
          errorMessage="This field is required"
          placeholder="Test input"
        />
      );
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.queryByText('This is helper text')).not.toBeInTheDocument();
    });
  });

  describe('Reshaped mode', () => {
    it('renders Reshaped TextField when useReshaped is true', () => {
      render(
        <MigratedTextField 
          useReshaped
          name="test" 
          placeholder="Test input" 
        />
      );
      
      expect(screen.getByTestId('reshaped-textfield')).toBeInTheDocument();
    });

    it('wraps with FormControl when form props are provided', () => {
      render(
        <MigratedTextField 
          useReshaped
          name="test"
          label="Test Label"
          placeholder="Test input"
        />
      );
      
      expect(screen.getByTestId('reshaped-form-control')).toBeInTheDocument();
    });

    it('handles onChange events in Reshaped mode', () => {
      const handleChange = jest.fn();
      render(
        <MigratedTextField 
          useReshaped
          name="test" 
          placeholder="Test input"
          onChange={handleChange}
        />
      );
      
      const input = screen.getByTestId('reshaped-textfield');
      fireEvent.change(input, { target: { value: 'reshaped value' } });
      
      expect(handleChange).toHaveBeenCalledWith({
        name: 'test',
        value: 'reshaped value',
        event: expect.any(Object),
      });
    });
  });

  describe('prop mapping', () => {
    it('maps type prop correctly', () => {
      render(
        <MigratedTextField 
          name="test"
          type="password"
          placeholder="Password"
        />
      );
      
      const input = screen.getByPlaceholderText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('maps disabled prop correctly', () => {
      render(
        <MigratedTextField 
          name="test"
          disabled
          placeholder="Disabled input"
        />
      );
      
      const input = screen.getByPlaceholderText('Disabled input');
      expect(input).toBeDisabled();
    });

    it('maps required prop correctly', () => {
      render(
        <MigratedTextField 
          name="test"
          required
          label="Required Field"
          placeholder="Required input"
        />
      );
      
      const input = screen.getByPlaceholderText('Required input');
      expect(input).toBeRequired();
    });
  });
});
