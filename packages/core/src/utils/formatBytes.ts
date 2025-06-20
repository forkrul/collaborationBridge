/**
 * Format bytes as human-readable text
 * 
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places to display
 * @returns Formatted string with appropriate unit
 * 
 * @example
 * formatBytes(1024) // "1 KB"
 * formatBytes(1536, 2) // "1.50 KB"
 * formatBytes(1048576) // "1 MB"
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
