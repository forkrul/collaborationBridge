import { renderHook, act } from '@testing-library/react'
import { useToggle, useMultipleToggle } from '../useToggle'

describe('useToggle hook', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useToggle())
    const [value] = result.current
    expect(value).toBe(false)
  })

  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useToggle(true))
    const [value] = result.current
    expect(value).toBe(true)
  })

  it('should toggle value', () => {
    const { result } = renderHook(() => useToggle(false))
    const [, toggle] = result.current

    act(() => {
      toggle()
    })

    expect(result.current[0]).toBe(true)

    act(() => {
      toggle()
    })

    expect(result.current[0]).toBe(false)
  })

  it('should set to true', () => {
    const { result } = renderHook(() => useToggle(false))
    const [, , setTrue] = result.current

    act(() => {
      setTrue()
    })

    expect(result.current[0]).toBe(true)
  })

  it('should set to false', () => {
    const { result } = renderHook(() => useToggle(true))
    const [, , , setFalse] = result.current

    act(() => {
      setFalse()
    })

    expect(result.current[0]).toBe(false)
  })

  it('should set specific value', () => {
    const { result } = renderHook(() => useToggle(false))
    const [, , , , setValue] = result.current

    act(() => {
      setValue(true)
    })

    expect(result.current[0]).toBe(true)

    act(() => {
      setValue(false)
    })

    expect(result.current[0]).toBe(false)
  })
})

describe('useMultipleToggle hook', () => {
  const initialValues = {
    modal: false,
    sidebar: true,
    dropdown: false,
  }

  it('should initialize with provided values', () => {
    const { result } = renderHook(() => useMultipleToggle(initialValues))
    
    expect(result.current.values).toEqual(initialValues)
  })

  it('should toggle individual values', () => {
    const { result } = renderHook(() => useMultipleToggle(initialValues))

    act(() => {
      result.current.toggle.modal()
    })

    expect(result.current.values.modal).toBe(true)
    expect(result.current.values.sidebar).toBe(true) // unchanged
    expect(result.current.values.dropdown).toBe(false) // unchanged
  })

  it('should set individual values to true', () => {
    const { result } = renderHook(() => useMultipleToggle(initialValues))

    act(() => {
      result.current.setTrue.dropdown()
    })

    expect(result.current.values.dropdown).toBe(true)
  })

  it('should set individual values to false', () => {
    const { result } = renderHook(() => useMultipleToggle(initialValues))

    act(() => {
      result.current.setFalse.sidebar()
    })

    expect(result.current.values.sidebar).toBe(false)
  })

  it('should set specific values', () => {
    const { result } = renderHook(() => useMultipleToggle(initialValues))

    act(() => {
      result.current.setValue.modal(true)
      result.current.setValue.sidebar(false)
    })

    expect(result.current.values.modal).toBe(true)
    expect(result.current.values.sidebar).toBe(false)
    expect(result.current.values.dropdown).toBe(false) // unchanged
  })
})
