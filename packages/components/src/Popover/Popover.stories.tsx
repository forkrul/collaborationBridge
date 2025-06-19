import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverFooter,
  Tooltip
} from './Popover'
import { Button } from '../Button'
import { Input } from '../Input'
import { Label } from '../Label'
import { Calendar, Settings, User, HelpCircle, Info } from 'lucide-react'

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A popover component built on Radix UI for displaying rich content in a floating panel. Includes tooltip functionality for simple content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls the open state of the popover',
    },
  },
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

// Basic popover
export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium">Popover Content</h4>
          <p className="text-sm text-muted-foreground">
            This is a basic popover with some content.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">Small</Button>
        </PopoverTrigger>
        <PopoverContent size="sm">
          <div className="space-y-2">
            <h4 className="font-medium">Small Popover</h4>
            <p className="text-sm text-muted-foreground">
              Compact content for quick actions.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Medium</Button>
        </PopoverTrigger>
        <PopoverContent size="md">
          <div className="space-y-2">
            <h4 className="font-medium">Medium Popover</h4>
            <p className="text-sm text-muted-foreground">
              Standard size for most content.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="lg">Large</Button>
        </PopoverTrigger>
        <PopoverContent size="lg">
          <div className="space-y-2">
            <h4 className="font-medium">Large Popover</h4>
            <p className="text-sm text-muted-foreground">
              Spacious content area for complex layouts.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
}

// With header and footer
export const WithHeaderAndFooter: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent showCloseButton>
        <PopoverHeader>
          <PopoverTitle>Account Settings</PopoverTitle>
          <PopoverDescription>
            Manage your account preferences and settings.
          </PopoverDescription>
        </PopoverHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue="johndoe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
        </div>
        
        <PopoverFooter>
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm">Save Changes</Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  ),
}

// User profile popover
export const UserProfile: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full">
          <User className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-muted-foreground">john@example.com</p>
            </div>
          </div>
          
          <div className="border-t pt-3 space-y-1">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story: 'User profile popover with avatar, info, and action buttons',
      },
    },
  },
}

// Calendar popover
export const CalendarPopover: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Select Date
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Select a Date</PopoverTitle>
          <PopoverDescription>
            Choose a date from the calendar below.
          </PopoverDescription>
        </PopoverHeader>
        
        <div className="p-4 border rounded-md bg-muted/50">
          <p className="text-center text-sm text-muted-foreground">
            Calendar component would go here
          </p>
          <p className="text-center text-xs text-muted-foreground mt-2">
            (This is a placeholder for demonstration)
          </p>
        </div>
        
        <PopoverFooter>
          <Button variant="outline" size="sm">Clear</Button>
          <Button size="sm">Apply</Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Calendar popover example with header, content area, and footer actions',
      },
    },
  },
}

// Tooltip examples
export const TooltipExamples: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Tooltip content="This is a simple tooltip">
        <Button variant="outline">Hover me</Button>
      </Tooltip>
      
      <Tooltip 
        content={
          <div className="space-y-1">
            <p className="font-medium">Rich Tooltip</p>
            <p className="text-xs">This tooltip has multiple lines and rich content.</p>
          </div>
        }
        delayDuration={300}
      >
        <Button variant="outline">
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </Button>
      </Tooltip>
      
      <Tooltip content="Disabled tooltip" disabled>
        <Button variant="outline">No tooltip</Button>
      </Tooltip>
      
      <Tooltip 
        content="Quick tooltip"
        delayDuration={0}
        size="sm"
      >
        <Button variant="ghost" size="sm">
          <Info className="h-4 w-4" />
        </Button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various tooltip examples with different content, delays, and configurations',
      },
    },
  },
}

// Custom close behavior
export const CustomCloseBehavior: Story = {
  render: () => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">No Outside Click</Button>
        </PopoverTrigger>
        <PopoverContent closeOnOutsideClick={false}>
          <div className="space-y-2">
            <h4 className="font-medium">Modal Popover</h4>
            <p className="text-sm text-muted-foreground">
              This popover cannot be closed by clicking outside.
            </p>
            <Button size="sm" className="w-full">Close</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">No Escape Key</Button>
        </PopoverTrigger>
        <PopoverContent closeOnEscape={false}>
          <div className="space-y-2">
            <h4 className="font-medium">Persistent Popover</h4>
            <p className="text-sm text-muted-foreground">
              This popover cannot be closed with the Escape key.
            </p>
            <Button size="sm" className="w-full">Close</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">With Close Button</Button>
        </PopoverTrigger>
        <PopoverContent showCloseButton>
          <div className="space-y-2">
            <h4 className="font-medium">Closeable Popover</h4>
            <p className="text-sm text-muted-foreground">
              This popover has a close button in the top-right corner.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of different close behaviors and configurations',
      },
    },
  },
}
