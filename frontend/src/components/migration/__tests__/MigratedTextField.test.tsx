import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MigratedTextField } from '../MigratedTextField';
import { CoexistenceProvider } from '../CoexistenceProvider';

// Mock Reshaped components
jest.mock('reshaped', () => ({
  TextField: ({ children, onChange, ...props }: any) => (
    <input 
      data-testid="reshaped-textfield"
      onChange={(e) => onChange?.({ name: props.name, value: e.target.value, event: e })}
      {...props}
    />
  ),
  FormControl: ({ children, ...props }: any) => (
    <div data-testid="reshaped-form-control" {...props}>{children}</div>
  ),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <CoexistenceProvider>
      {component}
    </CoexistenceProvider>
  );
};

describe('MigratedTextField', () => {
  describe('shadcn/ui mode (default)', () => {
    it('renders shadcn input by default', () => {
      renderWithProvider(
        <MigratedTextField name="test" placeholder="Test input" />
      );
      
      const input = screen.getByPlaceholderText('Test input');
      expect(input).toBeInTheDocument();
      expect(screen.queryByTestId('reshaped-textfield')).not.toBeInTheDocument();
    });

    it('handles onChange events correctly', () => {
      const handleChange = jest.fn();
      renderWithProvider(
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
      renderWithProvider(
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
      renderWithProvider(
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
      renderWithProvider(
        <MigratedTextField 
          useReshaped
          name="test" 
          placeholder="Test input" 
        />
      );
      
      expect(screen.getByTestId('reshaped-textfield')).toBeInTheDocument();
    });

    it('wraps with FormControl when form props are provided', () => {
      renderWithProvider(
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
      renderWithProvider(
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
      renderWithProvider(
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
      renderWithProvider(
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
      renderWithProvider(
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
