import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '../Card'

expect.extend(toHaveNoViolations)

describe('Card', () => {
  it('renders correctly', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Card className="custom-class">Content</Card>)
    const card = screen.getByText('Content')
    expect(card).toHaveClass('custom-class')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Card variant="default">Default</Card>)
    expect(screen.getByText('Default')).toHaveClass('border-border')

    rerender(<Card variant="outlined">Outlined</Card>)
    expect(screen.getByText('Outlined')).toHaveClass('border-2')

    rerender(<Card variant="elevated">Elevated</Card>)
    expect(screen.getByText('Elevated')).toHaveClass('shadow-md')

    rerender(<Card variant="filled">Filled</Card>)
    expect(screen.getByText('Filled')).toHaveClass('bg-muted')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Card size="sm">Small</Card>)
    expect(screen.getByText('Small')).toHaveClass('text-sm')

    rerender(<Card size="lg">Large</Card>)
    expect(screen.getByText('Large')).toHaveClass('text-lg')
  })

  it('applies interactive styles when interactive prop is true', () => {
    render(<Card interactive>Interactive card</Card>)
    expect(screen.getByText('Interactive card')).toHaveClass('cursor-pointer')
  })

  it('applies disabled styles when disabled prop is true', () => {
    render(<Card disabled>Disabled card</Card>)
    expect(screen.getByText('Disabled card')).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Card ref={ref}>Card</Card>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('renders with data-testid', () => {
    render(<Card data-testid="test-card">Card</Card>)
    expect(screen.getByTestId('test-card')).toBeInTheDocument()
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<Card>Accessible card</Card>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('CardHeader', () => {
  it('renders correctly', () => {
    render(<CardHeader>Header content</CardHeader>)
    expect(screen.getByText('Header content')).toBeInTheDocument()
  })

  it('applies correct default classes', () => {
    render(<CardHeader>Header</CardHeader>)
    expect(screen.getByText('Header')).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<CardHeader ref={ref}>Header</CardHeader>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('CardTitle', () => {
  it('renders as h3 by default', () => {
    render(<CardTitle>Title</CardTitle>)
    const title = screen.getByRole('heading', { level: 3 })
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent('Title')
  })

  it('renders with custom heading level', () => {
    render(<CardTitle level={1}>Main Title</CardTitle>)
    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toBeInTheDocument()
  })

  it('applies correct default classes', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByRole('heading')).toHaveClass(
      'text-2xl', 
      'font-semibold', 
      'leading-none', 
      'tracking-tight'
    )
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLHeadingElement>()
    render(<CardTitle ref={ref}>Title</CardTitle>)
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
  })
})

describe('CardDescription', () => {
  it('renders correctly', () => {
    render(<CardDescription>Description text</CardDescription>)
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })

  it('applies correct default classes', () => {
    render(<CardDescription>Description</CardDescription>)
    expect(screen.getByText('Description')).toHaveClass('text-sm', 'text-muted-foreground')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLParagraphElement>()
    render(<CardDescription ref={ref}>Description</CardDescription>)
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
  })
})

describe('CardContent', () => {
  it('renders correctly', () => {
    render(<CardContent>Content</CardContent>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies correct default classes', () => {
    render(<CardContent>Content</CardContent>)
    expect(screen.getByText('Content')).toHaveClass('p-6', 'pt-0')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<CardContent ref={ref}>Content</CardContent>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('CardFooter', () => {
  it('renders correctly', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('applies correct default classes', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText('Footer')).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<CardFooter ref={ref}>Footer</CardFooter>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('Complete Card', () => {
  it('renders complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByRole('heading', { name: 'Card Title' })).toBeInTheDocument()
    expect(screen.getByText('Card description')).toBeInTheDocument()
    expect(screen.getByText('Card content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('should not have accessibility violations with complete structure', async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Accessible Card</CardTitle>
          <CardDescription>This card is fully accessible</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content with proper semantic structure</p>
        </CardContent>
        <CardFooter>
          <button>Accessible Action</button>
        </CardFooter>
      </Card>
    )
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
