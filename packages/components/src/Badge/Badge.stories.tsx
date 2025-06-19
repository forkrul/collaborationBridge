import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Badge } from './Badge'
import { Star, User, AlertCircle, CheckCircle, Clock } from 'lucide-react'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile badge component for displaying status, labels, and tags with support for icons, removal, and interactive states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'success', 'warning', 'error', 'outline', 'ghost'],
      description: 'Visual variant of the badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the badge',
    },
    removable: {
      control: 'boolean',
      description: 'Shows remove button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the badge',
    },
    interactive: {
      control: 'boolean',
      description: 'Makes the badge clickable',
    },
  },
  args: {
    onClick: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

// Basic badge
export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
}

// With icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge icon={<Star className="h-3 w-3" />}>Featured</Badge>
      <Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>
        Verified
      </Badge>
      <Badge variant="warning" icon={<AlertCircle className="h-3 w-3" />}>
        Warning
      </Badge>
      <Badge variant="secondary" icon={<User className="h-3 w-3" />}>
        Admin
      </Badge>
    </div>
  ),
}

// Removable badges
export const Removable: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge removable>React</Badge>
      <Badge variant="secondary" removable>
        TypeScript
      </Badge>
      <Badge variant="outline" removable>
        JavaScript
      </Badge>
    </div>
  ),
}

// Interactive badges
export const Interactive: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge interactive onClick={() => alert('Badge clicked!')}>
        Clickable
      </Badge>
      <Badge variant="outline" interactive onClick={() => alert('Filter clicked!')}>
        Filter: Active
      </Badge>
      <Badge variant="secondary" interactive onClick={() => alert('Category clicked!')}>
        Category
      </Badge>
    </div>
  ),
}

// Status badges
export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>
          Active
        </Badge>
        <Badge variant="warning" icon={<Clock className="h-3 w-3" />}>
          Pending
        </Badge>
        <Badge variant="error" icon={<AlertCircle className="h-3 w-3" />}>
          Inactive
        </Badge>
        <Badge variant="secondary">Draft</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common status indicators with appropriate colors and icons',
      },
    },
  },
}

// Disabled state
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge disabled>Disabled</Badge>
      <Badge variant="success" disabled removable>
        Disabled Removable
      </Badge>
      <Badge variant="outline" disabled interactive>
        Disabled Interactive
      </Badge>
    </div>
  ),
}

// Tag system example
export const TagSystem: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div>
        <h4 className="text-sm font-medium mb-2">Skills</h4>
        <div className="flex flex-wrap gap-1">
          <Badge size="sm" removable>React</Badge>
          <Badge size="sm" removable>TypeScript</Badge>
          <Badge size="sm" removable>Node.js</Badge>
          <Badge size="sm" removable>GraphQL</Badge>
          <Badge size="sm" removable>PostgreSQL</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Categories</h4>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" size="sm" interactive>Frontend</Badge>
          <Badge variant="outline" size="sm" interactive>Backend</Badge>
          <Badge variant="outline" size="sm" interactive>Database</Badge>
          <Badge variant="outline" size="sm" interactive>DevOps</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Status</h4>
        <div className="flex flex-wrap gap-1">
          <Badge variant="success" size="sm">Available</Badge>
          <Badge variant="warning" size="sm">Busy</Badge>
          <Badge variant="secondary" size="sm">Remote</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of using badges in a tag/category system',
      },
    },
  },
}
