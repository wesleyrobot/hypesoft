import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { productService } from "@/services/productService"
import { categoryService } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProductDialog } from "./ProductDialog"
import { StockDialog } from "./StockDialog"
import type { Product } from "@/types"
import { Plus, Search, Pencil, Trash2, Package, AlertTriangle } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function Products() {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [productDialog, setProductDialog] = useState<{ open: boolean; product?: Product }>({ open: false })
  const [stockDialog, setStockDialog] = useState<{ open: boolean; product?: Product }>({ open: false })
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") ?? "")

  const { data, isLoading } = useQuery({
    queryKey: ["products", page, debouncedSearch, categoryFilter],
    queryFn: () => productService.getProducts(page, 10, debouncedSearch || undefined, categoryFilter || undefined),
  })

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  })

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  })

  const handleSearchChange = (value: string) => {
    setSearch(value)
    clearTimeout((window as unknown as { searchTimer?: ReturnType<typeof setTimeout> }).searchTimer)
    ;(window as unknown as { searchTimer?: ReturnType<typeof setTimeout> }).searchTimer = setTimeout(() => {
      setDebouncedSearch(value)
      setPage(1)
    }, 400)
  }

  const totalPages = data ? Math.ceil(data.total / 10) : 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {data?.total ?? 0} products registered
          </p>
        </div>
        <Button onClick={() => setProductDialog({ open: true })}>
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search product..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm"
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Product</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Category</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Price</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Stock</th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Created</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Package className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-400 text-sm">No products found</p>
                  </td>
                </tr>
              ) : (
                data?.items.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 shrink-0">
                          <Package className="h-4 w-4 text-purple-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate max-w-[160px]">{product.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[160px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{product.categoryName}</td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-gray-800">{formatCurrency(product.price)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setStockDialog({ open: true, product })}
                        className={`text-sm font-semibold hover:underline transition-colors ${product.isLowStock ? "text-yellow-600" : "text-gray-800"}`}
                      >
                        {product.stockQuantity}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {product.isLowStock ? (
                        <Badge variant="warning" className="gap-1">
                          <AlertTriangle className="h-3 w-3" /> Low
                        </Badge>
                      ) : (
                        <Badge variant="success">Normal</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(product.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setProductDialog({ open: true, product })}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm(`Delete "${product.name}"?`)) {
                              deleteMutation.mutate(product.id)
                            }
                          }}
                          className="text-red-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Showing {((page - 1) * 10) + 1}–{Math.min(page * 10, data?.total ?? 0)} of {data?.total ?? 0}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <ProductDialog
        open={productDialog.open}
        product={productDialog.product}
        categories={categories ?? []}
        onClose={() => setProductDialog({ open: false })}
      />

      <StockDialog
        open={stockDialog.open}
        product={stockDialog.product}
        onClose={() => setStockDialog({ open: false })}
      />
    </div>
  )
}
