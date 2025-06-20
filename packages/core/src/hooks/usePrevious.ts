import { useRef, useEffect } from 'react'

/**
 * Hook that returns the previous value of a state or prop
 * 
 * @param value - Current value
 * @returns Previous value
 * 
 * @example
 * const [count, setCount] = useState(0)
 * const previousCount = usePrevious(count)
 * 
 * console.log(`Current: ${count}, Previous: ${previousCount}`)
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}

/**
 * Hook that compares current and previous values
 * 
 * @param value - Current value
 * @param compare - Custom comparison function (default: strict equality)
 * @returns Object with current, previous values and changed flag
 * 
 * @example
 * const { current, previous, changed } = useCompare(user.id)
 * 
 * useEffect(() => {
 *   if (changed) {
 *     console.log(`User changed from ${previous} to ${current}`)
 *   }
 * }, [changed, current, previous])
 */
export function useCompare<T>(
  value: T,
  compare: (a: T | undefined, b: T) => boolean = (a, b) => a !== b
): {
  current: T
  previous: T | undefined
  changed: boolean
} {
  const previous = usePrevious(value)
  const changed = compare(previous, value)

  return {
    current: value,
    previous,
    changed,
  }
}
