/**
 * Debounce function that delays execution until after delay milliseconds
 * have elapsed since the last time it was invoked
 * 
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query)
 * }, 300)
 * 
 * debouncedSearch('hello') // Will only execute after 300ms of no more calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

/**
 * Debounce function with immediate execution option
 * 
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @param immediate - Execute immediately on first call
 * @returns Debounced function with cancel method
 */
export function debounceWithCancel<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate: boolean = false
) {
  let timeoutId: NodeJS.Timeout | null = null

  const debounced = (...args: Parameters<T>) => {
    const callNow = immediate && !timeoutId

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      timeoutId = null
      if (!immediate) func(...args)
    }, delay)

    if (callNow) func(...args)
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced
}
