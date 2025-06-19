import { formatBytes } from '../formatBytes'

describe('formatBytes utility function', () => {
  it('should format bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes')
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1048576)).toBe('1 MB')
    expect(formatBytes(1073741824)).toBe('1 GB')
  })

  it('should handle decimal places', () => {
    expect(formatBytes(1536, 2)).toBe('1.50 KB')
    expect(formatBytes(1536, 0)).toBe('2 KB')
    expect(formatBytes(1536)).toBe('1.5 KB') // default 1 decimal
  })

  it('should handle large numbers', () => {
    expect(formatBytes(1099511627776)).toBe('1 TB')
    expect(formatBytes(1125899906842624)).toBe('1 PB')
  })

  it('should handle small numbers', () => {
    expect(formatBytes(512)).toBe('512 Bytes')
    expect(formatBytes(1)).toBe('1 Bytes')
  })

  it('should handle negative decimal places', () => {
    expect(formatBytes(1536, -1)).toBe('2 KB') // Should default to 0 decimals
  })

  it('should handle fractional bytes', () => {
    expect(formatBytes(1536.5)).toBe('1.5 KB')
    expect(formatBytes(1536.7, 2)).toBe('1.50 KB')
  })
})
