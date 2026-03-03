import { describe, it, expect, vi, beforeEach } from 'vitest'
import { categoryService } from '../categoryService'

vi.mock('@/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

import api from '@/lib/axios'

const mockApi = api as {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
  put: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
}

const mockCategory = {
  id: 'cat-1',
  name: 'Camisetas',
  description: 'Roupas de algodão',
  createdAt: '2024-01-01T00:00:00Z',
}

describe('categoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCategories', () => {
    it('calls correct endpoint', async () => {
      mockApi.get.mockResolvedValueOnce({ data: [] })

      await categoryService.getCategories()

      expect(mockApi.get).toHaveBeenCalledWith('/categories')
    })

    it('returns array of categories', async () => {
      const categories = [mockCategory, { ...mockCategory, id: 'cat-2', name: 'Calças' }]
      mockApi.get.mockResolvedValueOnce({ data: categories })

      const result = await categoryService.getCategories()

      expect(result).toEqual(categories)
      expect(result).toHaveLength(2)
    })

    it('returns empty array when no categories', async () => {
      mockApi.get.mockResolvedValueOnce({ data: [] })

      const result = await categoryService.getCategories()

      expect(result).toEqual([])
    })
  })

  describe('getCategory', () => {
    it('calls correct endpoint with id', async () => {
      mockApi.get.mockResolvedValueOnce({ data: mockCategory })

      await categoryService.getCategory('cat-1')

      expect(mockApi.get).toHaveBeenCalledWith('/categories/cat-1')
    })

    it('returns category data', async () => {
      mockApi.get.mockResolvedValueOnce({ data: mockCategory })

      const result = await categoryService.getCategory('cat-1')

      expect(result).toEqual(mockCategory)
    })
  })

  describe('createCategory', () => {
    it('calls correct endpoint with POST', async () => {
      mockApi.post.mockResolvedValueOnce({ data: mockCategory })
      const newCategory = { name: 'Jaquetas', description: 'Casacos e jaquetas' }

      await categoryService.createCategory(newCategory)

      expect(mockApi.post).toHaveBeenCalledWith('/categories', newCategory)
    })

    it('returns created category', async () => {
      mockApi.post.mockResolvedValueOnce({ data: mockCategory })

      const result = await categoryService.createCategory({ name: 'C', description: 'D' })

      expect(result).toEqual(mockCategory)
    })
  })

  describe('updateCategory', () => {
    it('calls correct endpoint with PUT', async () => {
      mockApi.put.mockResolvedValueOnce({ data: mockCategory })
      const updates = { name: 'Updated Name', description: 'Updated Desc' }

      await categoryService.updateCategory('cat-1', updates)

      expect(mockApi.put).toHaveBeenCalledWith('/categories/cat-1', updates)
    })

    it('returns updated category', async () => {
      const updatedCategory = { ...mockCategory, name: 'Updated Name' }
      mockApi.put.mockResolvedValueOnce({ data: updatedCategory })

      const result = await categoryService.updateCategory('cat-1', { name: 'Updated Name', description: 'D' })

      expect(result.name).toBe('Updated Name')
    })
  })

  describe('deleteCategory', () => {
    it('calls correct endpoint with DELETE', async () => {
      mockApi.delete.mockResolvedValueOnce({ data: undefined })

      await categoryService.deleteCategory('cat-1')

      expect(mockApi.delete).toHaveBeenCalledWith('/categories/cat-1')
    })

    it('does not throw on successful delete', async () => {
      mockApi.delete.mockResolvedValueOnce({ data: undefined })

      await expect(categoryService.deleteCategory('cat-1')).resolves.not.toThrow()
    })
  })
})
