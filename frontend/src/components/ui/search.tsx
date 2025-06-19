"use client"

import * as React from "react"
import { Search, X, Filter, SlidersHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface SearchFilter {
  id: string
  label: string
  type: 'select' | 'checkbox' | 'range'
  options?: { value: string; label: string }[]
  value?: any
}

interface SearchProps {
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  onSearch?: (query: string, filters: Record<string, any>) => void
  filters?: SearchFilter[]
  showFilters?: boolean
  className?: string
  debounceMs?: number
}

export function SearchWithFilters({
  placeholder,
  value = "",
  onValueChange,
  onSearch,
  filters = [],
  showFilters = true,
  className,
  debounceMs = 300,
}: SearchProps) {
  const t = useTranslations('common')
  const [searchValue, setSearchValue] = React.useState(value)
  const [filterValues, setFilterValues] = React.useState<Record<string, any>>({})
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const debounceRef = React.useRef<NodeJS.Timeout>()

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
    setSearchValue("")
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
      return value !== undefined && value !== null && value !== "" && 
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
              value={value || ""}
              onValueChange={(newValue) => handleFilterChange(filter.id, newValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
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
            <div className="space-y-2">
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

      default:
        return null
    }
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder || t('search') || 'Search...'}
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-6 w-6 p-0"
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
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
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
                  
                  <div className="space-y-4">
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

// Simple search component without filters
export function Search({
  placeholder,
  value = "",
  onValueChange,
  className,
  ...props
}: Omit<SearchProps, 'filters' | 'showFilters'>) {
  return (
    <SearchWithFilters
      placeholder={placeholder}
      value={value}
      onValueChange={onValueChange}
      showFilters={false}
      className={className}
      {...props}
    />
  )
}
