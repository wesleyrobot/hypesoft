import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { productService } from "@/services/productService"
import { categoryService } from "@/services/categoryService"
import { formatCurrency, getProductImage } from "@/lib/utils"
import { ShoppingCart, Search, Star, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function Shop() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["shop-products", search, categoryFilter],
    queryFn: () => productService.getProducts(1, 20, search || undefined, categoryFilter || undefined),
  })

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">My Shop</h1>
          <p className="text-sm text-gray-500 mt-0.5">Browse and manage your product catalog</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ShoppingCart className="h-4 w-4 text-purple-500" />
          <span>{data?.total ?? 0} products available</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm"
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-4 bg-gray-100 rounded w-1/3 mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-400">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {data?.items.map((product) => {
            const image = getProductImage(product.name, product.categoryName)
            const stars = Math.max(3, 5 - (product.stockQuantity < 5 ? 1 : 0))
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow group cursor-pointer"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-44 bg-gray-100">
                  <img
                    src={image}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const fallback = `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop&auto=format`
                      if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback
                    }}
                  />
                  {product.isLowStock && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="warning" className="text-[10px] px-1.5 py-0.5">Low Stock</Badge>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <ShoppingCart className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-xs text-purple-500 font-medium mb-1">{product.categoryName}</p>
                  <h3 className="text-sm font-semibold text-gray-800 truncate mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-400 truncate mb-2">{product.description}</p>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"}`}
                      />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1">({product.stockQuantity})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-800">{formatCurrency(product.price)}</span>
                    <span className="text-[10px] text-gray-400">{product.stockQuantity} in stock</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
