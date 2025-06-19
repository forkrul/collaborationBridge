import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from '../Button'
import { Heart } from 'lucide-react'

expect.extend(toHaveNoViolations)

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11')
  })

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByText('Loading')).toBeInTheDocument()
  })

  it('shows custom loading text', () => {
    render(
      <Button loading loadingText="Saving...">
        Save
      </Button>
    )
    
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(screen.queryByText('Save')).not.toBeInTheDocument()
  })

  it('renders with left icon', () => {
    render(
      <Button leftIcon={<Heart data-testid="heart-icon" />}>
        Like
      </Button>
    )
    
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument()
    expect(screen.getByText('Like')).toBeInTheDocument()
  })

  it('renders with right icon', () => {
    render(
      <Button rightIcon={<Heart data-testid="heart-icon" />}>
        Like
      </Button>
    )
    
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument()
  })

  it('hides icons when loading', () => {
    render(
      <Button 
        loading 
        leftIcon={<Heart data-testid="heart-icon" />}
        rightIcon={<Heart data-testid="heart-icon-right" />}
      >
        Loading
      </Button>
    )
    
    expect(screen.queryByTestId('heart-icon')).not.toBeInTheDocument()
    expect(screen.queryByTestId('heart-icon-right')).not.toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('is disabled when loading', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when loading', () => {
    const handleClick = jest.fn()
    render(<Button loading onClick={handleClick}>Loading</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Button</Button>)
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('renders with data-testid', () => {
    render(<Button data-testid="test-button">Button</Button>)
    expect(screen.getByTestId('test-button')).toBeInTheDocument()
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Accessible Button</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations when disabled', async () => {
    const { container } = render(<Button disabled>Disabled Button</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations when loading', async () => {
    const { container } = render(<Button loading>Loading Button</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
