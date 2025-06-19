import { useEffect, useRef } from 'react'

/**
 * Hook that detects clicks outside of a specified element
 * 
 * @param handler - Function to call when clicking outside
 * @param enabled - Whether the hook is enabled (default: true)
 * @returns Ref to attach to the element
 * 
 * @example
 * const [isOpen, setIsOpen] = useState(false)
 * const ref = useClickOutside(() => setIsOpen(false))
 * 
 * return (
 *   <div ref={ref}>
 *     {isOpen && <div>Dropdown content</div>}
 *   </div>
 * )
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): React.RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!enabled) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event)
      }
    }

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [handler, enabled])

  return ref
}

/**
 * Hook that detects clicks outside of multiple elements
 * 
 * @param handler - Function to call when clicking outside
 * @param refs - Array of refs to check
 * @param enabled - Whether the hook is enabled (default: true)
 * 
 * @example
 * const buttonRef = useRef<HTMLButtonElement>(null)
 * const menuRef = useRef<HTMLDivElement>(null)
 * 
 * useClickOutsideMultiple(
 *   () => setIsOpen(false),
 *   [buttonRef, menuRef]
 * )
 */
export function useClickOutsideMultiple(
  handler: (event: MouseEvent | TouchEvent) => void,
  refs: React.RefObject<HTMLElement>[],
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target as Node)
      )

      if (isOutside) {
        handler(event)
      }
    }

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [handler, refs, enabled])
}
