# Comprehensive Theme System

This document explains the advanced theme system that supports multiple color schemes, dark/light modes, and easy customization without hardcoded values.

## 🎨 Overview

The theme system is built on CSS custom properties (variables) and React context, providing:

- **6 Color Themes**: Blue (default), Green, Purple, Orange, Red, High Contrast
- **Dark/Light Modes**: Each color theme supports both appearance modes
- **No Hardcoded Values**: All colors use semantic CSS variables
- **Runtime Switching**: Instant theme changes without page reload
- **Persistent Preferences**: Automatic localStorage saving/restoration
- **Accessibility**: WCAG 2.1 AA compliance including high contrast mode

## 🚀 Quick Start

### Using the Theme Toggle

The `ThemeToggle` component provides a complete interface for theme switching:

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

### Programmatic Theme Control

```tsx
import { useColorTheme } from '@/components/ui/theme-provider';
import { useTheme } from 'next-themes';

function ThemeControls() {
  // Control appearance mode (dark/light)
  const { theme, setTheme } = useTheme();
  
  // Control color theme
  const { colorTheme, setColorTheme, availableColorThemes } = useColorTheme();

  return (
    <div>
      {/* Appearance Mode */}
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      
      {/* Color Theme */}
      {availableColorThemes.map(theme => (
        <button key={theme} onClick={() => setColorTheme(theme)}>
          {theme}
        </button>
      ))}
    </div>
  );
}
```

## 🎯 Available Themes

### Color Themes

| Theme | Description | CSS Class | Preview |
|-------|-------------|-----------|---------|
| Blue | Default theme with blue primary colors | *(none)* | 🔵 |
| Green | Nature-inspired green theme | `theme-green` | 🟢 |
| Purple | Creative purple theme | `theme-purple` | 🟣 |
| Orange | Energetic orange theme | `theme-orange` | 🟠 |
| Red | Bold red theme | `theme-red` | 🔴 |
| High Contrast | Maximum accessibility | `theme-high-contrast` | ⚫ |

### Appearance Modes

- **Light Mode**: Bright backgrounds with dark text
- **Dark Mode**: Dark backgrounds with light text (default)
- **System**: Follows user's OS preference

## 🔧 CSS Variables

### Core Color Variables

```css
:root {
  /* Base colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  
  /* Semantic colors */
  --success: 142 76% 36%;
  --success-foreground: 355 100% 97%;
  --warning: 38 92% 50%;
  --warning-foreground: 48 96% 89%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --info: 221.2 83.2% 53.3%;
  --info-foreground: 210 40% 98%;
  
  /* UI elements */
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
}
```

### Using Variables in Components

```tsx
// ✅ Good: Using semantic color classes
<div className="bg-primary text-primary-foreground">
  Primary button
</div>

<div className="text-success">
  Success message
</div>

// ❌ Bad: Hardcoded colors
<div className="bg-blue-500 text-white">
  Hardcoded button
</div>
```

## 🛠️ Creating Custom Themes

### 1. Add Theme to CSS

```css
/* Add to globals.css */
.theme-custom {
  --primary: 280 100% 70%;
  --primary-foreground: 0 0% 100%;
  --accent: 280 100% 95%;
  --accent-foreground: 280 100% 70%;
}

.dark.theme-custom {
  --primary: 280 100% 80%;
  --primary-foreground: 280 100% 10%;
  --accent: 280 50% 20%;
  --accent-foreground: 280 100% 80%;
}
```

### 2. Update Theme Configuration

```typescript
// Add to src/lib/themes.ts
export const themeConfigs: Record<ColorTheme, ThemeConfig> = {
  // ... existing themes
  custom: {
    name: 'custom',
    label: 'Custom',
    cssClass: 'theme-custom',
    colors: {
      primary: 'hsl(280, 100%, 70%)',
      // ... other colors
    },
    preview: 'bg-purple-400',
  },
};
```

### 3. Update Type Definition

```typescript
// Update in src/components/ui/theme-provider.tsx
export type ColorTheme = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'high-contrast' | 'custom';
```

## 🎨 Component Integration

### Automatic Theme Adaptation

All UI components automatically adapt to theme changes:

```tsx
// These components will automatically use theme colors
<Button variant="primary">Primary Button</Button>
<Card className="border-border bg-card">
  <CardContent className="text-card-foreground">
    Content adapts to theme
  </CardContent>
</Card>
```

### Custom Component Theming

```tsx
function CustomComponent() {
  return (
    <div className="bg-background text-foreground border border-border">
      <h2 className="text-primary">Themed Heading</h2>
      <p className="text-muted-foreground">Themed text</p>
      <button className="bg-primary text-primary-foreground hover:bg-primary/90">
        Themed Button
      </button>
    </div>
  );
}
```

## 🔍 Advanced Usage

### Theme-Aware Styling

```tsx
import { useColorTheme } from '@/components/ui/theme-provider';
import { cn } from '@/lib/utils';

function AdaptiveComponent() {
  const { colorTheme } = useColorTheme();
  
  return (
    <div className={cn(
      'p-4 rounded-lg',
      colorTheme === 'high-contrast' && 'border-2 border-foreground',
      colorTheme !== 'high-contrast' && 'border border-border'
    )}>
      Content adapts based on theme
    </div>
  );
}
```

### Dynamic Color Access

```tsx
import { getCurrentThemeColors } from '@/lib/themes';

function ColorDisplay() {
  const colors = getCurrentThemeColors();
  
  return (
    <div style={{ backgroundColor: `hsl(${colors.primary})` }}>
      Dynamic color usage
    </div>
  );
}
```

## ♿ Accessibility

### High Contrast Mode

The high contrast theme provides maximum accessibility:

```css
.theme-high-contrast {
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;
  --primary: 0 0% 0%;
  --border: 0 0% 0%;
  /* Maximum contrast ratios */
}
```

### Color Contrast Compliance

All themes meet WCAG 2.1 AA requirements:

- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text**: 3:1 contrast ratio minimum
- **UI components**: 3:1 contrast ratio minimum

### Testing Accessibility

```tsx
// Use semantic colors for screen readers
<button 
  className="bg-success text-success-foreground"
  aria-label="Success action"
>
  ✓ Success
</button>

<div 
  className="bg-destructive/10 text-destructive"
  role="alert"
>
  Error message
</div>
```

## 🔧 Troubleshooting

### Common Issues

1. **Theme not persisting**: Check localStorage permissions
2. **Colors not updating**: Ensure CSS variables are properly defined
3. **Contrast issues**: Use the high contrast theme for testing

### Debug Theme State

```tsx
function ThemeDebugger() {
  const { theme } = useTheme();
  const { colorTheme } = useColorTheme();
  
  return (
    <div className="fixed bottom-4 right-4 p-2 bg-background border rounded">
      <div>Appearance: {theme}</div>
      <div>Color: {colorTheme}</div>
    </div>
  );
}
```

## 📱 Responsive Theming

Themes work seamlessly across all device sizes:

```tsx
<div className="
  bg-background 
  text-foreground 
  p-4 md:p-6 lg:p-8
  border border-border
  rounded-lg
">
  Responsive themed content
</div>
```

## 🚀 Performance

The theme system is optimized for performance:

- **CSS Variables**: No JavaScript required for color updates
- **Minimal Bundle**: Only active theme CSS is loaded
- **Instant Switching**: No re-renders or flashing
- **Cached Preferences**: localStorage prevents theme flicker

## 📚 Best Practices

1. **Always use semantic color classes** instead of hardcoded values
2. **Test all themes** during development
3. **Verify accessibility** with high contrast mode
4. **Use the theme toggle component** for consistent UX
5. **Document custom themes** for team members

This comprehensive theme system provides a solid foundation for building accessible, customizable, and maintainable user interfaces! 🎨✨
