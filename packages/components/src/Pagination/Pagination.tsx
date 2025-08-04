import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@company/core'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '../Button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Select'
import type { 
  BaseComponentProps, 
  StandardComponentSize 
} from '@company/core'

const paginationVariants = cva(
  'flex items-center justify-between',
  {
    variants: {
      variant: {
        default: '',
        simple: 'justify-center',
        compact: 'space-x-2',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface PaginationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paginationVariants>,
    BaseComponentProps {
  /** Current page (1-indexed) */
  currentPage: number
  /** Total number of pages */
  totalPages: number
  /** Callback when page changes */
  onPageChange: (page: number) => void
  /** Visual variant */
  variant?: 'default' | 'simple' | 'compact'
  /** Size variant */
  size?: StandardComponentSize
  /** Number of page buttons to show around current page */
  siblingCount?: number
  /** Whether to show first/last page buttons */
  showFirstLast?: boolean
  /** Whether to show previous/next buttons */
  showPrevNext?: boolean
  /** Whether to show page size selector */
  showPageSize?: boolean
  /** Current page size */
  pageSize?: number
  /** Available page sizes */
  pageSizes?: number[]
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void
  /** Total number of items */
  totalItems?: number
  /** Custom labels */
  labels?: {
    previous?: string
    next?: string
    first?: string
    last?: string
    page?: string
    of?: string
    items?: string
    showing?: string
    to?: string
  }
}

const defaultLabels = {
  previous: 'Previous',
  next: 'Next',
  first: 'First',
  last: 'Last',
  page: 'Page',
  of: 'of',
  items: 'items',
  showing: 'Showing',
  to: 'to',
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({
    className,
    currentPage,
    totalPages,
    onPageChange,
    variant = 'default',
    size = 'md',
    siblingCount = 1,
    showFirstLast = true,
    showPrevNext = true,
    showPageSize = false,
    pageSize = 10,
    pageSizes = [10, 20, 50, 100],
    onPageSizeChange,
    totalItems,
    labels = {},
    'data-testid': testId,
    ...props
  }, ref) => {
    const mergedLabels = { ...defaultLabels, ...labels }

    // Generate page numbers to display
    const getPageNumbers = () => {
      const pages: (number | 'ellipsis')[] = []
      
      if (totalPages <= 7) {
        // Show all pages if total is small
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Always show first page
        pages.push(1)
        
        // Calculate range around current page
        const startPage = Math.max(2, currentPage - siblingCount)
        const endPage = Math.min(totalPages - 1, currentPage + siblingCount)
        
        // Add ellipsis after first page if needed
        if (startPage > 2) {
          pages.push('ellipsis')
        }
        
        // Add pages around current page
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i)
        }
        
        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
          pages.push('ellipsis')
        }
        
        // Always show last page
        if (totalPages > 1) {
          pages.push(totalPages)
        }
      }
      
      return pages
    }

    const pageNumbers = getPageNumbers()
    const canGoPrevious = currentPage > 1
    const canGoNext = currentPage < totalPages

    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page)
      }
    }

    const renderPageButton = (page: number | 'ellipsis', index: number) => {
      if (page === 'ellipsis') {
        return (
          <div key={`ellipsis-${index}`} className="flex items-center justify-center w-8 h-8">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </div>
        )
      }

      const isActive = page === currentPage

      return (
        <Button
          key={page}
          variant={isActive ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handlePageChange(page)}
          className={cn(
            'w-8 h-8 p-0',
            isActive && 'pointer-events-none'
          )}
          aria-label={`${mergedLabels.page} ${page}`}
          aria-current={isActive ? 'page' : undefined}
        >
          {page}
        </Button>
      )
    }

    const renderSimpleVariant = () => (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!canGoPrevious}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {mergedLabels.previous}
        </Button>
        
        <span className="text-sm text-muted-foreground">
          {mergedLabels.page} {currentPage} {mergedLabels.of} {totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!canGoNext}
        >
          {mergedLabels.next}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    )

    const renderCompactVariant = () => (
      <div className="flex items-center space-x-1">
        {showPrevNext && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className="w-8 h-8 p-0"
            aria-label={mergedLabels.previous}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        {pageNumbers.map(renderPageButton)}
        
        {showPrevNext && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!canGoNext}
            className="w-8 h-8 p-0"
            aria-label={mergedLabels.next}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    )

    const renderDefaultVariant = () => (
      <>
        {/* Left side - Info and page size */}
        <div className="flex items-center space-x-4">
          {totalItems && (
            <div className="text-sm text-muted-foreground">
              {mergedLabels.showing} {((currentPage - 1) * pageSize) + 1} {mergedLabels.to}{' '}
              {Math.min(currentPage * pageSize, totalItems)} {mergedLabels.of} {totalItems} {mergedLabels.items}
            </div>
          )}
          
          {showPageSize && onPageSizeChange && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => onPageSizeChange(parseInt(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizes.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Right side - Navigation */}
        <div className="flex items-center space-x-1">
          {showFirstLast && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={!canGoPrevious}
              className="hidden sm:flex"
            >
              {mergedLabels.first}
            </Button>
          )}
          
          {showPrevNext && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!canGoPrevious}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {mergedLabels.previous}
            </Button>
          )}
          
          <div className="flex items-center space-x-1">
            {pageNumbers.map(renderPageButton)}
          </div>
          
          {showPrevNext && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!canGoNext}
            >
              {mergedLabels.next}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
          
          {showFirstLast && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={!canGoNext}
              className="hidden sm:flex"
            >
              {mergedLabels.last}
            </Button>
          )}
        </div>
      </>
    )

    return (
      <div
        ref={ref}
        className={cn(paginationVariants({ variant, size }), className)}
        role="navigation"
        aria-label="Pagination"
        data-testid={testId}
        {...props}
      >
        {variant === 'simple' && renderSimpleVariant()}
        {variant === 'compact' && renderCompactVariant()}
        {variant === 'default' && renderDefaultVariant()}
      </div>
    )
  }
)

Pagination.displayName = 'Pagination'

export { Pagination, paginationVariants }
