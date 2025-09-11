/**
 * Migration Components
 *
 * This module provides wrapper components that allow gradual migration
 * from shadcn/ui to Reshaped UI. Each component can be toggled between
 * the two systems using the `useReshaped` prop.
 *
 * Usage:
 * ```tsx
 * import {
 *   Button, Card, TextField, Select, Badge, Dialog,
 *   Checkbox, Textarea, Progress, Switch
 * } from '@/components/migration';
 *
 * // Use shadcn/ui (default)
 * <Button>Click me</Button>
 * <TextField name="email" placeholder="Enter email" />
 * <Checkbox name="agree" value="yes">I agree</Checkbox>
 * <Textarea name="message" placeholder="Your message" />
 * <Progress value={50} />
 *
 * // Use Reshaped UI
 * <Button useReshaped>Click me</Button>
 * <TextField useReshaped name="email" placeholder="Enter email" />
 * <Checkbox useReshaped name="agree" value="yes">I agree</Checkbox>
 * <Textarea useReshaped name="message" placeholder="Your message" />
 * <Progress useReshaped value={50} color="primary" />
 * <Switch useReshaped name="notifications">Enable notifications</Switch>
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

// Phase 3 components (Advanced Form & UI elements)
export {
  MigratedCheckbox as Checkbox,
  MigratedCheckboxGroup as CheckboxGroup,
} from './MigratedCheckbox';
export { MigratedTextarea as Textarea } from './MigratedTextarea';
export { MigratedProgress as Progress } from './MigratedProgress';
export { MigratedSwitch as Switch } from './MigratedSwitch';

// Re-export theme utilities
export { themeUtils } from '@/lib/reshaped-theme';
