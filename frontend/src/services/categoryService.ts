import api from "@/lib/axios"
import type { Category, CreateCategoryForm } from "@/types"

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const { data } = await api.get("/categories")
    return data
  },

  async getCategory(id: string): Promise<Category> {
    const { data } = await api.get(`/categories/${id}`)
    return data
  },

  async createCategory(category: CreateCategoryForm): Promise<Category> {
    const { data } = await api.post("/categories", category)
    return data
  },

  async updateCategory(id: string, category: CreateCategoryForm): Promise<Category> {
    const { data } = await api.put(`/categories/${id}`, category)
    return data
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`)
  },
}
