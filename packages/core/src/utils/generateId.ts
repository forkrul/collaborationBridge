/**
 * Generate a unique ID string
 * 
 * @param prefix - Optional prefix for the ID
 * @param length - Length of the random part (default: 8)
 * @returns Unique ID string
 * 
 * @example
 * generateId() // "a1b2c3d4"
 * generateId('btn') // "btn-a1b2c3d4"
 * generateId('modal', 12) // "modal-a1b2c3d4e5f6"
 */
export function generateId(prefix?: string, length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return prefix ? `${prefix}-${result}` : result
}

/**
 * Generate a UUID v4 string
 * 
 * @returns UUID v4 string
 * 
 * @example
 * generateUUID() // "550e8400-e29b-41d4-a716-446655440000"
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
