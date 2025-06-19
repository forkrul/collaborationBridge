import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './Label'
import { Input } from '../Input'

const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A label component built on Radix UI with support for different variants, sizes, and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'muted', 'error', 'success'],
      description: 'Visual variant of the label',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the label',
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight of the label',
    },
    required: {
      control: 'boolean',
      description: 'Shows required asterisk',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the label',
    },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

// Basic label
export const Default: Story = {
  args: {
    children: 'Label Text',
  },
}

// Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Label variant="default">Default Label</Label>
      <Label variant="muted">Muted Label</Label>
      <Label variant="error">Error Label</Label>
      <Label variant="success">Success Label</Label>
    </div>
  ),
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Label size="sm">Small Label</Label>
      <Label size="md">Medium Label</Label>
      <Label size="lg">Large Label</Label>
    </div>
  ),
}

// Font weights
export const FontWeights: Story = {
  render: () => (
    <div className="space-y-4">
      <Label weight="normal">Normal Weight</Label>
      <Label weight="medium">Medium Weight</Label>
      <Label weight="semibold">Semibold Weight</Label>
      <Label weight="bold">Bold Weight</Label>
    </div>
  ),
}

// Required field
export const Required: Story = {
  args: {
    children: 'Required Field',
    required: true,
  },
}

// With description
export const WithDescription: Story = {
  args: {
    children: 'Email Address',
    description: 'We\'ll use this to send you important updates',
    required: true,
  },
}

// Disabled
export const Disabled: Story = {
  args: {
    children: 'Disabled Label',
    disabled: true,
    description: 'This field is currently disabled',
  },
}

// With form control
export const WithInput: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <Label htmlFor="email-input" required>
        Email Address
      </Label>
      <Input
        id="email-input"
        type="email"
        placeholder="Enter your email"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Label properly associated with an input using htmlFor and id',
      },
    },
  },
}

// Form example with different states
export const FormStates: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <div className="space-y-2">
        <Label htmlFor="normal-input">
          Normal Field
        </Label>
        <Input id="normal-input" placeholder="Enter text" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="required-input" required>
          Required Field
        </Label>
        <Input id="required-input" placeholder="This field is required" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="error-input" variant="error">
          Field with Error
        </Label>
        <Input 
          id="error-input" 
          variant="error"
          value="invalid@"
          error="Please enter a valid email"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="success-input" variant="success">
          Valid Field
        </Label>
        <Input 
          id="success-input" 
          variant="success"
          value="user@example.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label 
          htmlFor="disabled-input" 
          disabled
          description="This field is currently unavailable"
        >
          Disabled Field
        </Label>
        <Input 
          id="disabled-input" 
          disabled
          value="Cannot edit"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example showing labels in different states with corresponding inputs',
      },
    },
  },
}
