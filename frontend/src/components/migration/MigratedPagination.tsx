'use client';

import React from 'react';
import { Pagination as ReshapedPagination } from 'reshaped';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MigratedPaginationProps {
  className?: string;
  
  // Common props
  total: number;
  page?: number;
  defaultPage?: number;
  onChange?: (args: { page: number }) => void;
  
  // Accessibility
  previousAriaLabel?: string;
  nextAriaLabel?: string;
  pageAriaLabel?: (args: { page: number }) => string;
  
  // Migration control
  useReshaped?: boolean;
  
  // Additional props
  [key: string]: any;
}

/**
 * MigratedPagination provides a gradual migration path from custom pagination to Reshaped Pagination
 * 
 * Note: shadcn/ui doesn't have a native Pagination component, so this primarily showcases
 * Reshaped Pagination with a basic fallback implementation.
 * 
 * Usage:
 * - Set useReshaped={true} to use Reshaped Pagination (recommended)
 * - Set useReshaped={false} for a basic pagination implementation
 */
export function MigratedPagination({
  className,
  total,
  page,
  defaultPage,
  onChange,
  previousAriaLabel = 'Previous page',
  nextAriaLabel = 'Next page',
  pageAriaLabel = (args) => `Page ${args.page}`,
  useReshaped = true, // Default to true since shadcn doesn't have Pagination
  ...props
}: MigratedPaginationProps) {
  
  if (useReshaped) {
    return (
      <ReshapedPagination
        total={total}
        page={page}
        defaultPage={defaultPage}
        onChange={onChange}
        previousAriaLabel={previousAriaLabel}
        nextAriaLabel={nextAriaLabel}
        pageAriaLabel={pageAriaLabel}
        className={cn(className)}
        {...props}
      />
    );
  }

  // Fallback implementation using basic pagination logic
  const [currentPage, setCurrentPage] = React.useState(defaultPage || page || 1);
  const isControlled = page !== undefined;
  const activePage = isControlled ? page : currentPage;

  const handlePageChange = (newPage: number) => {
    if (!isControlled) {
      setCurrentPage(newPage);
    }
    onChange?.({ page: newPage });
  };

  const canGoPrevious = activePage > 1;
  const canGoNext = activePage < total;

  // Generate page numbers to display
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 7; // Show up to 7 page numbers
    
    if (total <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (activePage > 3) {
        pages.push('ellipsis');
      }
      
      // Show pages around current page
      const start = Math.max(2, activePage - 1);
      const end = Math.min(total - 1, activePage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (activePage < total - 2) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      if (total > 1) {
        pages.push(total);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav 
      className={cn('flex items-center justify-center space-x-1', className)}
      aria-label="Pagination"
      {...props}
    >
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(activePage - 1)}
        disabled={!canGoPrevious}
        aria-label={previousAriaLabel}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      {visiblePages.map((pageNum, index) => {
        if (pageNum === 'ellipsis') {
          return (
            <span 
              key={`ellipsis-${index}`}
              className="flex h-8 w-8 items-center justify-center"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          );
        }

        const isActive = pageNum === activePage;
        
        return (
          <Button
            key={pageNum}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePageChange(pageNum)}
            aria-label={pageAriaLabel({ page: pageNum })}
            aria-current={isActive ? 'page' : undefined}
            className="h-8 w-8 p-0"
          >
            {pageNum}
          </Button>
        );
      })}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(activePage + 1)}
        disabled={!canGoNext}
        aria-label={nextAriaLabel}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

// Export both for convenience
export { MigratedPagination as Pagination };
