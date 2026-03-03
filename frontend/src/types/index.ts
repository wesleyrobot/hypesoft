export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  categoryName: string
  stockQuantity: number
  isLowStock: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface PagedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface CategoryStats {
  categoryName: string
  productCount: number
  stockValue: number
}

export interface DashboardData {
  totalProducts: number
  totalStockValue: number
  lowStockCount: number
  categoryCount: number
  lowStockProducts: Product[]
  productsByCategory: CategoryStats[]
  recentProducts: Product[]
}

export interface CreateProductForm {
  name: string
  description: string
  price: number
  categoryId: string
  stockQuantity: number
}

export interface CreateCategoryForm {
  name: string
  description: string
}
