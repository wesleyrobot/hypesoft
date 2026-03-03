import { describe, it, expect, vi, beforeEach } from 'vitest'
import { productService } from '../productService'

// Mock the axios instance
vi.mock('@/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import api from '@/lib/axios'

const mockApi = api as {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
  put: ReturnType<typeof vi.fn>
  patch: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
}

const mockProduct = {
  id: 'prod-1',
  name: 'Bomber Jacket',
  description: 'Premium jacket',
  price: 299.9,
  categoryId: 'cat-1',
  categoryName: 'Jaquetas',
  stockQuantity: 15,
  isLowStock: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProducts', () => {
    it('calls correct endpoint with default params', async () => {
      mockApi.get.mockResolvedValueOnce({ data: { items: [], total: 0, page: 1, pageSize: 10 } })

      await productService.getProducts()

      expect(mockApi.get).toHaveBeenCalledWith(
        expect.stringContaining('/products?')
      )
      const url = mockApi.get.mock.calls[0][0] as string
      expect(url).toContain('page=1')
      expect(url).toContain('pageSize=10')
    })

    it('includes search param when provided', async () => {
      mockApi.get.mockResolvedValueOnce({ data: { items: [], total: 0, page: 1, pageSize: 10 } })

      await productService.getProducts(1, 10, 'bomber')

      const url = mockApi.get.mock.calls[0][0] as string
      expect(url).toContain('search=bomber')
    })

    it('includes categoryId param when provided', async () => {
      mockApi.get.mockResolvedValueOnce({ data: { items: [], total: 0, page: 1, pageSize: 10 } })

      await productService.getProducts(1, 10, undefined, 'cat-1')

      const url = mockApi.get.mock.calls[0][0] as string
      expect(url).toContain('categoryId=cat-1')
    })

    it('does not include search param when not provided', async () => {
      mockApi.get.mockResolvedValueOnce({ data: { items: [], total: 0, page: 1, pageSize: 10 } })

      await productService.getProducts(1, 10)

      const url = mockApi.get.mock.calls[0][0] as string
      expect(url).not.toContain('search')
    })

    it('returns paged result data', async () => {
      const pagedResult = { items: [mockProduct], total: 1, page: 1, pageSize: 10 }
      mockApi.get.mockResolvedValueOnce({ data: pagedResult })

      const result = await productService.getProducts()

      expect(result).toEqual(pagedResult)
    })
  })

  describe('getProduct', () => {
    it('calls correct endpoint with product id', async () => {
      mockApi.get.mockResolvedValueOnce({ data: mockProduct })

      await productService.getProduct('prod-1')

      expect(mockApi.get).toHaveBeenCalledWith('/products/prod-1')
    })

    it('returns product data', async () => {
      mockApi.get.mockResolvedValueOnce({ data: mockProduct })

      const result = await productService.getProduct('prod-1')

      expect(result).toEqual(mockProduct)
    })
  })

  describe('getLowStockProducts', () => {
    it('calls correct endpoint', async () => {
      mockApi.get.mockResolvedValueOnce({ data: [] })

      await productService.getLowStockProducts()

      expect(mockApi.get).toHaveBeenCalledWith('/products/low-stock')
    })

    it('returns array of products', async () => {
      const lowStockProducts = [{ ...mockProduct, stockQuantity: 3, isLowStock: true }]
      mockApi.get.mockResolvedValueOnce({ data: lowStockProducts })

      const result = await productService.getLowStockProducts()

      expect(result).toEqual(lowStockProducts)
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('createProduct', () => {
    it('calls correct endpoint with POST', async () => {
      mockApi.post.mockResolvedValueOnce({ data: mockProduct })
      const newProduct = {
        name: 'New Product',
        description: 'Desc',
        price: 100,
        categoryId: 'cat-1',
        stockQuantity: 10,
      }

      await productService.createProduct(newProduct)

      expect(mockApi.post).toHaveBeenCalledWith('/products', newProduct)
    })

    it('returns created product', async () => {
      mockApi.post.mockResolvedValueOnce({ data: mockProduct })

      const result = await productService.createProduct({
        name: 'P', description: 'D', price: 100, categoryId: 'cat-1', stockQuantity: 5,
      })

      expect(result).toEqual(mockProduct)
    })
  })

  describe('updateProduct', () => {
    it('calls correct endpoint with PUT', async () => {
      mockApi.put.mockResolvedValueOnce({ data: mockProduct })
      const updates = { name: 'Updated', description: 'D', price: 200, categoryId: 'cat-1', stockQuantity: 10 }

      await productService.updateProduct('prod-1', updates)

      expect(mockApi.put).toHaveBeenCalledWith('/products/prod-1', updates)
    })
  })

  describe('updateStock', () => {
    it('calls correct endpoint with PATCH and quantity payload', async () => {
      mockApi.patch.mockResolvedValueOnce({ data: mockProduct })

      await productService.updateStock('prod-1', 25)

      expect(mockApi.patch).toHaveBeenCalledWith('/products/prod-1/stock', { quantity: 25 })
    })
  })

  describe('deleteProduct', () => {
    it('calls correct endpoint with DELETE', async () => {
      mockApi.delete.mockResolvedValueOnce({ data: undefined })

      await productService.deleteProduct('prod-1')

      expect(mockApi.delete).toHaveBeenCalledWith('/products/prod-1')
    })
  })
})
