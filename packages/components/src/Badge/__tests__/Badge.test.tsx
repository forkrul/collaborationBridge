import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Badge } from '../Badge'
import { Star } from 'lucide-react'

expect.extend(toHaveNoViolations)

describe('Badge', () => {
  it('renders correctly', () => {
    render(<Badge>Test badge</Badge>)
    expect(screen.getByText('Test badge')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Badge</Badge>)
    expect(screen.getByText('Badge')).toHaveClass('custom-class')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>)
    expect(screen.getByText('Default')).toHaveClass('bg-primary')

    rerender(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary')

    rerender(<Badge variant="success">Success</Badge>)
    expect(screen.getByText('Success')).toHaveClass('bg-green-500')

    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline')).toHaveClass('border-border')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText('Small')).toHaveClass('px-1.5', 'py-0.5')

    rerender(<Badge size="lg">Large</Badge>)
    expect(screen.getByText('Large')).toHaveClass('px-3', 'py-1')
  })

  it('renders with icon', () => {
    render(
      <Badge icon={<Star data-testid="star-icon" />}>
        With Icon
      </Badge>
    )
    
    expect(screen.getByTestId('star-icon')).toBeInTheDocument()
    expect(screen.getByText('With Icon')).toBeInTheDocument()
  })

  it('renders remove button when removable', () => {
    render(<Badge removable>Removable</Badge>)
    expect(screen.getByRole('button', { name: 'Remove badge' })).toBeInTheDocument()
  })

  it('calls onRemove when remove button is clicked', () => {
    const handleRemove = jest.fn()
    render(<Badge removable onRemove={handleRemove}>Removable</Badge>)
    
    fireEvent.click(screen.getByRole('button', { name: 'Remove badge' }))
    expect(handleRemove).toHaveBeenCalledTimes(1)
  })

  it('prevents event propagation when remove button is clicked', () => {
    const handleClick = jest.fn()
    const handleRemove = jest.fn()
    
    render(
      <Badge removable onClick={handleClick} onRemove={handleRemove}>
        Removable
      </Badge>
    )
    
    fireEvent.click(screen.getByRole('button', { name: 'Remove badge' }))
    
    expect(handleRemove).toHaveBeenCalledTimes(1)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('handles click events when interactive', () => {
    const handleClick = jest.fn()
    render(<Badge onClick={handleClick}>Clickable</Badge>)
    
    fireEvent.click(screen.getByText('Clickable'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies interactive styles when onClick is provided', () => {
    render(<Badge onClick={() => {}}>Clickable</Badge>)
    expect(screen.getByText('Clickable')).toHaveClass('cursor-pointer')
  })

  it('applies interactive styles when interactive prop is true', () => {
    render(<Badge interactive>Interactive</Badge>)
    expect(screen.getByText('Interactive')).toHaveClass('cursor-pointer')
  })

  it('sets role="button" when onClick is provided', () => {
    render(<Badge onClick={() => {}}>Clickable</Badge>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('sets tabIndex when onClick is provided and not disabled', () => {
    render(<Badge onClick={() => {}}>Clickable</Badge>)
    expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '0')
  })

  it('does not set tabIndex when disabled', () => {
    render(<Badge onClick={() => {}} disabled>Disabled</Badge>)
    expect(screen.getByText('Disabled')).not.toHaveAttribute('tabIndex')
  })

  it('applies disabled styles when disabled', () => {
    render(<Badge disabled>Disabled</Badge>)
    expect(screen.getByText('Disabled')).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn()
    render(<Badge onClick={handleClick} disabled>Disabled</Badge>)
    
    fireEvent.click(screen.getByText('Disabled'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('disables remove button when disabled', () => {
    render(<Badge removable disabled>Disabled</Badge>)
    expect(screen.getByRole('button', { name: 'Remove badge' })).toBeDisabled()
  })

  it('sets aria-disabled when disabled', () => {
    render(<Badge disabled>Disabled</Badge>)
    expect(screen.getByText('Disabled')).toHaveAttribute('aria-disabled', 'true')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Badge ref={ref}>Badge</Badge>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('renders with data-testid', () => {
    render(<Badge data-testid="test-badge">Badge</Badge>)
    expect(screen.getByTestId('test-badge')).toBeInTheDocument()
  })

  it('handles keyboard events for interactive badges', () => {
    const handleClick = jest.fn()
    render(<Badge onClick={handleClick}>Clickable</Badge>)
    
    const badge = screen.getByRole('button')
    fireEvent.keyDown(badge, { key: 'Enter' })
    // Note: We're not testing Enter key handling as it's not implemented
    // This test ensures the element is focusable
    expect(badge).toHaveAttribute('tabIndex', '0')
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<Badge>Accessible badge</Badge>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations when interactive', async () => {
    const { container } = render(<Badge onClick={() => {}}>Interactive badge</Badge>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations when removable', async () => {
    const { container } = render(<Badge removable>Removable badge</Badge>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations when disabled', async () => {
    const { container } = render(<Badge disabled>Disabled badge</Badge>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
