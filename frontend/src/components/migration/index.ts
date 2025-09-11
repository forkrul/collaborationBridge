/**
 * Migration Components
 * 
 * This module provides wrapper components that allow gradual migration
 * from shadcn/ui to Reshaped UI. Each component can be toggled between
 * the two systems using the `useReshaped` prop.
 * 
 * Usage:
 * ```tsx
 * import { Button, Card } from '@/components/migration';
 * 
 * // Use shadcn/ui (default)
 * <Button>Click me</Button>
 * 
 * // Use Reshaped UI
 * <Button useReshaped>Click me</Button>
 * ```
 */

export { CoexistenceProvider, useMigrationTheme } from './CoexistenceProvider';
export { MigratedButton as Button } from './MigratedButton';
export { MigratedCard as Card } from './MigratedCard';

// Re-export theme utilities
export { themeUtils } from '@/lib/reshaped-theme';
