import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Reproduce the same schema used in ProductDialog
const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().min(1, 'Description is required').max(1000),
  price: z.coerce.number().positive('Price must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  stockQuantity: z.coerce.number().int().min(0, 'Stock must be >= 0'),
})

describe('Product form validation schema', () => {
  it('accepts valid product data', () => {
    const result = productSchema.safeParse({
      name: 'Bomber Jacket',
      description: 'A premium bomber jacket',
      price: 299.90,
      categoryId: 'cat-id-123',
      stockQuantity: 15,
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = productSchema.safeParse({
      name: '',
      description: 'desc',
      price: 100,
      categoryId: 'cat1',
      stockQuantity: 10,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('name')
    }
  })

  it('rejects negative price', () => {
    const result = productSchema.safeParse({
      name: 'Test',
      description: 'desc',
      price: -5,
      categoryId: 'cat1',
      stockQuantity: 10,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('price')
    }
  })

  it('rejects zero price', () => {
    const result = productSchema.safeParse({
      name: 'Test',
      description: 'desc',
      price: 0,
      categoryId: 'cat1',
      stockQuantity: 10,
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative stock quantity', () => {
    const result = productSchema.safeParse({
      name: 'Test',
      description: 'desc',
      price: 100,
      categoryId: 'cat1',
      stockQuantity: -1,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('stockQuantity')
    }
  })

  it('accepts zero stock quantity', () => {
    const result = productSchema.safeParse({
      name: 'Test',
      description: 'desc',
      price: 100,
      categoryId: 'cat1',
      stockQuantity: 0,
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing category', () => {
    const result = productSchema.safeParse({
      name: 'Test',
      description: 'desc',
      price: 100,
      categoryId: '',
      stockQuantity: 5,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('categoryId')
    }
  })

  it('coerces string price to number', () => {
    const result = productSchema.safeParse({
      name: 'Test',
      description: 'desc',
      price: '199.90',
      categoryId: 'cat1',
      stockQuantity: '5',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.price).toBe(199.90)
      expect(result.data.stockQuantity).toBe(5)
    }
  })
})
