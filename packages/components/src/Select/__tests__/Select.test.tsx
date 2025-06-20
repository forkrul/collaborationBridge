import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectField
} from '../Select'

expect.extend(toHaveNoViolations)

describe('Select', () => {
  it('renders basic select', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select option..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('Select option...')).toBeInTheDocument()
  })

  it('opens and shows options when clicked', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select option..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('selects option when clicked', () => {
    const handleValueChange = jest.fn()
    render(
      <Select onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select option..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('Option 1'))
    
    expect(handleValueChange).toHaveBeenCalledWith('option1')
  })

  it('renders SelectField with label', () => {
    render(
      <SelectField label="Test Select">
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectField>
    )

    expect(screen.getByText('Test Select')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('shows error message in SelectField', () => {
    render(
      <SelectField label="Test Select" error="This field is required">
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectField>
    )

    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows helper text when no error', () => {
    render(
      <SelectField label="Test Select" helperText="Choose an option">
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectField>
    )

    expect(screen.getByText('Choose an option')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    render(
      <SelectField label="Required Select" required>
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectField>
    )

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('applies error variant when error is present', () => {
    render(
      <SelectField error="Error">
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectField>
    )

    expect(screen.getByRole('combobox')).toHaveClass('border-destructive')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(
      <SelectField size="sm">
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectField>
    )
    expect(screen.getByRole('combobox')).toHaveClass('h-8')

    rerender(
      <SelectField size="lg">
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectField>
    )
    expect(screen.getByRole('combobox')).toHaveClass('h-12')
  })

  it('is disabled when disabled prop is true', () => {
    render(
      <SelectField disabled>
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectField>
    )

    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('sets aria-invalid when error is present', () => {
    render(
      <SelectField error="Error">
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectField>
    )

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders with data-testid', () => {
    render(
      <SelectField data-testid="test-select">
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectField>
    )

    expect(screen.getByTestId('test-select')).toBeInTheDocument()
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(
      <SelectField label="Accessible Select">
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectField>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations with error', async () => {
    const { container } = render(
      <SelectField label="Select with error" error="This field is required">
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectField>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations when disabled', async () => {
    const { container } = render(
      <SelectField label="Disabled select" disabled>
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectField>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
