import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Label } from '../Label'

expect.extend(toHaveNoViolations)

describe('Label', () => {
  it('renders correctly', () => {
    render(<Label>Test label</Label>)
    expect(screen.getByText('Test label')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Label className="custom-class">Label</Label>)
    expect(screen.getByText('Label')).toHaveClass('custom-class')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Label size="md">Default</Label>)
    expect(screen.getByText('Default')).toHaveClass('text-sm')

    rerender(<Label size="lg">Large</Label>)
    expect(screen.getByText('Large')).toHaveClass('text-base')

    rerender(<Label size="sm">Small</Label>)
    expect(screen.getByText('Small')).toHaveClass('text-xs')
  })

  it('shows required indicator when required', () => {
    render(<Label required>Required field</Label>)
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('*')).toHaveClass('text-destructive')
  })

  it('applies disabled styles when disabled', () => {
    render(<Label disabled>Disabled label</Label>)
    expect(screen.getByText('Disabled label')).toHaveClass('opacity-50')
  })

  it('sets htmlFor attribute', () => {
    render(<Label htmlFor="test-input">Label for input</Label>)
    expect(screen.getByText('Label for input')).toHaveAttribute('for', 'test-input')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLLabelElement>()
    render(<Label ref={ref}>Label</Label>)
    expect(ref.current).toBeInstanceOf(HTMLLabelElement)
  })

  it('renders with data-testid', () => {
    render(<Label data-testid="test-label">Label</Label>)
    expect(screen.getByTestId('test-label')).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Label variant="default">Default</Label>)
    expect(screen.getByText('Default')).toHaveClass('text-foreground')

    rerender(<Label variant="muted">Muted</Label>)
    expect(screen.getByText('Muted')).toHaveClass('text-muted-foreground')

    rerender(<Label variant="error">Error</Label>)
    expect(screen.getByText('Error')).toHaveClass('text-destructive')
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<Label>Accessible label</Label>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations when required', async () => {
    const { container } = render(<Label required>Required label</Label>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations when disabled', async () => {
    const { container } = render(<Label disabled>Disabled label</Label>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
