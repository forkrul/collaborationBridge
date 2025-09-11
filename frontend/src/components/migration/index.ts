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
 *   Checkbox, Textarea, Progress, Switch,
 *   Table, TableRow, TableCell, TableHead,
 *   DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
 *   Breadcrumbs, BreadcrumbsItem, Pagination
 * } from '@/components/migration';
 *
 * // Use shadcn/ui (default)
 * <Button>Click me</Button>
 * <TextField name="email" placeholder="Enter email" />
 * <Table>
 *   <TableRow>
 *     <TableHead>Name</TableHead>
 *     <TableCell>John</TableCell>
 *   </TableRow>
 * </Table>
 *
 * // Use Reshaped UI
 * <Button useReshaped>Click me</Button>
 * <TextField useReshaped name="email" placeholder="Enter email" />
 * <Table useReshaped border columnBorder>
 *   <TableRow useReshaped highlighted>
 *     <TableHead useReshaped>Name</TableHead>
 *     <TableCell useReshaped>John</TableCell>
 *   </TableRow>
 * </Table>
 * <DropdownMenu useReshaped>
 *   <DropdownMenuTrigger useReshaped>
 *     {(attrs) => <Button useReshaped attributes={attrs}>Menu</Button>}
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent useReshaped>
 *     <DropdownMenuItem useReshaped>Action</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * <Breadcrumbs useReshaped>
 *   <BreadcrumbsItem useReshaped onClick={() => {}}>Home</BreadcrumbsItem>
 *   <BreadcrumbsItem useReshaped>Current</BreadcrumbsItem>
 * </Breadcrumbs>
 * <Pagination useReshaped total={10} onChange={({page}) => console.log(page)} />
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

// Phase 4 components (Final Components & Data Display)
export {
  MigratedTable as Table,
  MigratedTableRow as TableRow,
  MigratedTableCell as TableCell,
  MigratedTableHead as TableHead,
  TableBody,
  TableCaption,
  TableFooter,
  TableHeader,
} from './MigratedTable';
export {
  MigratedDropdownMenu as DropdownMenu,
  MigratedDropdownMenuTrigger as DropdownMenuTrigger,
  MigratedDropdownMenuContent as DropdownMenuContent,
  MigratedDropdownMenuItem as DropdownMenuItem,
  MigratedDropdownMenuSection as DropdownMenuSection,
  MigratedDropdownMenuSubMenu as DropdownMenuSubMenu,
  MigratedDropdownMenuSubTrigger as DropdownMenuSubTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSubContent,
} from './MigratedDropdownMenu';
export {
  MigratedBreadcrumbs as Breadcrumbs,
  MigratedBreadcrumbsItem as BreadcrumbsItem,
} from './MigratedBreadcrumbs';
export { MigratedPagination as Pagination } from './MigratedPagination';

// Re-export theme utilities
export { themeUtils } from '@/lib/reshaped-theme';
