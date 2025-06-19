import { useState, useEffect } from 'react'

/**
 * Hook that debounces a value
 * 
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 300)
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Perform search
 *   }
 * }, [debouncedSearchTerm])
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook that debounces a callback function
 * 
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @param deps - Dependencies array
 * @returns Debounced callback function
 * 
 * @example
 * const debouncedSearch = useDebouncedCallback(
 *   (query: string) => performSearch(query),
 *   300,
 *   []
 * )
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList
): (...args: Parameters<T>) => void {
  const [debouncedCallback, setDebouncedCallback] = useState<(...args: Parameters<T>) => void>(
    () => callback
  )

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [callback, delay, ...deps])

  return debouncedCallback
}
