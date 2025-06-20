import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  Zap, 
  Shield, 
  Database, 
  Code, 
  Users, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Palette
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Zap className="h-6 w-6" />
              <span className="font-bold">App</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/themes" className="transition-colors hover:text-foreground/80">
                Themes
              </Link>
              <Link href="/docs" className="transition-colors hover:text-foreground/80">
                Documentation
              </Link>
              <Link href="/api" className="transition-colors hover:text-foreground/80">
                API
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center space-y-8 py-24 md:py-32">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Badge variant="secondary" className="px-3 py-1">
            Modern Web Application Template
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Comprehensive
            <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Theme System
            </span>
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            A complete React application template with advanced theming, multiple color schemes, 
            and comprehensive component library for rapid development.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/themes">
              <Palette className="mr-2 h-4 w-4" />
              Explore Themes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/dashboard">
              View Dashboard
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>6 Color Themes</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>Dark/Light Mode</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>CSS Variables</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Advanced Theme Features
          </h2>
          <p className="max-w-[900px] text-lg text-muted-foreground">
            Built with modern CSS variables and React context for seamless theme switching 
            without hardcoded values.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Palette className="h-8 w-8 text-primary" />
              <CardTitle>Multiple Color Themes</CardTitle>
              <CardDescription>
                6 carefully crafted color themes including blue, green, purple, 
                orange, red, and high contrast mode.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-primary" />
              <CardTitle>CSS Variables</CardTitle>
              <CardDescription>
                All colors use CSS custom properties for runtime switching 
                without page reloads or hardcoded values.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Database className="h-8 w-8 text-primary" />
              <CardTitle>Persistent Preferences</CardTitle>
              <CardDescription>
                Theme preferences are automatically saved to localStorage 
                and restored on page reload.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary" />
              <CardTitle>Accessibility First</CardTitle>
              <CardDescription>
                All themes meet WCAG 2.1 AA contrast requirements with 
                special high contrast mode for enhanced accessibility.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary" />
              <CardTitle>Component Integration</CardTitle>
              <CardDescription>
                All UI components automatically adapt to theme changes 
                using semantic color tokens.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary" />
              <CardTitle>Developer Experience</CardTitle>
              <CardDescription>
                Easy to extend with new themes and customize existing ones 
                through the comprehensive theme configuration system.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <Card className="relative overflow-hidden">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to Explore?
              </h2>
              <p className="max-w-[600px] text-lg text-muted-foreground">
                Experience the power of our theme system with live examples 
                and interactive demonstrations.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/themes">
                    <Palette className="mr-2 h-4 w-4" />
                    Theme Showcase
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">
                    Try Demo Login
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span className="font-semibold">App</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 App. Built with modern web technologies.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <Link href="/themes" className="hover:underline">
              Themes
            </Link>
            <Link href="/docs" className="hover:underline">
              Documentation
            </Link>
            <Link href="/api" className="hover:underline">
              API Reference
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
