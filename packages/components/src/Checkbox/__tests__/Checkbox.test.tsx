import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Checkbox } from '../Checkbox'
import { Heart } from 'lucide-react'

expect.extend(toHaveNoViolations)

describe('Checkbox', () => {
  it('renders correctly', () => {
    render(<Checkbox label="Test checkbox" />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.getByText('Test checkbox')).toBeInTheDocument()
  })

  it('handles checked state changes', () => {
    const handleChange = jest.fn()
    render(<Checkbox label="Test" onCheckedChange={handleChange} />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('applies custom className', () => {
    render(<Checkbox className="custom-class" label="Test" />)
    expect(screen.getByRole('checkbox')).toHaveClass('custom-class')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Checkbox variant="default" label="Default" />)
    expect(screen.getByRole('checkbox')).toHaveClass('border-primary')

    rerender(<Checkbox variant="success" label="Success" />)
    expect(screen.getByRole('checkbox')).toHaveClass('border-green-500')

    rerender(<Checkbox variant="error" label="Error" />)
    expect(screen.getByRole('checkbox')).toHaveClass('border-destructive')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Checkbox size="sm" label="Small" />)
    expect(screen.getByRole('checkbox')).toHaveClass('h-3', 'w-3')

    rerender(<Checkbox size="lg" label="Large" />)
    expect(screen.getByRole('checkbox')).toHaveClass('h-5', 'w-5')
  })

  it('shows required indicator when required', () => {
    render(<Checkbox label="Required field" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(<Checkbox label="Test" description="This is a description" />)
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<Checkbox label="Test" error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows helper text when no error', () => {
    render(<Checkbox label="Test" helperText="Helper text" />)
    expect(screen.getByText('Helper text')).toBeInTheDocument()
  })

  it('hides helper text when error is present', () => {
    render(<Checkbox label="Test" helperText="Helper text" error="Error message" />)
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Checkbox label="Disabled" disabled />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('applies error variant when error is present', () => {
    render(<Checkbox label="Test" error="Error" />)
    expect(screen.getByRole('checkbox')).toHaveClass('border-destructive')
  })

  it('handles indeterminate state', () => {
    render(<Checkbox label="Indeterminate" indeterminate />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveProperty('indeterminate', true)
  })

  it('renders custom checked icon', () => {
    render(
      <Checkbox 
        label="Custom icon" 
        checkedIcon={<Heart data-testid="custom-icon" />}
        defaultChecked
      />
    )
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('renders custom indeterminate icon', () => {
    render(
      <Checkbox 
        label="Custom indeterminate" 
        indeterminateIcon={<Heart data-testid="indeterminate-icon" />}
        indeterminate
      />
    )
    expect(screen.getByTestId('indeterminate-icon')).toBeInTheDocument()
  })

  it('associates label with checkbox using htmlFor and id', () => {
    render(<Checkbox id="test-checkbox" label="Test label" />)
    const label = screen.getByText('Test label')
    const checkbox = screen.getByRole('checkbox')
    
    expect(label).toHaveAttribute('for', 'test-checkbox')
    expect(checkbox).toHaveAttribute('id', 'test-checkbox')
  })

  it('generates unique id when not provided', () => {
    render(<Checkbox label="Test" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('id')
    expect(checkbox.id).toMatch(/^checkbox-/)
  })

  it('sets aria-invalid when error is present', () => {
    render(<Checkbox label="Test" error="Error message" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('sets aria-describedby correctly', () => {
    render(
      <Checkbox 
        id="test"
        label="Test" 
        description="Description"
        helperText="Helper"
        error="Error"
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    const describedBy = checkbox.getAttribute('aria-describedby')
    
    expect(describedBy).toContain('test-error')
    expect(describedBy).toContain('test-description')
    // Helper text should not be included when error is present
    expect(describedBy).not.toContain('test-helper')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Checkbox ref={ref} label="Test" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('renders with data-testid', () => {
    render(<Checkbox data-testid="test-checkbox" label="Test" />)
    expect(screen.getByTestId('test-checkbox')).toBeInTheDocument()
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<Checkbox label="Accessible checkbox" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations with error', async () => {
    const { container } = render(
      <Checkbox label="Checkbox with error" error="This field is required" />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations when disabled', async () => {
    const { container } = render(<Checkbox label="Disabled checkbox" disabled />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
