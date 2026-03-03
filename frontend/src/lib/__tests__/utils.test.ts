import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, cn } from '@/lib/utils'

describe('formatCurrency', () => {
  it('formats a value as BRL currency', () => {
    const result = formatCurrency(1299.9)
    expect(result).toMatch(/R\$/)
    expect(result).toContain('1.299')
  })

  it('formats zero correctly', () => {
    const result = formatCurrency(0)
    expect(result).toMatch(/R\$/)
    expect(result).toContain('0')
  })

  it('returns a string', () => {
    expect(typeof formatCurrency(100)).toBe('string')
  })
})

describe('formatDate', () => {
  it('formats an ISO date to pt-BR format', () => {
    const result = formatDate('2024-01-15T00:00:00.000Z')
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })

  it('returns a string', () => {
    expect(typeof formatDate('2024-06-01T00:00:00.000Z')).toBe('string')
  })
})

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'excluded', 'included')).toBe('base included')
  })

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null)).toBe('base')
  })
})
