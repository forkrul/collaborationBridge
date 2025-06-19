# 8760 Frontend

Modern React frontend for the 8760 application built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **⚡ Next.js 14** - React framework with App Router
- **🎨 Tailwind CSS** - Utility-first CSS framework with dark mode
- **📱 Responsive Design** - Mobile-first approach
- **🔧 TypeScript** - Type safety and better developer experience
- **🎭 shadcn/ui** - Beautiful and accessible UI components
- **🔍 React Query** - Powerful data fetching and caching
- **🎯 Zustand** - Lightweight state management
- **🧪 Testing** - Jest, React Testing Library, and Playwright
- **📚 Storybook** - Component development and documentation
- **♿ Accessibility** - WCAG 2.1 AA compliance
- **🌙 Dark Mode** - Built-in dark/light theme support

## 📦 Tech Stack

### Core
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React

### State Management
- **Server State**: TanStack Query (React Query)
- **Client State**: Zustand
- **Forms**: React Hook Form + Zod validation

### Development
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier + Tailwind CSS plugin
- **Testing**: Jest + React Testing Library + Playwright
- **Documentation**: Storybook

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm 8+
- Backend API running on `http://localhost:8000`

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000

# App Configuration
NEXT_PUBLIC_APP_NAME="8760"
NEXT_PUBLIC_APP_DESCRIPTION="Modern Python web application"

# Theme
NEXT_PUBLIC_DEFAULT_THEME=dark
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css         # Global styles and CSS variables
│   │   ├── layout.tsx          # Root layout component
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── providers.tsx       # App providers (Theme, Query)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── stores/                 # Zustand stores
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── tests/                      # Test files
│   ├── __tests__/              # Jest unit tests
│   ├── e2e/                    # Playwright E2E tests
│   └── setup.ts               # Test setup
└── .storybook/                 # Storybook configuration
```

## 🎨 Design System

### Colors

The application uses a CSS variable-based color system that supports both light and dark themes:

- **Primary**: Blue variants for main actions
- **Secondary**: Gray variants for secondary elements
- **Destructive**: Red for dangerous actions
- **Muted**: Subtle backgrounds and disabled states
- **Accent**: Highlight colors for special elements

### Typography

- **Font Family**: Inter (system fallback)
- **Type Scale**: Responsive typography using Tailwind classes
- **Line Heights**: Optimized for readability

### Components

All UI components are built with:
- **Accessibility**: ARIA labels, keyboard navigation
- **Responsiveness**: Mobile-first design
- **Theming**: Dark/light mode support
- **Consistency**: Shared design tokens

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Component Testing

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

### Building

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📚 Component Library

The application uses shadcn/ui components which are:

- **Accessible**: Built on Radix UI primitives
- **Customizable**: Easy to modify and extend
- **Consistent**: Shared design system
- **Well-documented**: Each component has examples

### Adding New Components

```bash
# Add a new shadcn/ui component
npx shadcn-ui@latest add [component-name]
```

## 🎯 State Management

### Server State (React Query)

```typescript
import { useQuery } from '@tanstack/react-query';

function UserProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => api.getProfile(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data.name}</div>;
}
```

### Client State (Zustand)

```typescript
import { create } from 'zustand';

interface AppState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
```

## 🌙 Theme System

The application supports dark/light themes using next-themes:

```typescript
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  );
}
```

## ♿ Accessibility

The application follows WCAG 2.1 AA guidelines:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Focus Management**: Visible focus indicators
- **Responsive**: Works on all device sizes

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build Docker image
docker build -t 8760-frontend .

# Run container
docker run -p 3000:3000 8760-frontend
```

### Static Export

```bash
# Build static export
npm run build
npm run export
```

## 📖 API Integration

The frontend integrates with the FastAPI backend:

```typescript
// Example API service
class ApiService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL;

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    if (!response.ok) throw new Error('API Error');
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  }
}
```

## 🤝 Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Ensure accessibility compliance
5. Test in both light and dark themes

## 📄 License

This project is part of the 8760 application template.
