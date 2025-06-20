import { generateId, generateUUID } from '../generateId'

describe('generateId utility function', () => {
  it('should generate an ID with default length', () => {
    const id = generateId()
    expect(id).toHaveLength(8)
    expect(id).toMatch(/^[a-z0-9]+$/)
  })

  it('should generate an ID with custom length', () => {
    const id = generateId(undefined, 12)
    expect(id).toHaveLength(12)
    expect(id).toMatch(/^[a-z0-9]+$/)
  })

  it('should generate an ID with prefix', () => {
    const id = generateId('btn')
    expect(id).toMatch(/^btn-[a-z0-9]{8}$/)
  })

  it('should generate an ID with prefix and custom length', () => {
    const id = generateId('modal', 6)
    expect(id).toMatch(/^modal-[a-z0-9]{6}$/)
  })

  it('should generate unique IDs', () => {
    const ids = Array.from({ length: 100 }, () => generateId())
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(100) // All should be unique
  })

  it('should handle empty prefix', () => {
    const id = generateId('')
    expect(id).toMatch(/^-[a-z0-9]{8}$/)
  })
})

describe('generateUUID utility function', () => {
  it('should generate a valid UUID v4', () => {
    const uuid = generateUUID()
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('should generate unique UUIDs', () => {
    const uuids = Array.from({ length: 100 }, () => generateUUID())
    const uniqueUuids = new Set(uuids)
    expect(uniqueUuids.size).toBe(100) // All should be unique
  })

  it('should have correct format', () => {
    const uuid = generateUUID()
    const parts = uuid.split('-')
    expect(parts).toHaveLength(5)
    expect(parts[0]).toHaveLength(8)
    expect(parts[1]).toHaveLength(4)
    expect(parts[2]).toHaveLength(4)
    expect(parts[3]).toHaveLength(4)
    expect(parts[4]).toHaveLength(12)
  })
})
