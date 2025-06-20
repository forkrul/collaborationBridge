import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Textarea } from './Textarea'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A textarea component with support for auto-resize, character counting, validation states, and comprehensive form integration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Visual variant of the textarea',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the textarea',
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
      description: 'Resize behavior',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the textarea',
    },
    required: {
      control: 'boolean',
      description: 'Marks the textarea as required',
    },
    autoResize: {
      control: 'boolean',
      description: 'Auto-resize based on content',
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
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

// Basic textarea
export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
}

// With label and helper text
export const WithLabel: Story = {
  args: {
    label: 'Message',
    placeholder: 'Type your message here...',
    helperText: 'Your message will be sent to the support team',
  },
}

// Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Textarea
        label="Default"
        placeholder="Default textarea..."
        variant="default"
      />
      
      <Textarea
        label="Success"
        placeholder="Success textarea..."
        variant="success"
        value="This looks good!"
      />
      
      <Textarea
        label="Error"
        placeholder="Error textarea..."
        error="This field is required"
      />
    </div>
  ),
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Textarea
        label="Small"
        placeholder="Small textarea..."
        size="sm"
      />
      
      <Textarea
        label="Medium"
        placeholder="Medium textarea..."
        size="md"
      />
      
      <Textarea
        label="Large"
        placeholder="Large textarea..."
        size="lg"
      />
    </div>
  ),
}

// Resize options
export const ResizeOptions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
      <Textarea
        label="No Resize"
        placeholder="Cannot be resized..."
        resize="none"
      />
      
      <Textarea
        label="Vertical Resize"
        placeholder="Can be resized vertically..."
        resize="vertical"
      />
      
      <Textarea
        label="Horizontal Resize"
        placeholder="Can be resized horizontally..."
        resize="horizontal"
      />
      
      <Textarea
        label="Both Directions"
        placeholder="Can be resized in both directions..."
        resize="both"
      />
    </div>
  ),
}

// Auto-resize
export const AutoResize: Story = {
  args: {
    label: 'Auto-resize Textarea',
    placeholder: 'Start typing and watch me grow...',
    autoResize: true,
    minRows: 2,
    maxRows: 8,
    helperText: 'This textarea automatically adjusts its height based on content',
  },
}

// Character count
export const WithCharacterCount: Story = {
  args: {
    label: 'Tweet',
    placeholder: 'What\'s happening?',
    showCharacterCount: true,
    maxLength: 280,
    helperText: 'Share your thoughts in 280 characters or less',
  },
}

// Required field
export const Required: Story = {
  args: {
    label: 'Feedback',
    placeholder: 'Please provide your feedback...',
    required: true,
    helperText: 'Your feedback helps us improve our service',
  },
}

// Disabled state
export const Disabled: Story = {
  args: {
    label: 'Disabled Textarea',
    placeholder: 'This textarea is disabled...',
    disabled: true,
    value: 'This content cannot be edited',
  },
}

// Form example
export const FormExample: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <h3 className="text-lg font-semibold">Contact Form</h3>
      
      <Textarea
        label="Subject"
        placeholder="Brief description of your inquiry..."
        size="sm"
        maxLength={100}
        showCharacterCount
        required
      />
      
      <Textarea
        label="Message"
        placeholder="Please provide details about your inquiry..."
        autoResize
        minRows={3}
        maxRows={10}
        maxLength={1000}
        showCharacterCount
        required
        helperText="Provide as much detail as possible to help us assist you"
      />
      
      <Textarea
        label="Additional Notes"
        placeholder="Any additional information (optional)..."
        size="sm"
        resize="none"
        rows={2}
      />
      
      <Textarea
        label="Technical Details"
        placeholder="Browser, OS, error messages, etc..."
        variant="success"
        value="Chrome 120, macOS 14.1, No errors"
        helperText="This information helps us troubleshoot issues"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete contact form with various textarea configurations',
      },
    },
  },
}

// Long content example
export const LongContent: Story = {
  args: {
    label: 'Article Content',
    value: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
    showCharacterCount: true,
    maxLength: 2000,
    resize: "vertical",
    helperText: "You can resize this textarea vertically to see more content",
  },
}

// Auto-resize demonstration
export const AutoResizeDemo: Story = {
  render: () => (
    <div className="w-80">
      <Textarea
        label="Auto-resize Demo"
        placeholder="Type multiple lines to see auto-resize in action..."
        autoResize
        minRows={1}
        maxRows={6}
        helperText="This textarea grows as you type and shrinks when you delete content"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration of auto-resize functionality',
      },
    },
  },
}
