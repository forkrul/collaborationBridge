import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Button } from './Button'
import { Heart, Download, ArrowRight } from 'lucide-react'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states. Supports loading states, icons, and can render as different elements.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'ghost', 'outline', 'destructive', 'link'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'icon'],
      description: 'Size of the button',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables interaction',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as a child component (useful for links)',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Basic variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Tertiary Button',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
}

// With icons
export const WithLeftIcon: Story = {
  args: {
    leftIcon: <Heart className="h-4 w-4" />,
    children: 'Like',
  },
}

export const WithRightIcon: Story = {
  args: {
    rightIcon: <ArrowRight className="h-4 w-4" />,
    children: 'Continue',
  },
}

export const IconOnly: Story = {
  args: {
    size: 'icon',
    children: <Download className="h-4 w-4" />,
    'aria-label': 'Download',
  },
}

// States
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
}

export const LoadingWithCustomText: Story = {
  args: {
    loading: true,
    loadingText: 'Saving changes...',
    children: 'Save',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-md">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
      <Button loading>Loading</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Overview of all available button variants',
      },
    },
  },
}
