import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MigratedSelect } from '../MigratedSelect';
import { CoexistenceProvider } from '../CoexistenceProvider';

// Mock Reshaped components
jest.mock('reshaped', () => ({
  Select: ({ children, onChange, options, ...props }: any) => (
    <select 
      data-testid="reshaped-select"
      onChange={(e) => onChange?.({ name: props.name, value: e.target.value, event: e })}
      {...props}
    >
      {options?.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
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

const testOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

describe('MigratedSelect', () => {
  describe('shadcn/ui mode (default)', () => {
    it('renders shadcn select by default', () => {
      renderWithProvider(
        <MigratedSelect 
          name="test" 
          placeholder="Select option"
          options={testOptions}
        />
      );
      
      // shadcn Select uses a trigger button
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.queryByTestId('reshaped-select')).not.toBeInTheDocument();
    });

    it('handles onChange events correctly', () => {
      const handleChange = jest.fn();
      renderWithProvider(
        <MigratedSelect 
          name="test" 
          placeholder="Select option"
          options={testOptions}
          onChange={handleChange}
        />
      );
      
      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);
      
      // Find and click an option
      const option = screen.getByText('Option 1');
      fireEvent.click(option);
      
      expect(handleChange).toHaveBeenCalledWith({
        name: 'test',
        value: 'option1',
      });
    });

    it('renders with label and helper text', () => {
      renderWithProvider(
        <MigratedSelect 
          name="test"
          label="Test Label"
          helperText="This is helper text"
          placeholder="Select option"
          options={testOptions}
        />
      );
      
      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    it('shows error state correctly', () => {
      renderWithProvider(
        <MigratedSelect 
          name="test"
          label="Test Label"
          hasError
          errorMessage="This field is required"
          placeholder="Select option"
          options={testOptions}
        />
      );
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  describe('Reshaped mode', () => {
    it('renders Reshaped Select when useReshaped is true', () => {
      renderWithProvider(
        <MigratedSelect 
          useReshaped
          name="test" 
          placeholder="Select option"
          options={testOptions}
        />
      );
      
      expect(screen.getByTestId('reshaped-select')).toBeInTheDocument();
    });

    it('wraps with FormControl when form props are provided', () => {
      renderWithProvider(
        <MigratedSelect 
          useReshaped
          name="test"
          label="Test Label"
          placeholder="Select option"
          options={testOptions}
        />
      );
      
      expect(screen.getByTestId('reshaped-form-control')).toBeInTheDocument();
    });

    it('handles onChange events in Reshaped mode', () => {
      const handleChange = jest.fn();
      renderWithProvider(
        <MigratedSelect 
          useReshaped
          name="test" 
          placeholder="Select option"
          options={testOptions}
          onChange={handleChange}
        />
      );
      
      const select = screen.getByTestId('reshaped-select');
      fireEvent.change(select, { target: { value: 'option2' } });
      
      expect(handleChange).toHaveBeenCalledWith({
        name: 'test',
        value: 'option2',
        event: expect.any(Object),
      });
    });

    it('renders options correctly', () => {
      renderWithProvider(
        <MigratedSelect 
          useReshaped
          name="test" 
          placeholder="Select option"
          options={testOptions}
        />
      );
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
  });

  describe('prop mapping', () => {
    it('maps disabled prop correctly', () => {
      renderWithProvider(
        <MigratedSelect 
          name="test"
          disabled
          placeholder="Disabled select"
          options={testOptions}
        />
      );
      
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
    });

    it('maps required prop correctly', () => {
      renderWithProvider(
        <MigratedSelect 
          name="test"
          required
          label="Required Field"
          placeholder="Required select"
          options={testOptions}
        />
      );
      
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-required', 'true');
    });

    it('handles both onChange and onValueChange', () => {
      const handleChange = jest.fn();
      const handleValueChange = jest.fn();
      
      renderWithProvider(
        <MigratedSelect 
          useReshaped
          name="test"
          placeholder="Select option"
          options={testOptions}
          onChange={handleChange}
          onValueChange={handleValueChange}
        />
      );
      
      const select = screen.getByTestId('reshaped-select');
      fireEvent.change(select, { target: { value: 'option1' } });
      
      expect(handleChange).toHaveBeenCalledWith({
        name: 'test',
        value: 'option1',
        event: expect.any(Object),
      });
      expect(handleValueChange).toHaveBeenCalledWith('option1');
    });
  });
});
