import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { 
  Header, 
  HeaderLogo, 
  HeaderNavigation, 
  HeaderActions, 
  HeaderMobileMenu 
} from './Header'
import { Button } from '../Button'
import { Badge } from '../Badge'
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Home, 
  Users, 
  FileText, 
  BarChart3 
} from 'lucide-react'

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A header component for site navigation with logo, navigation items, actions, and mobile menu support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'transparent', 'solid', 'floating'],
      description: 'Visual variant of the header',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the header',
    },
    sticky: {
      control: 'boolean',
      description: 'Whether the header is sticky',
    },
    showMobileMenuButton: {
      control: 'boolean',
      description: 'Whether to show mobile menu button',
    },
  },
  args: {
    onMobileMenuToggle: fn(),
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

// Basic header
export const Default: Story = {
  args: {
    logo: (
      <HeaderLogo 
        icon={<div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">L</div>}
        text="Logo"
      />
    ),
    navigation: (
      <HeaderNavigation>
        <Button variant="ghost">Home</Button>
        <Button variant="ghost">About</Button>
        <Button variant="ghost">Services</Button>
        <Button variant="ghost">Contact</Button>
      </HeaderNavigation>
    ),
    actions: (
      <HeaderActions>
        <Button variant="outline" size="sm">Sign In</Button>
        <Button size="sm">Sign Up</Button>
      </HeaderActions>
    ),
  },
}

// Different variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Header 
        variant="default"
        logo={<HeaderLogo text="Default" />}
        navigation={
          <HeaderNavigation>
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">About</Button>
          </HeaderNavigation>
        }
        actions={<Button size="sm">Action</Button>}
      />
      
      <Header 
        variant="transparent"
        logo={<HeaderLogo text="Transparent" />}
        navigation={
          <HeaderNavigation>
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">About</Button>
          </HeaderNavigation>
        }
        actions={<Button size="sm">Action</Button>}
      />
      
      <Header 
        variant="solid"
        logo={<HeaderLogo text="Solid" />}
        navigation={
          <HeaderNavigation>
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">About</Button>
          </HeaderNavigation>
        }
        actions={<Button size="sm">Action</Button>}
      />
      
      <Header 
        variant="floating"
        logo={<HeaderLogo text="Floating" />}
        navigation={
          <HeaderNavigation>
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">About</Button>
          </HeaderNavigation>
        }
        actions={<Button size="sm">Action</Button>}
      />
    </div>
  ),
}

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Header 
        size="sm"
        logo={<HeaderLogo text="Small" />}
        navigation={
          <HeaderNavigation>
            <Button variant="ghost" size="sm">Home</Button>
            <Button variant="ghost" size="sm">About</Button>
          </HeaderNavigation>
        }
        actions={<Button size="sm">Action</Button>}
      />
      
      <Header 
        size="md"
        logo={<HeaderLogo text="Medium" />}
        navigation={
          <HeaderNavigation>
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">About</Button>
          </HeaderNavigation>
        }
        actions={<Button>Action</Button>}
      />
      
      <Header 
        size="lg"
        logo={<HeaderLogo text="Large" />}
        navigation={
          <HeaderNavigation>
            <Button variant="ghost" size="lg">Home</Button>
            <Button variant="ghost" size="lg">About</Button>
          </HeaderNavigation>
        }
        actions={<Button size="lg">Action</Button>}
      />
    </div>
  ),
}

// With mobile menu
export const WithMobileMenu: Story = {
  args: {
    logo: (
      <HeaderLogo 
        icon={<Home className="h-6 w-6" />}
        text="Company"
      />
    ),
    navigation: (
      <HeaderNavigation>
        <Button variant="ghost">Dashboard</Button>
        <Button variant="ghost">Projects</Button>
        <Button variant="ghost">Team</Button>
        <Button variant="ghost">Reports</Button>
      </HeaderNavigation>
    ),
    actions: (
      <HeaderActions>
        <Button variant="ghost" size="sm">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
          <Badge variant="error" className="ml-1">3</Badge>
        </Button>
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4" />
        </Button>
      </HeaderActions>
    ),
    mobileMenu: (
      <HeaderMobileMenu>
        <Button variant="ghost" className="justify-start">
          <Home className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
        <Button variant="ghost" className="justify-start">
          <FileText className="h-4 w-4 mr-2" />
          Projects
        </Button>
        <Button variant="ghost" className="justify-start">
          <Users className="h-4 w-4 mr-2" />
          Team
        </Button>
        <Button variant="ghost" className="justify-start">
          <BarChart3 className="h-4 w-4 mr-2" />
          Reports
        </Button>
        <div className="border-t pt-2 mt-2">
          <Button variant="ghost" className="justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" className="justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </HeaderMobileMenu>
    ),
  },
}

// E-commerce header
export const EcommerceHeader: Story = {
  args: {
    logo: (
      <HeaderLogo 
        icon={<div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">S</div>}
        text="Store"
      />
    ),
    navigation: (
      <HeaderNavigation>
        <Button variant="ghost">Categories</Button>
        <Button variant="ghost">Deals</Button>
        <Button variant="ghost">New Arrivals</Button>
        <Button variant="ghost">About</Button>
      </HeaderNavigation>
    ),
    actions: (
      <HeaderActions>
        <Button variant="ghost" size="sm">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          Cart (2)
        </Button>
      </HeaderActions>
    ),
    mobileMenu: (
      <HeaderMobileMenu>
        <Button variant="ghost" className="justify-start">Categories</Button>
        <Button variant="ghost" className="justify-start">Deals</Button>
        <Button variant="ghost" className="justify-start">New Arrivals</Button>
        <Button variant="ghost" className="justify-start">About</Button>
        <div className="border-t pt-2 mt-2">
          <Button variant="ghost" className="justify-start">My Account</Button>
          <Button variant="ghost" className="justify-start">Cart (2)</Button>
        </div>
      </HeaderMobileMenu>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'E-commerce header with shopping cart and user account actions',
      },
    },
  },
}

// Dashboard header
export const DashboardHeader: Story = {
  args: {
    logo: (
      <HeaderLogo 
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
        text="Analytics"
      />
    ),
    navigation: (
      <HeaderNavigation>
        <Button variant="ghost">Overview</Button>
        <Button variant="ghost">Analytics</Button>
        <Button variant="ghost">Reports</Button>
        <Button variant="ghost">Settings</Button>
      </HeaderNavigation>
    ),
    actions: (
      <HeaderActions>
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
          <Badge variant="error" className="ml-1">5</Badge>
        </Button>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
            JD
          </div>
          <span className="text-sm font-medium">John Doe</span>
        </div>
      </HeaderActions>
    ),
    mobileMenu: (
      <HeaderMobileMenu>
        <Button variant="ghost" className="justify-start">
          <BarChart3 className="h-4 w-4 mr-2" />
          Overview
        </Button>
        <Button variant="ghost" className="justify-start">
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
        <Button variant="ghost" className="justify-start">
          <FileText className="h-4 w-4 mr-2" />
          Reports
        </Button>
        <Button variant="ghost" className="justify-start">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <div className="border-t pt-2 mt-2">
          <div className="flex items-center space-x-2 px-3 py-2">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
              JD
            </div>
            <span className="text-sm font-medium">John Doe</span>
          </div>
          <Button variant="ghost" className="justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </HeaderMobileMenu>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard header with user profile and notifications',
      },
    },
  },
}
