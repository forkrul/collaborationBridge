import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from './Progress'
import { useState, useEffect } from 'react'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A progress component built on Radix UI for showing completion status with support for different variants, sizes, and custom formatting.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Visual variant of the progress bar',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the progress bar',
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value (0-100)',
    },
    showValue: {
      control: 'boolean',
      description: 'Shows percentage value',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Shows indeterminate loading state',
    },
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

// Basic progress
export const Default: Story = {
  args: {
    value: 60,
  },
}

// With label and value
export const WithLabelAndValue: Story = {
  args: {
    value: 75,
    label: 'Upload Progress',
    showValue: true,
  },
}

// Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Progress variant="default" value={60} label="Default" showValue />
      <Progress variant="success" value={100} label="Success" showValue />
      <Progress variant="warning" value={45} label="Warning" showValue />
      <Progress variant="error" value={25} label="Error" showValue />
    </div>
  ),
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Progress size="sm" value={60} label="Small" showValue />
      <Progress size="md" value={60} label="Medium" showValue />
      <Progress size="lg" value={60} label="Large" showValue />
    </div>
  ),
}

// Indeterminate loading
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Loading...',
  },
}

// Custom formatting
export const CustomFormatting: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Progress
        value={750}
        max={1000}
        label="File Size"
        showValue
        formatValue={(value, max) => `${value}MB / ${max}MB`}
      />
      <Progress
        value={3}
        max={5}
        label="Steps Completed"
        showValue
        formatValue={(value, max) => `Step ${value} of ${max}`}
      />
      <Progress
        value={85}
        max={100}
        label="Battery Level"
        showValue
        variant="success"
        formatValue={(value) => `${value}% charged`}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples with custom value formatting for different use cases',
      },
    },
  },
}

// Animated progress
export const AnimatedProgress: Story = {
  render: () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0
          }
          return prev + 1
        })
      }, 100)

      return () => clearInterval(timer)
    }, [])

    return (
      <div className="w-80">
        <Progress
          value={progress}
          label="Animated Progress"
          showValue
          variant={progress === 100 ? 'success' : 'default'}
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated progress bar that cycles from 0 to 100%',
      },
    },
  },
}

// Multi-step progress
export const MultiStepProgress: Story = {
  render: () => {
    const steps = [
      { name: 'Personal Info', completed: true },
      { name: 'Address', completed: true },
      { name: 'Payment', completed: false },
      { name: 'Confirmation', completed: false },
    ]
    
    const completedSteps = steps.filter(step => step.completed).length
    const progress = (completedSteps / steps.length) * 100

    return (
      <div className="space-y-4 w-80">
        <Progress
          value={progress}
          label="Form Completion"
          showValue
          formatValue={() => `${completedSteps} of ${steps.length} steps`}
          variant={progress === 100 ? 'success' : 'default'}
        />
        
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={step.name} className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                step.completed ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <span className={step.completed ? 'text-green-600' : 'text-gray-500'}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-step form progress with step indicators',
      },
    },
  },
}

// File upload progress
export const FileUploadProgress: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Progress
        value={100}
        label="document.pdf"
        showValue
        variant="success"
        size="sm"
      />
      <Progress
        value={65}
        label="image.jpg"
        showValue
        size="sm"
      />
      <Progress
        value={30}
        label="video.mp4"
        showValue
        size="sm"
      />
      <Progress
        indeterminate
        label="processing..."
        size="sm"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'File upload progress indicators with different states',
      },
    },
  },
}
