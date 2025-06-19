import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectField
} from './Select'

const meta = {
  title: 'Components/Select',
  component: SelectField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A select component built on Radix UI with support for grouping, separators, and form integration with validation states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Visual variant of the select',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the select',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select',
    },
    required: {
      control: 'boolean',
      description: 'Marks the select as required',
    },
  },
  args: {
    onValueChange: fn(),
  },
} satisfies Meta<typeof SelectField>

export default meta
type Story = StoryObj<typeof meta>

// Basic select
export const Default: Story = {
  args: {
    placeholder: 'Select an option...',
    children: (
      <>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
      </>
    ),
  },
}

// With label and helper text
export const WithLabel: Story = {
  args: {
    label: 'Favorite Fruit',
    placeholder: 'Choose your favorite...',
    helperText: 'This will be used for personalized recommendations',
    children: (
      <>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
      </>
    ),
  },
}

// Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <SelectField
        label="Default"
        placeholder="Select option..."
        variant="default"
      >
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectField>
      
      <SelectField
        label="Success"
        placeholder="Select option..."
        variant="success"
        defaultValue="option1"
      >
        <SelectItem value="option1">Valid Option</SelectItem>
        <SelectItem value="option2">Another Option</SelectItem>
      </SelectField>
      
      <SelectField
        label="Error"
        placeholder="Select option..."
        error="Please select a valid option"
      >
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectField>
    </div>
  ),
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <SelectField
        label="Small"
        placeholder="Small select..."
        size="sm"
      >
        <SelectItem value="small1">Small Option 1</SelectItem>
        <SelectItem value="small2">Small Option 2</SelectItem>
      </SelectField>
      
      <SelectField
        label="Medium"
        placeholder="Medium select..."
        size="md"
      >
        <SelectItem value="medium1">Medium Option 1</SelectItem>
        <SelectItem value="medium2">Medium Option 2</SelectItem>
      </SelectField>
      
      <SelectField
        label="Large"
        placeholder="Large select..."
        size="lg"
      >
        <SelectItem value="large1">Large Option 1</SelectItem>
        <SelectItem value="large2">Large Option 2</SelectItem>
      </SelectField>
    </div>
  ),
}

// With groups and separators
export const WithGroups: Story = {
  args: {
    label: 'Programming Language',
    placeholder: 'Select a language...',
    children: (
      <>
        <SelectGroup>
          <SelectLabel>Frontend</SelectLabel>
          <SelectItem value="javascript">JavaScript</SelectItem>
          <SelectItem value="typescript">TypeScript</SelectItem>
          <SelectItem value="html">HTML</SelectItem>
          <SelectItem value="css">CSS</SelectItem>
        </SelectGroup>
        
        <SelectSeparator />
        
        <SelectGroup>
          <SelectLabel>Backend</SelectLabel>
          <SelectItem value="python">Python</SelectItem>
          <SelectItem value="java">Java</SelectItem>
          <SelectItem value="csharp">C#</SelectItem>
          <SelectItem value="go">Go</SelectItem>
        </SelectGroup>
        
        <SelectSeparator />
        
        <SelectGroup>
          <SelectLabel>Mobile</SelectLabel>
          <SelectItem value="swift">Swift</SelectItem>
          <SelectItem value="kotlin">Kotlin</SelectItem>
          <SelectItem value="dart">Dart</SelectItem>
        </SelectGroup>
      </>
    ),
  },
}

// Required field
export const Required: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select your country...',
    required: true,
    helperText: 'This field is required for shipping',
    children: (
      <>
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
        <SelectItem value="uk">United Kingdom</SelectItem>
        <SelectItem value="de">Germany</SelectItem>
        <SelectItem value="fr">France</SelectItem>
        <SelectItem value="jp">Japan</SelectItem>
        <SelectItem value="au">Australia</SelectItem>
      </>
    ),
  },
}

// Disabled state
export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    placeholder: 'Cannot select...',
    disabled: true,
    defaultValue: 'option1',
    children: (
      <>
        <SelectItem value="option1">Selected Option</SelectItem>
        <SelectItem value="option2">Other Option</SelectItem>
      </>
    ),
  },
}

// Custom select (using primitives)
export const CustomSelect: Story = {
  render: () => (
    <div className="w-80">
      <label className="text-sm font-medium mb-2 block">
        Custom Select
      </label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Custom styling..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">🍎 Apple</SelectItem>
            <SelectItem value="banana">🍌 Banana</SelectItem>
            <SelectItem value="orange">🍊 Orange</SelectItem>
          </SelectGroup>
          
          <SelectSeparator />
          
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            <SelectItem value="carrot">🥕 Carrot</SelectItem>
            <SelectItem value="broccoli">🥦 Broccoli</SelectItem>
            <SelectItem value="tomato">🍅 Tomato</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Custom select using primitive components with emojis and custom styling',
      },
    },
  },
}

// Form example
export const FormExample: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <h3 className="text-lg font-semibold">User Preferences</h3>
      
      <SelectField
        label="Theme"
        placeholder="Choose theme..."
        required
      >
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectField>
      
      <SelectField
        label="Language"
        placeholder="Select language..."
        defaultValue="en"
        helperText="This affects the interface language"
      >
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Español</SelectItem>
        <SelectItem value="fr">Français</SelectItem>
        <SelectItem value="de">Deutsch</SelectItem>
        <SelectItem value="ja">日本語</SelectItem>
      </SelectField>
      
      <SelectField
        label="Timezone"
        placeholder="Select timezone..."
        size="sm"
      >
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Time (EST)</SelectItem>
          <SelectItem value="cst">Central Time (CST)</SelectItem>
          <SelectItem value="mst">Mountain Time (MST)</SelectItem>
          <SelectItem value="pst">Pacific Time (PST)</SelectItem>
        </SelectGroup>
        
        <SelectSeparator />
        
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
          <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
        </SelectGroup>
        
        <SelectSeparator />
        
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
          <SelectItem value="cst-china">China Standard Time (CST)</SelectItem>
          <SelectItem value="ist">India Standard Time (IST)</SelectItem>
        </SelectGroup>
      </SelectField>
      
      <SelectField
        label="Notification Frequency"
        placeholder="How often?"
        error="Please select a notification frequency"
      >
        <SelectItem value="realtime">Real-time</SelectItem>
        <SelectItem value="hourly">Hourly</SelectItem>
        <SelectItem value="daily">Daily</SelectItem>
        <SelectItem value="weekly">Weekly</SelectItem>
        <SelectItem value="never">Never</SelectItem>
      </SelectField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete form example with various select configurations and states',
      },
    },
  },
}
