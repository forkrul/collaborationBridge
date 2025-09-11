/**
 * Migration Components
 *
 * This module provides wrapper components that allow gradual migration
 * from shadcn/ui to Reshaped UI. Each component can be toggled between
 * the two systems using the `useReshaped` prop.
 *
 * Usage:
 * ```tsx
 * import { Button, Card, TextField, Select, Badge, Dialog } from '@/components/migration';
 *
 * // Use shadcn/ui (default)
 * <Button>Click me</Button>
 * <TextField name="email" placeholder="Enter email" />
 * <Select options={[{label: 'Option 1', value: '1'}]} />
 *
 * // Use Reshaped UI
 * <Button useReshaped>Click me</Button>
 * <TextField useReshaped name="email" placeholder="Enter email" />
 * <Select useReshaped options={[{label: 'Option 1', value: '1'}]} />
 * ```
 */

// Core migration components
export { CoexistenceProvider, useMigrationTheme } from './CoexistenceProvider';

// Phase 1 components (Button & Card)
export { MigratedButton as Button } from './MigratedButton';
export { MigratedCard as Card } from './MigratedCard';

// Phase 2 components (Form & UI elements)
export { MigratedTextField as TextField } from './MigratedTextField';
export { MigratedSelect as Select } from './MigratedSelect';
export { MigratedBadge as Badge } from './MigratedBadge';
export {
  MigratedDialog as Dialog,
  MigratedDialogTrigger as DialogTrigger,
  MigratedDialogContent as DialogContent,
} from './MigratedDialog';

// Re-export theme utilities
export { themeUtils } from '@/lib/reshaped-theme';
