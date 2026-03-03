import api from "@/lib/axios"
import type { Product, PagedResult, CreateProductForm } from "@/types"

export const productService = {
  async getProducts(page = 1, pageSize = 10, search?: string, categoryId?: string): Promise<PagedResult<Product>> {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (search) params.append("search", search)
    if (categoryId) params.append("categoryId", categoryId)
    const { data } = await api.get(`/products?${params}`)
    return data
  },

  async getProduct(id: string): Promise<Product> {
    const { data } = await api.get(`/products/${id}`)
    return data
  },

  async getLowStockProducts(): Promise<Product[]> {
    const { data } = await api.get("/products/low-stock")
    return data
  },

  async createProduct(product: CreateProductForm): Promise<Product> {
    const { data } = await api.post("/products", product)
    return data
  },

  async updateProduct(id: string, product: CreateProductForm): Promise<Product> {
    const { data } = await api.put(`/products/${id}`, product)
    return data
  },

  async updateStock(id: string, quantity: number): Promise<Product> {
    const { data } = await api.patch(`/products/${id}/stock`, { quantity })
    return data
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },
}
