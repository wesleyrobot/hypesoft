import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { categoryService } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { CategoryDialog } from "./CategoryDialog"
import type { Category } from "@/types"
import { Plus, Pencil, Trash2, Tag } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function Categories() {
  const queryClient = useQueryClient()
  const [dialog, setDialog] = useState<{ open: boolean; category?: Category }>({ open: false })

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  })

  const deleteMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories?.length ?? 0} categories registered</p>
        </div>
        <Button onClick={() => setDialog({ open: true })}>
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-white shadow-card animate-pulse" />
            ))
          : categories?.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                      <Tag className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setDialog({ open: true, category })}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { if (confirm(`Delete "${category.name}"?`)) deleteMutation.mutate(category.id) }}
                      className="text-red-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{category.description || "No description"}</p>
                <p className="text-xs text-gray-400 mt-3">Created {formatDate(category.createdAt)}</p>
              </div>
            ))}
      </div>

      {categories?.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <Tag className="h-12 w-12 mb-3 opacity-20" />
          <p>No categories registered</p>
          <Button className="mt-4" onClick={() => setDialog({ open: true })}>
            <Plus className="h-4 w-4" /> Create first category
          </Button>
        </div>
      )}

      <CategoryDialog
        open={dialog.open}
        category={dialog.category}
        onClose={() => setDialog({ open: false })}
      />
    </div>
  )
}
