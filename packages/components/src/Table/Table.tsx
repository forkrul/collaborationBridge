import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@company/core'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import type { 
  BaseComponentProps, 
  ComponentWithChildren,
  StandardComponentSize 
} from '@company/core'

const tableVariants = cva(
  'w-full caption-bottom text-sm',
  {
    variants: {
      variant: {
        default: '',
        striped: '[&_tbody_tr:nth-child(odd)]:bg-muted/50',
        bordered: 'border border-border',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Visual variant of the table */
  variant?: 'default' | 'striped' | 'bordered'
  /** Size variant of the table */
  size?: StandardComponentSize
  /** Whether the table is scrollable */
  scrollable?: boolean
  /** Custom container className */
  containerClassName?: string
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ 
    className, 
    variant, 
    size, 
    scrollable = true, 
    containerClassName,
    'data-testid': testId,
    ...props 
  }, ref) => {
    const tableElement = (
      <table
        ref={ref}
        className={cn(tableVariants({ variant, size }), className)}
        data-testid={testId}
        {...props}
      />
    )

    if (scrollable) {
      return (
        <div className={cn('relative w-full overflow-auto', containerClassName)}>
          {tableElement}
        </div>
      )
    }

    return tableElement
  }
)
Table.displayName = 'Table'

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <thead 
      ref={ref} 
      className={cn('[&_tr]:border-b', className)} 
      data-testid={testId}
      {...props} 
    />
  )
)
TableHeader.displayName = 'TableHeader'

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      data-testid={testId}
      {...props}
    />
  )
)
TableBody.displayName = 'TableBody'

export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
        className
      )}
      data-testid={testId}
      {...props}
    />
  )
)
TableFooter.displayName = 'TableFooter'

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Whether the row is selected */
  selected?: boolean
  /** Whether the row is clickable */
  clickable?: boolean
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, clickable, 'data-testid': testId, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-muted/50',
        selected && 'bg-muted data-[state=selected]:bg-muted',
        clickable && 'cursor-pointer',
        className
      )}
      data-state={selected ? 'selected' : undefined}
      data-testid={testId}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Whether the column is sortable */
  sortable?: boolean
  /** Current sort direction */
  sortDirection?: 'asc' | 'desc' | null
  /** Sort click handler */
  onSort?: () => void
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ 
    className, 
    children,
    sortable, 
    sortDirection, 
    onSort,
    'data-testid': testId,
    ...props 
  }, ref) => {
    const content = sortable ? (
      <button
        type="button"
        className="flex items-center gap-2 hover:text-foreground"
        onClick={onSort}
      >
        {children}
        {sortDirection === 'asc' && <ChevronUp className="h-4 w-4" />}
        {sortDirection === 'desc' && <ChevronDown className="h-4 w-4" />}
        {sortDirection === null && <ChevronsUpDown className="h-4 w-4" />}
      </button>
    ) : children

    return (
      <th
        ref={ref}
        className={cn(
          'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
          sortable && 'cursor-pointer select-none',
          className
        )}
        data-testid={testId}
        {...props}
      >
        {content}
      </th>
    )
  }
)
TableHead.displayName = 'TableHead'

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
      data-testid={testId}
      {...props}
    />
  )
)
TableCell.displayName = 'TableCell'

export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement>,
    BaseComponentProps,
    ComponentWithChildren {}

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, 'data-testid': testId, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      data-testid={testId}
      {...props}
    />
  )
)
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableVariants,
}
