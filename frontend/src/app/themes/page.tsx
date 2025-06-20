'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useColorTheme } from '@/components/ui/theme-provider';
import { useNotifications } from '@/hooks/use-notifications';
import { themeConfigs, type ThemeConfig } from '@/lib/themes';
import { cn } from '@/lib/utils';
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react';

export default function ThemesPage() {
  const { colorTheme, setColorTheme, availableColorThemes } = useColorTheme();
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

  const handleThemeChange = (theme: string) => {
    setColorTheme(theme as any);
    showSuccess('Theme Changed', `Switched to ${themeConfigs[theme as keyof typeof themeConfigs].label} theme`);
  };

  const testNotifications = () => {
    showSuccess('Success!', 'This is a success notification');
    setTimeout(() => showError('Error!', 'This is an error notification'), 500);
    setTimeout(() => showWarning('Warning!', 'This is a warning notification'), 1000);
    setTimeout(() => showInfo('Info!', 'This is an info notification'), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6" />
            <span className="font-bold">Theme Showcase</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container py-8 space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Theme System</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive theme system with multiple color schemes and 
            dark/light mode support. All themes use CSS variables for easy customization.
          </p>
        </div>

        {/* Current Theme Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Current Theme</span>
            </CardTitle>
            <CardDescription>
              Currently using the {themeConfigs[colorTheme].label} color theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className={cn('w-8 h-8 rounded-full', themeConfigs[colorTheme].preview)} />
              <div>
                <div className="font-medium">{themeConfigs[colorTheme].label}</div>
                <div className="text-sm text-muted-foreground">
                  CSS Class: {themeConfigs[colorTheme].cssClass || 'default'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Available Themes</CardTitle>
            <CardDescription>
              Click on any theme to switch to it instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {availableColorThemes.map((theme) => {
                const config = themeConfigs[theme];
                const isActive = theme === colorTheme;
                
                return (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all hover:scale-105',
                      isActive 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="space-y-2">
                      <div className={cn('w-8 h-8 rounded-full mx-auto', config.preview)} />
                      <div className="text-sm font-medium">{config.label}</div>
                      {isActive && (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Component Showcase */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>
                Button variants with theme colors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>
                Input fields and form controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Enter some text..." />
              <Input 
                placeholder="Error state" 
                error="This field has an error"
              />
              <Input 
                placeholder="Success state" 
                variant="success"
              />
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Toast notifications with theme colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={testNotifications} className="w-full">
                Test All Notifications
              </Button>
            </CardContent>
          </Card>

          {/* Status Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Status Indicators</CardTitle>
              <CardDescription>
                Icons and badges with semantic colors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-5 w-5 text-success" />
                <span>Success state</span>
              </div>
              <div className="flex items-center space-x-4">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <span>Error state</span>
              </div>
              <div className="flex items-center space-x-4">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span>Warning state</span>
              </div>
              <div className="flex items-center space-x-4">
                <Info className="h-5 w-5 text-info" />
                <span>Info state</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>
              Current theme color variables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Primary', class: 'bg-primary text-primary-foreground' },
                { name: 'Secondary', class: 'bg-secondary text-secondary-foreground' },
                { name: 'Accent', class: 'bg-accent text-accent-foreground' },
                { name: 'Muted', class: 'bg-muted text-muted-foreground' },
                { name: 'Success', class: 'bg-success text-success-foreground' },
                { name: 'Warning', class: 'bg-warning text-warning-foreground' },
                { name: 'Error', class: 'bg-destructive text-destructive-foreground' },
                { name: 'Info', class: 'bg-info text-info-foreground' },
              ].map((color) => (
                <div key={color.name} className="space-y-2">
                  <div className={cn('h-16 rounded-lg flex items-center justify-center text-sm font-medium', color.class)}>
                    {color.name}
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    {color.name.toLowerCase()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Theme Features */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Features</CardTitle>
            <CardDescription>
              What makes our theme system powerful
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium">CSS Variables</h4>
                <p className="text-sm text-muted-foreground">
                  All colors use CSS custom properties for easy runtime switching
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Dark/Light Mode</h4>
                <p className="text-sm text-muted-foreground">
                  Each color theme supports both dark and light appearance modes
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Accessibility</h4>
                <p className="text-sm text-muted-foreground">
                  All themes meet WCAG contrast requirements including high contrast mode
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Persistent</h4>
                <p className="text-sm text-muted-foreground">
                  Theme preferences are saved to localStorage and restored on reload
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Extensible</h4>
                <p className="text-sm text-muted-foreground">
                  Easy to add new themes by extending the CSS variable system
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">No Hardcoded Values</h4>
                <p className="text-sm text-muted-foreground">
                  All components use semantic color tokens, no hardcoded hex values
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
