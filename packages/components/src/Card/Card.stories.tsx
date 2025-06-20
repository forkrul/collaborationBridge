import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'
import { Button } from '../Button'
import { Heart, Share, MoreHorizontal } from 'lucide-react'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component with header, content, and footer sections. Supports multiple variants and interactive states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated', 'filled'],
      description: 'Visual style variant of the card',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the card',
    },
    interactive: {
      control: 'boolean',
      description: 'Makes the card interactive with hover effects',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the card and reduces opacity',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

// Basic card
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          This is a description of the card content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This can be any React content.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
}

// Variants
export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" className="w-[350px]">
      <CardHeader>
        <CardTitle>Outlined Card</CardTitle>
        <CardDescription>
          This card has a thicker border for emphasis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content with outlined variant styling.</p>
      </CardContent>
    </Card>
  ),
}

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-[350px]">
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>
          This card has a shadow for a floating effect.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content with elevated variant styling.</p>
      </CardContent>
    </Card>
  ),
}

export const Filled: Story = {
  render: () => (
    <Card variant="filled" className="w-[350px]">
      <CardHeader>
        <CardTitle>Filled Card</CardTitle>
        <CardDescription>
          This card has a filled background.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content with filled variant styling.</p>
      </CardContent>
    </Card>
  ),
}

// Interactive card
export const Interactive: Story = {
  render: () => (
    <Card interactive className="w-[350px]">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>
          This card responds to hover interactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Hover over this card to see the interactive effect.</p>
      </CardContent>
    </Card>
  ),
}

// Disabled card
export const Disabled: Story = {
  render: () => (
    <Card disabled className="w-[350px]">
      <CardHeader>
        <CardTitle>Disabled Card</CardTitle>
        <CardDescription>
          This card is disabled and has reduced opacity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This content appears disabled.</p>
      </CardContent>
      <CardFooter>
        <Button disabled>Disabled Action</Button>
      </CardFooter>
    </Card>
  ),
}

// Complex card example
export const ProductCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Premium Plan</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Everything you need for your growing business
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="text-3xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/month</span></div>
        <ul className="mt-4 space-y-2 text-sm">
          <li>✓ Unlimited projects</li>
          <li>✓ Priority support</li>
          <li>✓ Advanced analytics</li>
          <li>✓ Custom integrations</li>
        </ul>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1">Get Started</Button>
        <Button variant="ghost" size="icon">
          <Heart className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a complex product card with pricing and features',
      },
    },
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>Standard card styling</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Default variant content</p>
        </CardContent>
      </Card>
      
      <Card variant="outlined" className="w-full">
        <CardHeader>
          <CardTitle>Outlined</CardTitle>
          <CardDescription>Emphasized border</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Outlined variant content</p>
        </CardContent>
      </Card>
      
      <Card variant="elevated" className="w-full">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
          <CardDescription>Shadow effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Elevated variant content</p>
        </CardContent>
      </Card>
      
      <Card variant="filled" className="w-full">
        <CardHeader>
          <CardTitle>Filled</CardTitle>
          <CardDescription>Background fill</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Filled variant content</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Overview of all available card variants',
      },
    },
  },
}
