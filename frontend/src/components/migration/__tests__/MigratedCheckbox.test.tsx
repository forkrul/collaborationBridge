import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MigratedCheckbox, MigratedCheckboxGroup } from '../MigratedCheckbox';
import { CoexistenceProvider } from '../CoexistenceProvider';

// Mock Reshaped components
jest.mock('reshaped', () => ({
  Checkbox: ({ children, onChange, ...props }: any) => (
    <div data-testid="reshaped-checkbox">
      <input 
        type="checkbox"
        onChange={(e) => onChange?.({ 
          name: props.name, 
          value: props.value, 
          checked: e.target.checked,
          event: e 
        })}
        {...props}
      />
      <label>{children}</label>
    </div>
  ),
  CheckboxGroup: ({ children, ...props }: any) => (
    <div data-testid="reshaped-checkbox-group" {...props}>
      {children}
    </div>
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

describe('MigratedCheckbox', () => {
  describe('shadcn/ui mode (default)', () => {
    it('renders shadcn checkbox by default', () => {
      renderWithProvider(
        <MigratedCheckbox name="test" value="test-value">Test Label</MigratedCheckbox>
      );
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('Test Label')).toBeInTheDocument();
      expect(screen.queryByTestId('reshaped-checkbox')).not.toBeInTheDocument();
    });

    it('handles onChange events correctly', () => {
      const handleChange = jest.fn();
      renderWithProvider(
        <MigratedCheckbox 
          name="test" 
          value="test-value"
          onChange={handleChange}
        >
          Test Label
        </MigratedCheckbox>
      );
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(handleChange).toHaveBeenCalledWith({
        name: 'test',
        value: 'test-value',
        checked: true,
        event: expect.any(Event),
      });
    });

    it('renders with label prop', () => {
      renderWithProvider(
        <MigratedCheckbox 
          name="test"
          value="test-value"
          label="Test Label"
        />
      );
      
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('shows error state correctly', () => {
      renderWithProvider(
        <MigratedCheckbox 
          name="test"
          value="test-value"
          hasError
          label="Test Label"
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('border-destructive');
    });

    it('renders with description', () => {
      renderWithProvider(
        <MigratedCheckbox 
          name="test"
          value="test-value"
          label="Test Label"
          description="This is a description"
        />
      );
      
      expect(screen.getByText('This is a description')).toBeInTheDocument();
    });
  });

  describe('Reshaped mode', () => {
    it('renders Reshaped Checkbox when useReshaped is true', () => {
      renderWithProvider(
        <MigratedCheckbox 
          useReshaped
          name="test" 
          value="test-value"
        >
          Test Label
        </MigratedCheckbox>
      );
      
      expect(screen.getByTestId('reshaped-checkbox')).toBeInTheDocument();
    });

    it('handles onChange events in Reshaped mode', () => {
      const handleChange = jest.fn();
      renderWithProvider(
        <MigratedCheckbox 
          useReshaped
          name="test" 
          value="test-value"
          onChange={handleChange}
        >
          Test Label
        </MigratedCheckbox>
      );
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.change(checkbox, { target: { checked: true } });
      
      expect(handleChange).toHaveBeenCalledWith({
        name: 'test',
        value: 'test-value',
        checked: true,
        event: expect.any(Object),
      });
    });

    it('renders with description in Reshaped mode', () => {
      renderWithProvider(
        <MigratedCheckbox 
          useReshaped
          name="test"
          value="test-value"
          label="Test Label"
          description="This is a description"
        />
      );
      
      expect(screen.getByText('This is a description')).toBeInTheDocument();
    });
  });

  describe('prop mapping', () => {
    it('maps disabled prop correctly', () => {
      renderWithProvider(
        <MigratedCheckbox 
          name="test"
          value="test-value"
          disabled
          label="Disabled Checkbox"
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('maps checked prop correctly', () => {
      renderWithProvider(
        <MigratedCheckbox 
          name="test"
          value="test-value"
          checked
          label="Checked Checkbox"
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('maps defaultChecked prop correctly', () => {
      renderWithProvider(
        <MigratedCheckbox 
          name="test"
          value="test-value"
          defaultChecked
          label="Default Checked"
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });
});

describe('MigratedCheckboxGroup', () => {
  it('renders children in shadcn mode', () => {
    renderWithProvider(
      <MigratedCheckboxGroup name="test-group">
        <MigratedCheckbox name="item1" value="1">Item 1</MigratedCheckbox>
        <MigratedCheckbox name="item2" value="2">Item 2</MigratedCheckbox>
      </MigratedCheckboxGroup>
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders Reshaped CheckboxGroup when useReshaped is true', () => {
    renderWithProvider(
      <MigratedCheckboxGroup useReshaped name="test-group">
        <MigratedCheckbox useReshaped name="item1" value="1">Item 1</MigratedCheckbox>
      </MigratedCheckboxGroup>
    );
    
    expect(screen.getByTestId('reshaped-checkbox-group')).toBeInTheDocument();
  });
});
