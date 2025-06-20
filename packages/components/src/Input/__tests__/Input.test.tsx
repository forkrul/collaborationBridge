import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Input } from '../Input'
import { Search, Eye } from 'lucide-react'

expect.extend(toHaveNoViolations)

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Test input" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('handles value changes', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Input variant="default" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-input')

    rerender(<Input variant="error" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-destructive')

    rerender(<Input variant="success" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-green-500')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Input size="sm" />)
    expect(screen.getByRole('textbox')).toHaveClass('h-8')

    rerender(<Input size="lg" />)
    expect(screen.getByRole('textbox')).toHaveClass('h-12')
  })

  it('shows required indicator when required', () => {
    render(<Input label="Required field" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders label', () => {
    render(<Input label="Test label" />)
    expect(screen.getByText('Test label')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows helper text when no error', () => {
    render(<Input helperText="Helper text" />)
    expect(screen.getByText('Helper text')).toBeInTheDocument()
  })

  it('hides helper text when error is present', () => {
    render(<Input helperText="Helper text" error="Error message" />)
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('applies error variant when error is present', () => {
    render(<Input error="Error" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-destructive')
  })

  it('renders with left icon', () => {
    render(<Input leftIcon={<Search data-testid="left-icon" />} />)
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('renders with right icon', () => {
    render(<Input rightIcon={<Eye data-testid="right-icon" />} />)
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('associates label with input using htmlFor and id', () => {
    render(<Input id="test-input" label="Test label" />)
    const label = screen.getByText('Test label')
    const input = screen.getByRole('textbox')
    
    expect(label).toHaveAttribute('for', 'test-input')
    expect(input).toHaveAttribute('id', 'test-input')
  })

  it('generates unique id when not provided', () => {
    render(<Input label="Test" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id')
    expect(input.id).toMatch(/^input-/)
  })

  it('sets aria-invalid when error is present', () => {
    render(<Input error="Error message" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('sets aria-describedby correctly', () => {
    render(
      <Input 
        id="test"
        error="Error"
        helperText="Helper"
      />
    )
    
    const input = screen.getByRole('textbox')
    const describedBy = input.getAttribute('aria-describedby')
    
    expect(describedBy).toContain('test-error')
    expect(describedBy).not.toContain('test-helper')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('renders with data-testid', () => {
    render(<Input data-testid="test-input" />)
    expect(screen.getByTestId('test-input')).toBeInTheDocument()
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<Input label="Accessible input" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations with error', async () => {
    const { container } = render(
      <Input label="Input with error" error="This field is required" />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations when disabled', async () => {
    const { container } = render(<Input label="Disabled input" disabled />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
