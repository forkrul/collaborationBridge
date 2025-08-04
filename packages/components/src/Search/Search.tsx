import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, generateId } from '@company/core'
import { Search as SearchIcon, X, SlidersHorizontal, Loader2 } from 'lucide-react'
import { Input } from '../Input'
import { Button } from '../Button'
import { Badge } from '../Badge'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Select'
import { Checkbox } from '../Checkbox'
import type { 
  BaseComponentProps, 
  StandardComponentSize 
} from '@company/core'

const searchVariants = cva(
  'relative',
  {
    variants: {
      variant: {
        default: '',
        filled: 'bg-muted/50 rounded-lg p-2',
        bordered: 'border rounded-lg p-2',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface SearchFilter {
  /** Unique filter identifier */
  id: string
  /** Filter label */
  label: string
  /** Filter type */
  type: 'select' | 'checkbox' | 'range' | 'text'
  /** Filter options for select/checkbox types */
  options?: { value: string; label: string }[]
  /** Current filter value */
  value?: any
  /** Placeholder for text filters */
  placeholder?: string
}

export interface SearchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof searchVariants>,
    BaseComponentProps {
  /** Search input placeholder */
  placeholder?: string
  /** Current search value */
  value?: string
  /** Callback when search value changes */
  onValueChange?: (value: string) => void
  /** Callback when search is performed */
  onSearch?: (query: string, filters: Record<string, any>) => void
  /** Array of available filters */
  filters?: SearchFilter[]
  /** Whether to show filters */
  showFilters?: boolean
  /** Visual variant */
  variant?: 'default' | 'filled' | 'bordered'
  /** Size variant */
  size?: StandardComponentSize
  /** Debounce delay in milliseconds */
  debounceMs?: number
  /** Whether search is loading */
  loading?: boolean
  /** Whether to show clear button */
  showClear?: boolean
  /** Custom search icon */
  searchIcon?: React.ReactNode
  /** Whether to auto-focus the input */
  autoFocus?: boolean
}

const Search = React.forwardRef<HTMLDivElement, SearchProps>(
  ({
    className,
    placeholder = 'Search...',
    value = '',
    onValueChange,
    onSearch,
    filters = [],
    showFilters = true,
    variant,
    size,
    debounceMs = 300,
    loading = false,
    showClear = true,
    searchIcon,
    autoFocus = false,
    'data-testid': testId,
    ...props
  }, ref) => {
    const [searchValue, setSearchValue] = React.useState(value)
    const [filterValues, setFilterValues] = React.useState<Record<string, any>>({})
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const debounceRef = React.useRef<NodeJS.Timeout>()
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Sync external value changes
    React.useEffect(() => {
      setSearchValue(value)
    }, [value])

    // Auto-focus
    React.useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus()
      }
    }, [autoFocus])

    // Debounced search
    React.useEffect(() => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        onValueChange?.(searchValue)
        onSearch?.(searchValue, filterValues)
      }, debounceMs)

      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current)
        }
      }
    }, [searchValue, filterValues, onValueChange, onSearch, debounceMs])

    const handleSearchChange = (newValue: string) => {
      setSearchValue(newValue)
    }

    const handleFilterChange = (filterId: string, value: any) => {
      setFilterValues(prev => ({
        ...prev,
        [filterId]: value
      }))
    }

    const clearSearch = () => {
      setSearchValue('')
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    const clearFilter = (filterId: string) => {
      setFilterValues(prev => {
        const newFilters = { ...prev }
        delete newFilters[filterId]
        return newFilters
      })
    }

    const clearAllFilters = () => {
      setFilterValues({})
    }

    const getActiveFiltersCount = () => {
      return Object.keys(filterValues).filter(key => {
        const value = filterValues[key]
        return value !== undefined && value !== null && value !== '' && 
               (Array.isArray(value) ? value.length > 0 : true)
      }).length
    }

    const renderFilter = (filter: SearchFilter) => {
      const value = filterValues[filter.id]

      switch (filter.type) {
        case 'select':
          return (
            <div key={filter.id} className="space-y-2">
              <label className="text-sm font-medium">{filter.label}</label>
              <Select
                value={value || ''}
                onValueChange={(newValue) => handleFilterChange(filter.id, newValue)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option..." />
                </SelectTrigger>
                <SelectContent>
                  {filter.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )

        case 'checkbox':
          return (
            <div key={filter.id} className="space-y-2">
              <label className="text-sm font-medium">{filter.label}</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filter.options?.map((option) => {
                  const isChecked = Array.isArray(value) ? value.includes(option.value) : false
                  
                  return (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${filter.id}-${option.value}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const currentValues = Array.isArray(value) ? value : []
                          if (checked) {
                            handleFilterChange(filter.id, [...currentValues, option.value])
                          } else {
                            handleFilterChange(filter.id, currentValues.filter(v => v !== option.value))
                          }
                        }}
                      />
                      <label
                        htmlFor={`${filter.id}-${option.value}`}
                        className="text-sm cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          )

        case 'text':
          return (
            <div key={filter.id} className="space-y-2">
              <label className="text-sm font-medium">{filter.label}</label>
              <Input
                placeholder={filter.placeholder}
                value={value || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                size="sm"
              />
            </div>
          )

        default:
          return null
      }
    }

    const activeFiltersCount = getActiveFiltersCount()

    return (
      <div
        ref={ref}
        className={cn(searchVariants({ variant, size }), 'space-y-4', className)}
        data-testid={testId}
        {...props}
      >
        {/* Search Input */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              searchIcon || <SearchIcon className="h-4 w-4" />
            )}
          </div>
          
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-20"
            size={size}
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {showClear && searchValue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-6 w-6 p-0"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            
            {showFilters && filters.length > 0 && (
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 relative"
                    aria-label="Open filters"
                  >
                    <SlidersHorizontal className="h-3 w-3" />
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="error"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filters</h4>
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="h-auto p-1 text-xs"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {filters.map(renderFilter)}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(filterValues).map(([filterId, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null
              
              const filter = filters.find(f => f.id === filterId)
              if (!filter) return null

              const displayValue = Array.isArray(value) 
                ? value.join(', ')
                : filter.options?.find(opt => opt.value === value)?.label || value

              return (
                <Badge
                  key={filterId}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span className="text-xs">
                    {filter.label}: {displayValue}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter(filterId)}
                    className="h-3 w-3 p-0 ml-1"
                    aria-label={`Remove ${filter.label} filter`}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )
            })}
          </div>
        )}
      </div>
    )
  }
)

Search.displayName = 'Search'

export { Search, searchVariants }
