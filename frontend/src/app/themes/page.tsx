'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useColorTheme } from '@/components/ui/theme-provider';
import { useNotifications } from '@/hooks/use-notifications';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations();
  const { colorTheme, setColorTheme, availableColorThemes } = useColorTheme();
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

  const handleThemeChange = (theme: string) => {
    setColorTheme(theme as any);
    const themeKey = theme as keyof typeof themeConfigs;
    showSuccess(
      t('components.theme.themeChanged'),
      t('components.theme.switchedTo', { theme: themeConfigs[themeKey].label })
    );
  };

  const testNotifications = () => {
    showSuccess(t('components.notifications.success'), 'This is a success notification');
    setTimeout(() => showError(t('components.notifications.error'), 'This is an error notification'), 500);
    setTimeout(() => showWarning(t('components.notifications.warning'), 'This is a warning notification'), 1000);
    setTimeout(() => showInfo(t('components.notifications.info'), 'This is an info notification'), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6" />
            <span className="font-bold">{t('pages.themes.title')}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container py-8 space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{t('pages.themes.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive theme system with 9 color schemes including light, corporate, and soft dark themes.
            All themes support both dark and light appearance modes with CSS variables for easy customization.
          </p>
        </div>

        {/* Current Theme Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>{t('pages.themes.currentTheme')}</span>
            </CardTitle>
            <CardDescription>
              {t('pages.themes.currentlyUsing', { theme: themeConfigs[colorTheme].label })}
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

        {/* Theme Categories */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Light Themes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sun className="h-5 w-5" />
                <span>Light Themes</span>
              </CardTitle>
              <CardDescription>
                Bright and airy themes perfect for daytime use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {['blue', 'light', 'green', 'purple'].map((theme) => {
                const config = themeConfigs[theme as ColorTheme];
                const isActive = theme === colorTheme;

                return (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className={cn(
                      'w-full p-3 rounded-lg border-2 transition-all hover:scale-[1.02] flex items-center space-x-3',
                      isActive
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn('w-6 h-6 rounded-full', config.preview)} />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{config.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {theme === 'light' && 'Sky blue accents'}
                        {theme === 'blue' && 'Classic blue'}
                        {theme === 'green' && 'Nature inspired'}
                        {theme === 'purple' && 'Creative vibes'}
                      </div>
                    </div>
                    {isActive && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Professional Themes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Professional</span>
              </CardTitle>
              <CardDescription>
                Corporate and business-focused themes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {['corporate', 'high-contrast'].map((theme) => {
                const config = themeConfigs[theme as ColorTheme];
                const isActive = theme === colorTheme;

                return (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className={cn(
                      'w-full p-3 rounded-lg border-2 transition-all hover:scale-[1.02] flex items-center space-x-3',
                      isActive
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn('w-6 h-6 rounded-full', config.preview)} />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{config.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {theme === 'corporate' && 'Professional navy'}
                        {theme === 'high-contrast' && 'Maximum accessibility'}
                      </div>
                    </div>
                    {isActive && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Dark Themes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Moon className="h-5 w-5" />
                <span>Dark Themes</span>
              </CardTitle>
              <CardDescription>
                Easy on the eyes for extended use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {['dark-soft', 'orange', 'red'].map((theme) => {
                const config = themeConfigs[theme as ColorTheme];
                const isActive = theme === colorTheme;

                return (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className={cn(
                      'w-full p-3 rounded-lg border-2 transition-all hover:scale-[1.02] flex items-center space-x-3',
                      isActive
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn('w-6 h-6 rounded-full', config.preview)} />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{config.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {theme === 'dark-soft' && 'Soft navy background'}
                        {theme === 'orange' && 'Energetic orange'}
                        {theme === 'red' && 'Bold red accents'}
                      </div>
                    </div>
                    {isActive && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

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
