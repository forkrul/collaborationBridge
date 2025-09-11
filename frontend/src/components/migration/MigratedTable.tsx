'use client';

import React from 'react';
import { Table as ReshapedTable } from 'reshaped';
import { 
  Table as ShadcnTable,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface MigratedTableProps {
  children: React.ReactNode;
  className?: string;
  
  // Reshaped specific props
  border?: boolean;
  columnBorder?: boolean;
  
  // Migration control
  useReshaped?: boolean;
  
  // Additional props
  [key: string]: any;
}

/**
 * MigratedTable provides a gradual migration path from shadcn/ui Table to Reshaped Table
 * 
 * Usage:
 * - Set useReshaped={true} to use Reshaped Table
 * - Set useReshaped={false} or omit to use shadcn Table
 * - Props are automatically mapped between the two systems
 */
export function MigratedTable({
  children,
  className,
  border = false,
  columnBorder = false,
  useReshaped = false,
  ...props
}: MigratedTableProps) {
  
  if (useReshaped) {
    return (
      <ReshapedTable
        border={border}
        columnBorder={columnBorder}
        className={cn(className)}
        {...props}
      >
        {children}
      </ReshapedTable>
    );
  }

  // Use existing shadcn Table
  return (
    <ShadcnTable
      className={cn(className)}
      {...props}
    >
      {children}
    </ShadcnTable>
  );
}

// Table Row Component
interface MigratedTableRowProps {
  children: React.ReactNode;
  className?: string;
  highlighted?: boolean;
  useReshaped?: boolean;
  [key: string]: any;
}

export function MigratedTableRow({
  children,
  className,
  highlighted = false,
  useReshaped = false,
  ...props
}: MigratedTableRowProps) {
  
  if (useReshaped) {
    return (
      <ReshapedTable.Row
        highlighted={highlighted}
        className={cn(className)}
        {...props}
      >
        {children}
      </ReshapedTable.Row>
    );
  }

  // Use existing shadcn TableRow
  return (
    <TableRow
      className={cn(
        highlighted && 'bg-muted/50',
        className
      )}
      {...props}
    >
      {children}
    </TableRow>
  );
}

// Table Cell Component
interface MigratedTableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  align?: 'start' | 'center' | 'end';
  verticalAlign?: 'start' | 'center' | 'end';
  width?: number | string;
  minWidth?: number | string;
  padding?: number | string;
  paddingInline?: number | string;
  paddingBlock?: number | string;
  useReshaped?: boolean;
  [key: string]: any;
}

export function MigratedTableCell({
  children,
  className,
  colSpan,
  rowSpan,
  align,
  verticalAlign,
  width,
  minWidth,
  padding,
  paddingInline,
  paddingBlock,
  useReshaped = false,
  ...props
}: MigratedTableCellProps) {
  
  if (useReshaped) {
    return (
      <ReshapedTable.Cell
        colSpan={colSpan}
        rowSpan={rowSpan}
        align={align}
        verticalAlign={verticalAlign}
        width={width}
        minWidth={minWidth}
        padding={padding}
        paddingInline={paddingInline}
        paddingBlock={paddingBlock}
        className={cn(className)}
        {...props}
      >
        {children}
      </ReshapedTable.Cell>
    );
  }

  // Use existing shadcn TableCell with mapped styles
  const alignmentClasses = {
    start: 'text-left',
    center: 'text-center',
    end: 'text-right',
  };

  const verticalAlignmentClasses = {
    start: 'align-top',
    center: 'align-middle',
    end: 'align-bottom',
  };

  return (
    <TableCell
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={cn(
        align && alignmentClasses[align],
        verticalAlign && verticalAlignmentClasses[verticalAlign],
        className
      )}
      style={{
        width,
        minWidth,
        padding,
        paddingInline,
        paddingBlock,
      }}
      {...props}
    >
      {children}
    </TableCell>
  );
}

// Table Header Cell Component
interface MigratedTableHeadProps extends MigratedTableCellProps {}

export function MigratedTableHead({
  children,
  className,
  colSpan,
  rowSpan,
  align,
  verticalAlign,
  width,
  minWidth,
  padding,
  paddingInline,
  paddingBlock,
  useReshaped = false,
  ...props
}: MigratedTableHeadProps) {
  
  if (useReshaped) {
    return (
      <ReshapedTable.Heading
        colSpan={colSpan}
        rowSpan={rowSpan}
        align={align}
        verticalAlign={verticalAlign}
        width={width}
        minWidth={minWidth}
        padding={padding}
        paddingInline={paddingInline}
        paddingBlock={paddingBlock}
        className={cn(className)}
        {...props}
      >
        {children}
      </ReshapedTable.Heading>
    );
  }

  // Use existing shadcn TableHead with mapped styles
  const alignmentClasses = {
    start: 'text-left',
    center: 'text-center',
    end: 'text-right',
  };

  const verticalAlignmentClasses = {
    start: 'align-top',
    center: 'align-middle',
    end: 'align-bottom',
  };

  return (
    <TableHead
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={cn(
        align && alignmentClasses[align],
        verticalAlign && verticalAlignmentClasses[verticalAlign],
        className
      )}
      style={{
        width,
        minWidth,
        padding,
        paddingInline,
        paddingBlock,
      }}
      {...props}
    >
      {children}
    </TableHead>
  );
}

// Export compound components
export { 
  MigratedTable as Table,
  MigratedTableRow as TableRow,
  MigratedTableCell as TableCell,
  MigratedTableHead as TableHead,
  // Re-export shadcn components that don't need migration
  TableBody,
  TableCaption,
  TableFooter,
  TableHeader,
};
