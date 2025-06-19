import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@company/core'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { Button } from '../Button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../Select'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '../Popover'
import { useTheme, type Theme } from '../ThemeProvider'
import type { 
  BaseComponentProps, 
  ComponentSize 
} from '@company/core'

const themeToggleVariants = cva(
  'transition-colors',
  {
    variants: {
      variant: {
        button: '',
        select: '',
        popover: '',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      variant: 'button',
      size: 'md',
    },
  }
)

export interface ThemeToggleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof themeToggleVariants>,
    BaseComponentProps {
  /** Visual variant of the theme toggle */
  variant?: 'button' | 'select' | 'popover'
  /** Size variant */
  size?: ComponentSize
  /** Whether to show labels */
  showLabels?: boolean
  /** Custom theme labels */
  labels?: Partial<Record<Theme, string>>
  /** Custom theme icons */
  icons?: Partial<Record<Theme, React.ReactNode>>
  /** Whether to show current theme indicator */
  showIndicator?: boolean
  /** Button variant when using button mode */
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'secondary'
}

const defaultLabels: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

const defaultIcons: Record<Theme, React.ReactNode> = {
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
  system: <Monitor className="h-4 w-4" />,
}

const ThemeToggle = React.forwardRef<HTMLDivElement, ThemeToggleProps>(
  ({
    className,
    variant = 'button',
    size = 'md',
    showLabels = false,
    labels = {},
    icons = {},
    showIndicator = true,
    buttonVariant = 'ghost',
    'data-testid': testId,
    ...props
  }, ref) => {
    const { theme, setTheme, themes } = useTheme()
    
    const themeLabels = { ...defaultLabels, ...labels }
    const themeIcons = { ...defaultIcons, ...icons }

    const cycleTheme = () => {
      const currentIndex = themes.indexOf(theme)
      const nextIndex = (currentIndex + 1) % themes.length
      setTheme(themes[nextIndex])
    }

    const renderButton = () => (
      <Button
        variant={buttonVariant}
        size={size}
        onClick={cycleTheme}
        className={cn('flex items-center space-x-2', className)}
        aria-label={`Switch to ${themeLabels[themes[(themes.indexOf(theme) + 1) % themes.length]]} theme`}
      >
        {themeIcons[theme]}
        {showLabels && <span>{themeLabels[theme]}</span>}
      </Button>
    )

    const renderSelect = () => (
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className={cn('w-auto min-w-[120px]', className)}>
          <div className="flex items-center space-x-2">
            {themeIcons[theme]}
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {themes.map((themeOption) => (
            <SelectItem key={themeOption} value={themeOption}>
              <div className="flex items-center space-x-2">
                {themeIcons[themeOption]}
                <span>{themeLabels[themeOption]}</span>
                {showIndicator && theme === themeOption && (
                  <Check className="h-3 w-3 ml-auto" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )

    const renderPopover = () => (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={buttonVariant}
            size={size}
            className={cn('flex items-center space-x-2', className)}
            aria-label="Change theme"
          >
            {themeIcons[theme]}
            {showLabels && <span>{themeLabels[theme]}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48" align="end">
          <div className="space-y-1">
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
              Theme
            </div>
            {themes.map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => setTheme(themeOption)}
                className={cn(
                  'w-full flex items-center space-x-2 px-2 py-1.5 text-sm rounded-sm transition-colors',
                  theme === themeOption
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {themeIcons[themeOption]}
                <span className="flex-1 text-left">{themeLabels[themeOption]}</span>
                {showIndicator && theme === themeOption && (
                  <Check className="h-3 w-3" />
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    )

    return (
      <div
        ref={ref}
        className={cn(themeToggleVariants({ variant, size }))}
        data-testid={testId}
        {...props}
      >
        {variant === 'button' && renderButton()}
        {variant === 'select' && renderSelect()}
        {variant === 'popover' && renderPopover()}
      </div>
    )
  }
)

ThemeToggle.displayName = 'ThemeToggle'

export { ThemeToggle, themeToggleVariants }
