import { useQuery } from "@tanstack/react-query"
import { productService } from "@/services/productService"
import { StockDialog } from "@/pages/Products/StockDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package, RefreshCw } from "lucide-react"
import { useState } from "react"
import type { Product } from "@/types"
import { formatCurrency } from "@/lib/utils"

export default function Stock() {
  const [stockDialog, setStockDialog] = useState<{ open: boolean; product?: Product }>({ open: false })

  const { data: lowStock, isLoading, refetch } = useQuery({
    queryKey: ["products-low-stock"],
    queryFn: productService.getLowStockProducts,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Stock Control</h1>
          <p className="text-sm text-gray-500 mt-0.5">Products with stock below 10 units</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin h-8 w-8 rounded-full border-2 border-brand-purple border-t-transparent" />
        </div>
      ) : lowStock?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 rounded-2xl bg-white shadow-card text-gray-500">
          <Package className="h-12 w-12 mb-3 text-green-400 opacity-60" />
          <p className="font-medium text-green-600">All products with adequate stock!</p>
          <p className="text-sm mt-1 text-gray-400">No products below 10 units.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-yellow-50 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-700">{lowStock?.length} product(s) with low stock</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Product</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Category</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Price</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Current Stock</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lowStock?.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50 shrink-0">
                          <Package className="h-4 w-4 text-yellow-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{product.categoryName}</td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-gray-800">{formatCurrency(product.price)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`text-lg font-bold ${product.stockQuantity === 0 ? "text-red-500" : "text-yellow-600"}`}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {product.stockQuantity === 0 ? (
                        <Badge variant="destructive">Out of stock</Badge>
                      ) : product.stockQuantity <= 3 ? (
                        <Badge variant="destructive">Critical</Badge>
                      ) : (
                        <Badge variant="warning">Low</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button size="sm" onClick={() => setStockDialog({ open: true, product })}>
                        Restock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <StockDialog
        open={stockDialog.open}
        product={stockDialog.product}
        onClose={() => setStockDialog({ open: false })}
      />
    </div>
  )
}
