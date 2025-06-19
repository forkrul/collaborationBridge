# Frontend Components Guide

This document provides an overview of all the extracted and enhanced components available in the frontend framework.

## 🧩 UI Components

### Button Component (`src/components/ui/button.tsx`)
**Fully tested atomic component with comprehensive functionality**

```tsx
import { Button } from '@/components/ui/button';

// Basic usage
<Button>Click me</Button>

// With variants and sizes
<Button variant="destructive" size="lg">Delete</Button>

// With loading state
<Button loading>Processing...</Button>

// With icons
<Button leftIcon={<Save />} rightIcon={<ArrowRight />}>
  Save and Continue
</Button>
```

**Features:**
- ✅ Variants: default, destructive, outline, secondary, ghost, link
- ✅ Sizes: sm, md, lg, icon
- ✅ Loading states with spinner animation
- ✅ Left and right icon support
- ✅ Full accessibility support
- ✅ 90%+ test coverage

### Input Component (`src/components/ui/input.tsx`)
**Advanced form input with validation and accessibility**

```tsx
import { Input } from '@/components/ui/input';

// Basic input
<Input label="Email" placeholder="Enter your email" />

// With validation
<Input 
  label="Password" 
  type="password" 
  error="Password is required"
  required 
/>

// With icons
<Input 
  label="Search" 
  leftIcon={<Search />}
  rightIcon={<Filter />}
/>
```

**Features:**
- ✅ Password visibility toggle
- ✅ Error states with visual indicators
- ✅ Left and right icon support
- ✅ Helper text support
- ✅ Auto-generated unique IDs
- ✅ Full accessibility compliance

### Checkbox & Label Components
**Radix UI primitives with consistent styling**

```tsx
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

## 🔧 Form Components

### LoginForm Component (`src/components/forms/login-form.tsx`)
**Complete authentication form with validation**

```tsx
import { LoginForm } from '@/components/forms/login-form';

<LoginForm
  onSubmit={handleLogin}
  loading={isLoading}
  error={errorMessage}
/>
```

**Features:**
- ✅ Zod schema validation
- ✅ React Hook Form integration
- ✅ Real-time validation feedback
- ✅ Remember me functionality
- ✅ Password visibility toggle
- ✅ Loading states
- ✅ Error handling
- ✅ Accessibility compliance

## 🔔 Notification System

### NotificationSystem Component (`src/components/ui/notification-system.tsx`)
**Global toast notification system**

```tsx
// Component is automatically included in providers
import { useNotifications } from '@/hooks/use-notifications';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

  const handleAction = () => {
    showSuccess('Success!', 'Operation completed successfully');
    showError('Error!', 'Something went wrong');
    showWarning('Warning!', 'Please check your input');
    showInfo('Info', 'Here is some information');
  };
}
```

**Features:**
- ✅ Four notification types: success, error, warning, info
- ✅ Auto-dismiss with configurable duration
- ✅ Manual dismiss functionality
- ✅ Action buttons support
- ✅ Smooth animations with Framer Motion
- ✅ Zustand state management
- ✅ Accessibility with ARIA live regions

### Notification Hook (`src/hooks/use-notifications.ts`)
**Easy-to-use notification management**

```tsx
const {
  showNotification,    // Custom notification
  showSuccess,         // Success notification
  showError,          // Error notification (stays longer)
  showWarning,        // Warning notification
  showInfo,           // Info notification
  dismissNotification, // Dismiss specific notification
  clearAll            // Clear all notifications
} = useNotifications();
```

## 🏗️ Layout Components

### DashboardLayout Component (`src/components/layout/dashboard-layout.tsx`)
**Responsive application layout with navigation**

```tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1>Dashboard Content</h1>
      {/* Your page content */}
    </DashboardLayout>
  );
}
```

**Features:**
- ✅ Responsive sidebar (collapsible on mobile)
- ✅ Navigation with active state management
- ✅ User menu with logout functionality
- ✅ Mobile-first design
- ✅ Keyboard navigation support
- ✅ Next.js routing integration

## 🎨 Design System

### Utility Functions (`src/lib/utils.ts`)
**Comprehensive utility library**

```tsx
import { 
  cn,                 // Tailwind class merging
  formatDate,         // Date formatting
  formatDateTime,     // Date/time formatting
  formatRelativeTime, // Relative time (e.g., "2 hours ago")
  truncate,          // String truncation
  capitalize,        // String capitalization
  slugify,           // URL-friendly slugs
  getInitials,       // Name initials
  formatBytes,       // File size formatting
  debounce,          // Function debouncing
  throttle,          // Function throttling
  isValidEmail,      // Email validation
  isValidUrl,        // URL validation
  generateId,        // Unique ID generation
  copyToClipboard,   // Clipboard operations
  sleep,             // Promise delay
  getErrorMessage,   // Error message extraction
  omit,              // Object property omission
  pick               // Object property picking
} from '@/lib/utils';
```

## 🧪 Testing

### Component Testing
**Comprehensive test coverage with Jest + React Testing Library**

```tsx
// Example test structure
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button Component', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Testing
**Playwright tests with accessibility checks**

```tsx
// Example E2E test
import { test, expect } from '@playwright/test';

test('should successfully login with valid credentials', async ({ page }) => {
  await page.goto('/login');
  
  await page.getByTestId('email-input').fill('demo@example.com');
  await page.getByTestId('password-input').fill('password123');
  await page.getByTestId('login-button').click();

  await expect(page).toHaveURL('/dashboard');
});
```

## 🚀 Usage Examples

### Complete Login Flow
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/forms/login-form';
import { useNotifications } from '@/hooks/use-notifications';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showSuccess, showError } = useNotifications();

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      await authenticateUser(data);
      showSuccess('Login successful', 'Welcome back!');
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
      showError('Login failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </div>
  );
}
```

### Dashboard with Notifications
```tsx
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/use-notifications';

export default function Dashboard() {
  const { showSuccess, showError } = useNotifications();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="flex gap-4">
          <Button onClick={() => showSuccess('Success!', 'Operation completed')}>
            Test Success
          </Button>
          <Button 
            variant="destructive"
            onClick={() => showError('Error!', 'Something went wrong')}
          >
            Test Error
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
```

## 📦 State Management

### Notification Store (Zustand)
```tsx
// Automatic state management for notifications
import { useNotificationStore } from '@/stores/notification-store';

// Direct store access (rarely needed)
const { notifications, addNotification, removeNotification } = useNotificationStore();
```

## ♿ Accessibility Features

All components include:
- ✅ Proper ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Focus management
- ✅ Color contrast compliance
- ✅ Semantic HTML structure

## 🎯 Best Practices

1. **Always use the provided hooks** for notifications instead of direct store access
2. **Test components thoroughly** using the provided testing patterns
3. **Follow accessibility guidelines** when creating new components
4. **Use TypeScript strictly** for better developer experience
5. **Leverage the utility functions** for common operations
6. **Maintain consistent styling** using the design system

This component library provides a solid foundation for building modern, accessible, and performant React applications! 🚀
