import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Textarea } from '../Textarea'

expect.extend(toHaveNoViolations)

describe('Textarea', () => {
  it('renders correctly', () => {
    render(<Textarea placeholder="Enter text..." />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('handles value changes', () => {
    const handleChange = jest.fn()
    render(<Textarea onChange={handleChange} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'test content' } })
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Textarea className="custom-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-class')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Textarea variant="default" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-input')

    rerender(<Textarea variant="error" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-destructive')

    rerender(<Textarea variant="success" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-green-500')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Textarea size="sm" />)
    expect(screen.getByRole('textbox')).toHaveClass('min-h-[60px]')

    rerender(<Textarea size="lg" />)
    expect(screen.getByRole('textbox')).toHaveClass('min-h-[120px]')
  })

  it('renders with different resize options', () => {
    const { rerender } = render(<Textarea resize="none" />)
    expect(screen.getByRole('textbox')).toHaveClass('resize-none')

    rerender(<Textarea resize="vertical" />)
    expect(screen.getByRole('textbox')).toHaveClass('resize-y')

    rerender(<Textarea resize="horizontal" />)
    expect(screen.getByRole('textbox')).toHaveClass('resize-x')

    rerender(<Textarea resize="both" />)
    expect(screen.getByRole('textbox')).toHaveClass('resize')
  })

  it('shows required indicator when required', () => {
    render(<Textarea label="Required field" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders label', () => {
    render(<Textarea label="Message" />)
    expect(screen.getByText('Message')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<Textarea error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows helper text when no error', () => {
    render(<Textarea helperText="Enter your message here" />)
    expect(screen.getByText('Enter your message here')).toBeInTheDocument()
  })

  it('hides helper text when error is present', () => {
    render(<Textarea helperText="Helper text" error="Error message" />)
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('applies error variant when error is present', () => {
    render(<Textarea error="Error" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-destructive')
  })

  it('shows character count when enabled', () => {
    render(<Textarea value="Hello" showCharacterCount />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows character count with max length', () => {
    render(<Textarea value="Hello" maxLength={100} showCharacterCount />)
    expect(screen.getByText('5/100')).toBeInTheDocument()
  })

  it('associates label with textarea using htmlFor and id', () => {
    render(<Textarea id="test-textarea" label="Test label" />)
    const label = screen.getByText('Test label')
    const textarea = screen.getByRole('textbox')
    
    expect(label).toHaveAttribute('for', 'test-textarea')
    expect(textarea).toHaveAttribute('id', 'test-textarea')
  })

  it('generates unique id when not provided', () => {
    render(<Textarea label="Test" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('id')
    expect(textarea.id).toMatch(/^textarea-/)
  })

  it('sets aria-invalid when error is present', () => {
    render(<Textarea error="Error message" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('renders with data-testid', () => {
    render(<Textarea data-testid="test-textarea" />)
    expect(screen.getByTestId('test-textarea')).toBeInTheDocument()
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<Textarea label="Accessible textarea" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations with error', async () => {
    const { container } = render(
      <Textarea label="Textarea with error" error="This field is required" />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations when disabled', async () => {
    const { container } = render(<Textarea label="Disabled textarea" disabled />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
