import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Checkbox } from './Checkbox'
import { Heart, Star } from 'lucide-react'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A checkbox component built on Radix UI with support for indeterminate state, custom icons, and comprehensive accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'success', 'warning', 'error'],
      description: 'Visual variant of the checkbox',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the checkbox',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the checkbox',
    },
    required: {
      control: 'boolean',
      description: 'Marks the checkbox as required',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Shows indeterminate state',
    },
  },
  args: {
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

// Basic checkbox
export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
}

// With description
export const WithDescription: Story = {
  args: {
    label: 'Subscribe to newsletter',
    description: 'Get weekly updates about new features and products',
  },
}

// Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox variant="default" label="Default" defaultChecked />
      <Checkbox variant="secondary" label="Secondary" defaultChecked />
      <Checkbox variant="success" label="Success" defaultChecked />
      <Checkbox variant="warning" label="Warning" defaultChecked />
      <Checkbox variant="error" label="Error" defaultChecked />
    </div>
  ),
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox size="sm" label="Small checkbox" defaultChecked />
      <Checkbox size="md" label="Medium checkbox" defaultChecked />
      <Checkbox size="lg" label="Large checkbox" defaultChecked />
    </div>
  ),
}

// States
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled Checked" disabled defaultChecked />
    </div>
  ),
}

// Indeterminate state
export const Indeterminate: Story = {
  args: {
    label: 'Select all items',
    indeterminate: true,
    description: 'Some items are selected',
  },
}

// With custom icons
export const CustomIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox
        label="Favorite"
        checkedIcon={<Heart className="h-3 w-3 fill-current" />}
        defaultChecked
      />
      <Checkbox
        label="Star rating"
        checkedIcon={<Star className="h-3 w-3 fill-current" />}
        indeterminateIcon={<Star className="h-3 w-3" />}
        indeterminate
      />
    </div>
  ),
}

// Error state
export const WithError: Story = {
  args: {
    label: 'I agree to the terms',
    error: 'You must accept the terms to continue',
    required: true,
  },
}

// Required field
export const Required: Story = {
  args: {
    label: 'Required checkbox',
    required: true,
    helperText: 'This field is required',
  },
}

// Form example
export const FormExample: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Preferences</h3>
        
        <Checkbox
          label="Email notifications"
          description="Receive email updates about your account"
          defaultChecked
        />
        
        <Checkbox
          label="SMS notifications"
          description="Receive text messages for important updates"
        />
        
        <Checkbox
          label="Marketing communications"
          description="Receive promotional emails and offers"
          variant="secondary"
        />
        
        <Checkbox
          label="Data processing"
          description="Allow us to process your data for analytics"
          required
          helperText="Required for service functionality"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of checkboxes in a form context with various configurations',
      },
    },
  },
}
