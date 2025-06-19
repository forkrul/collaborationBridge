import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Shield, 
  Database, 
  Code, 
  Users, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star
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
              <span className="font-bold">8760</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/features" className="transition-colors hover:text-foreground/80">
                Features
              </Link>
              <Link href="/docs" className="transition-colors hover:text-foreground/80">
                Documentation
              </Link>
              <Link href="/api" className="transition-colors hover:text-foreground/80">
                API
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center space-y-8 py-24 md:py-32">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Badge variant="secondary" className="px-3 py-1">
            Modern Python Web Application
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Built with
            <span className="gradient-text block">FastAPI & React</span>
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            A comprehensive web application template featuring FastAPI backend, React frontend, 
            and modern development practices for rapid, scalable development.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/docs">
              View Documentation
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Production Ready</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Open Source</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Modern Development Stack
          </h2>
          <p className="max-w-[900px] text-lg text-muted-foreground">
            Built with the latest technologies and best practices for scalable, 
            maintainable, and secure web applications.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary" />
              <CardTitle>FastAPI Backend</CardTitle>
              <CardDescription>
                High-performance Python API with automatic OpenAPI documentation, 
                async support, and type safety.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-primary" />
              <CardTitle>React Frontend</CardTitle>
              <CardDescription>
                Modern React 18 with TypeScript, Next.js, and Tailwind CSS 
                for beautiful, responsive interfaces.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Database className="h-8 w-8 text-primary" />
              <CardTitle>Database Management</CardTitle>
              <CardDescription>
                SQLAlchemy 2.0 with async support, Alembic migrations, 
                and soft delete functionality.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary" />
              <CardTitle>Security First</CardTitle>
              <CardDescription>
                JWT authentication, password hashing, CORS configuration, 
                and security best practices built-in.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary" />
              <CardTitle>Monitoring & Observability</CardTitle>
              <CardDescription>
                Structured logging, health checks, metrics collection, 
                and comprehensive error tracking.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary" />
              <CardTitle>Developer Experience</CardTitle>
              <CardDescription>
                Complete testing suite, code quality tools, documentation, 
                and development environment setup.
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
                Ready to Build Something Amazing?
              </h2>
              <p className="max-w-[600px] text-lg text-muted-foreground">
                Start building your next web application with our comprehensive 
                template and modern development stack.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Start Building
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/docs">
                    Read Documentation
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
            <span className="font-semibold">8760</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 8760. Built with modern web technologies.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <Link href="/docs" className="hover:underline">
              Documentation
            </Link>
            <Link href="/api" className="hover:underline">
              API Reference
            </Link>
            <Link href="https://github.com/forkrul/8760" className="hover:underline">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
