/**
 * Throttle function that limits execution to at most once per delay milliseconds
 * 
 * @param func - Function to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled function
 * 
 * @example
 * const throttledScroll = throttle((event: Event) => {
 *   console.log('Scroll event:', event)
 * }, 100)
 * 
 * window.addEventListener('scroll', throttledScroll)
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

/**
 * Throttle function with leading and trailing execution options
 * 
 * @param func - Function to throttle
 * @param delay - Delay in milliseconds
 * @param options - Configuration options
 * @returns Throttled function with cancel method
 */
export function throttleWithOptions<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options: {
    leading?: boolean
    trailing?: boolean
  } = {}
) {
  const { leading = true, trailing = true } = options
  let lastCall = 0
  let timeoutId: NodeJS.Timeout | null = null
  let lastArgs: Parameters<T> | null = null

  const throttled = (...args: Parameters<T>) => {
    const now = Date.now()
    lastArgs = args

    if (!lastCall && !leading) {
      lastCall = now
    }

    const remaining = delay - (now - lastCall)

    if (remaining <= 0 || remaining > delay) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      lastCall = now
      func(...args)
      lastArgs = null
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        lastCall = leading ? Date.now() : 0
        timeoutId = null
        if (lastArgs) {
          func(...lastArgs)
          lastArgs = null
        }
      }, remaining)
    }
  }

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    lastCall = 0
    lastArgs = null
  }

  return throttled
}
