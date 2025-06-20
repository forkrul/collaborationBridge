# Component Library

A comprehensive, accessible, and internationalized component library built with React, TypeScript, and Tailwind CSS.

## 🎯 Overview

This component library provides a complete set of UI components designed for modern web applications with:

- **🌐 Full i18n Support**: All components work seamlessly with our 6-language system
- **♿ Accessibility First**: WCAG 2.1 AA compliant with proper ARIA attributes
- **🎨 Consistent Design**: Built on a cohesive design system with Tailwind CSS
- **📱 Responsive**: Mobile-first approach with responsive breakpoints
- **🎭 Theme Support**: Dark/light/system theme modes
- **⚡ Performance**: Optimized with proper code splitting and lazy loading

## 📁 Component Categories

### Base Components (`/ui`)
Core building blocks for the application:

- **Button**: Various styles, sizes, and states
- **Card**: Content containers with headers and footers
- **Input**: Text inputs with validation states
- **Label**: Accessible form labels
- **Checkbox**: Checkboxes with indeterminate state
- **Toast**: Notification system

### Form Components (`/ui`)
Advanced form handling with validation:

- **Form**: React Hook Form integration with Zod validation
- **FormField**: Field wrapper with validation
- **FormItem**: Form item container
- **FormLabel**: Accessible form labels
- **FormControl**: Form control wrapper
- **FormMessage**: Error and help text
- **Select**: Dropdown selection with search
- **Textarea**: Multi-line text input

### Navigation Components (`/ui`)
Navigation and wayfinding:

- **NavigationMenu**: Dropdown navigation menus
- **Breadcrumb**: Hierarchical navigation
- **Pagination**: Data pagination controls

### Data Display (`/ui`)
Components for displaying structured data:

- **Table**: Data tables with sorting and filtering
- **Progress**: Progress indicators and loading states

### Feedback Components (`/ui`)
User feedback and interaction:

- **Dialog**: Modal dialogs and confirmations
- **DropdownMenu**: Context menus and actions

### Layout Components (`/layout`)
Page structure and organization:

- **Header**: Application header with navigation and user menu
- **Sidebar**: Collapsible sidebar navigation

### Internationalization (`/i18n`)
Language and localization:

- **LanguageSwitcher**: Language selection component

## 🚀 Usage Examples

### Basic Form with Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

function ContactForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', name: '' },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Data Table with Pagination

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

function UserTable({ users }) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
```

### Layout with Header and Sidebar

```tsx
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## 🌐 Internationalization

All components support internationalization through the `next-intl` system:

```tsx
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

function MyComponent() {
  const t = useTranslations('common');
  
  return (
    <Button>{t('save')}</Button>
  );
}
```

## ♿ Accessibility

All components follow WCAG 2.1 AA guidelines:

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and descriptions
- **Focus Management**: Visible focus indicators
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Semantic HTML**: Proper HTML structure and roles

## 🎨 Theming

Components support dark/light/system themes:

```tsx
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <div>
        <ThemeToggle />
        {/* Your app content */}
      </div>
    </ThemeProvider>
  );
}
```

## 🧪 Testing

Components include comprehensive tests:

```bash
# Run component tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific component tests
npm test -- Header.test.tsx
```

## 📱 Responsive Design

All components are built mobile-first with responsive breakpoints:

- **sm**: 640px and up
- **md**: 768px and up
- **lg**: 1024px and up
- **xl**: 1280px and up
- **2xl**: 1536px and up

## 🔧 Customization

Components can be customized through:

1. **CSS Classes**: Override with Tailwind utilities
2. **CSS Variables**: Modify design tokens
3. **Component Props**: Configure behavior and appearance
4. **Theme Configuration**: Adjust colors and spacing

## 📚 Documentation

- **Component Showcase**: `/components` - Interactive component examples
- **Storybook**: Coming soon - Isolated component development
- **API Reference**: TypeScript definitions provide inline documentation

## 🚀 Performance

- **Code Splitting**: Components are automatically split by Next.js
- **Tree Shaking**: Unused components are eliminated from bundles
- **Lazy Loading**: Non-critical components load on demand
- **Bundle Analysis**: Regular monitoring of component bundle sizes
