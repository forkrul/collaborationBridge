import { useState, useCallback } from 'react'

/**
 * Hook for managing boolean toggle state
 * 
 * @param initialValue - Initial boolean value (default: false)
 * @returns [value, toggle, setTrue, setFalse, setValue]
 * 
 * @example
 * const [isOpen, toggle, open, close, setIsOpen] = useToggle(false)
 * 
 * return (
 *   <div>
 *     <button onClick={toggle}>Toggle</button>
 *     <button onClick={open}>Open</button>
 *     <button onClick={close}>Close</button>
 *     {isOpen && <div>Content</div>}
 *   </div>
 * )
 */
export function useToggle(
  initialValue: boolean = false
): [
  boolean,
  () => void,
  () => void,
  () => void,
  (value: boolean) => void
] {
  const [value, setValue] = useState<boolean>(initialValue)

  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  return [value, toggle, setTrue, setFalse, setValue]
}

/**
 * Hook for managing multiple boolean toggles
 * 
 * @param initialValues - Object with initial boolean values
 * @returns Object with toggle functions and current values
 * 
 * @example
 * const toggles = useMultipleToggle({
 *   modal: false,
 *   sidebar: true,
 *   dropdown: false
 * })
 * 
 * return (
 *   <div>
 *     <button onClick={toggles.toggle.modal}>
 *       {toggles.values.modal ? 'Close' : 'Open'} Modal
 *     </button>
 *   </div>
 * )
 */
export function useMultipleToggle<T extends Record<string, boolean>>(
  initialValues: T
): {
  values: T
  toggle: Record<keyof T, () => void>
  setTrue: Record<keyof T, () => void>
  setFalse: Record<keyof T, () => void>
  setValue: Record<keyof T, (value: boolean) => void>
} {
  const [values, setValues] = useState<T>(initialValues)

  const toggle = {} as Record<keyof T, () => void>
  const setTrue = {} as Record<keyof T, () => void>
  const setFalse = {} as Record<keyof T, () => void>
  const setValue = {} as Record<keyof T, (value: boolean) => void>

  Object.keys(initialValues).forEach((key) => {
    const k = key as keyof T

    toggle[k] = useCallback(() => {
      setValues((prev) => ({ ...prev, [key]: !prev[k] }))
    }, [key])

    setTrue[k] = useCallback(() => {
      setValues((prev) => ({ ...prev, [key]: true }))
    }, [key])

    setFalse[k] = useCallback(() => {
      setValues((prev) => ({ ...prev, [key]: false }))
    }, [key])

    setValue[k] = useCallback((value: boolean) => {
      setValues((prev) => ({ ...prev, [key]: value }))
    }, [key])
  })

  return {
    values,
    toggle,
    setTrue,
    setFalse,
    setValue,
  }
}
