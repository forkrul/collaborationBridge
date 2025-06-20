import { cn } from '../cn'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('should handle conditional classes', () => {
    expect(cn('base-class', { 'conditional-class': true })).toBe('base-class conditional-class')
    expect(cn('base-class', { 'conditional-class': false })).toBe('base-class')
  })

  it('should handle arrays of classes', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
  })

  it('should handle undefined and null values', () => {
    expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2')
  })

  it('should merge conflicting Tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should handle empty input', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
  })

  it('should handle complex combinations', () => {
    const result = cn(
      'px-2 py-1',
      'px-4',
      { 'bg-red-500': true, 'bg-blue-500': false },
      ['text-white', 'font-bold']
    )
    expect(result).toBe('py-1 px-4 bg-red-500 text-white font-bold')
  })
})
