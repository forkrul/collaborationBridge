import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Input } from './Input'
import { Search, Mail, User, Lock } from 'lucide-react'

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile input component with support for labels, icons, validation states, and various input types including password with toggle visibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Visual variant of the input',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'HTML input type',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    required: {
      control: 'boolean',
      description: 'Marks the input as required',
    },
    showCharacterCount: {
      control: 'boolean',
      description: 'Shows character count',
    },
  },
  args: {
    onChange: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

// Basic inputs
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    helperText: 'Must be at least 3 characters long',
  },
}

// Variants
export const ErrorState: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    error: 'Please enter a valid email address',
    value: 'invalid-email',
  },
}

export const SuccessState: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    variant: 'success',
    value: 'user@example.com',
  },
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input size="sm" placeholder="Small input" label="Small" />
      <Input size="md" placeholder="Medium input" label="Medium" />
      <Input size="lg" placeholder="Large input" label="Large" />
    </div>
  ),
}

// With icons
export const WithLeftIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    leftIcon: <Search className="h-4 w-4" />,
  },
}

export const WithRightIcon: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    rightIcon: <Mail className="h-4 w-4" />,
    type: 'email',
  },
}

// Password input
export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
  },
}

// Character count
export const WithCharacterCount: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    showCharacterCount: true,
    maxLength: 100,
    helperText: 'Brief description for your profile',
  },
}

// Required field
export const Required: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
    helperText: 'This field is required',
  },
}

// Disabled
export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
    value: 'Cannot edit this',
  },
}

// Form example
export const FormExample: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <Input
        label="Full Name"
        placeholder="Enter your full name"
        leftIcon={<User className="h-4 w-4" />}
        required
      />
      
      <Input
        label="Email Address"
        placeholder="Enter your email"
        type="email"
        leftIcon={<Mail className="h-4 w-4" />}
        required
      />
      
      <Input
        label="Password"
        placeholder="Create a password"
        type="password"
        leftIcon={<Lock className="h-4 w-4" />}
        required
        helperText="Must be at least 8 characters"
      />
      
      <Input
        label="Bio"
        placeholder="Tell us about yourself"
        showCharacterCount
        maxLength={150}
        helperText="Optional: Brief description for your profile"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a complete form with various input configurations',
      },
    },
  },
}
