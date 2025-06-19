import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Progress } from '../Progress'

expect.extend(toHaveNoViolations)

describe('Progress', () => {
  it('renders correctly', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Progress value={50} className="custom-class" />)
    expect(screen.getByRole('progressbar')).toHaveClass('custom-class')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Progress value={50} variant="default" />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    rerender(<Progress value={50} variant="success" />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    rerender(<Progress value={50} variant="warning" />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    rerender(<Progress value={50} variant="error" />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Progress value={50} size="sm" />)
    expect(screen.getByRole('progressbar')).toHaveClass('h-2')

    rerender(<Progress value={50} size="md" />)
    expect(screen.getByRole('progressbar')).toHaveClass('h-4')

    rerender(<Progress value={50} size="lg" />)
    expect(screen.getByRole('progressbar')).toHaveClass('h-6')
  })

  it('displays correct aria attributes', () => {
    render(<Progress value={75} max={100} />)
    const progressbar = screen.getByRole('progressbar')
    
    expect(progressbar).toHaveAttribute('aria-valuenow', '75')
    expect(progressbar).toHaveAttribute('aria-valuemax', '100')
  })

  it('renders label when provided', () => {
    render(<Progress value={50} label="Loading progress" />)
    expect(screen.getByText('Loading progress')).toBeInTheDocument()
  })

  it('shows value when showValue is true', () => {
    render(<Progress value={75} showValue />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('uses custom formatValue function', () => {
    const formatValue = (value: number) => `${value} of 100`
    render(<Progress value={75} showValue formatValue={formatValue} />)
    expect(screen.getByText('75 of 100')).toBeInTheDocument()
  })

  it('renders indeterminate state', () => {
    render(<Progress indeterminate />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).not.toHaveAttribute('aria-valuenow')
  })

  it('handles max value correctly', () => {
    render(<Progress value={50} max={200} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuemax', '200')
  })

  it('handles invalid values correctly', () => {
    render(<Progress value={150} max={100} />)
    const progressbar = screen.getByRole('progressbar')
    // Radix UI sets aria-valuenow to null for invalid values
    expect(progressbar).not.toHaveAttribute('aria-valuenow')
  })

  it('handles negative values correctly', () => {
    render(<Progress value={-10} />)
    const progressbar = screen.getByRole('progressbar')
    // Radix UI sets aria-valuenow to null for invalid values
    expect(progressbar).not.toHaveAttribute('aria-valuenow')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Progress ref={ref} value={50} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('renders with data-testid', () => {
    render(<Progress value={50} data-testid="test-progress" />)
    expect(screen.getByTestId('test-progress')).toBeInTheDocument()
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<Progress value={50} label="Accessible progress" aria-label="Progress indicator" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations when indeterminate', async () => {
    const { container } = render(<Progress indeterminate label="Loading..." aria-label="Loading progress" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations with custom formatting', async () => {
    const { container } = render(
      <Progress
        value={75}
        showValue
        formatValue={(value) => `${value}% complete`}
        label="Custom progress"
        aria-label="Custom progress indicator"
      />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
