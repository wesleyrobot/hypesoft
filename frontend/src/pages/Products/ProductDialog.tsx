import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { productService } from "@/services/productService"
import type { Product, Category } from "@/types"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200),
  description: z.string().min(1, "Descrição é obrigatória").max(1000),
  price: z.coerce.number().positive("Preço deve ser maior que 0"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  stockQuantity: z.coerce.number().int().min(0, "Estoque não pode ser negativo"),
})

type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  product?: Product
  categories: Category[]
  onClose: () => void
}

export function ProductDialog({ open, product, categories, onClose }: Props) {
  const queryClient = useQueryClient()
  const isEditing = !!product

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const selectedCategory = watch("categoryId")

  useEffect(() => {
    if (open) {
      reset({
        name: product?.name ?? "",
        description: product?.description ?? "",
        price: product?.price ?? 0,
        categoryId: product?.categoryId ?? "",
        stockQuantity: product?.stockQuantity ?? 0,
      })
    }
  }, [open, product, reset])

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEditing
        ? productService.updateProduct(product!.id, data)
        : productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      onClose()
    },
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Edite as informações do produto" : "Preencha os dados do novo produto"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome *</Label>
            <Input id="name" {...register("name")} placeholder="Nome do produto" />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea id="description" {...register("description")} placeholder="Descrição do produto" rows={3} />
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input id="price" type="number" step="0.01" min="0" {...register("price")} placeholder="0,00" />
              {errors.price && <p className="text-xs text-red-400">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stockQuantity">Estoque *</Label>
              <Input id="stockQuantity" type="number" min="0" {...register("stockQuantity")} placeholder="0" />
              {errors.stockQuantity && <p className="text-xs text-red-400">{errors.stockQuantity.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Categoria *</Label>
            <Select value={selectedCategory} onValueChange={(v) => setValue("categoryId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-xs text-red-400">{errors.categoryId.message}</p>}
          </div>

          {mutation.error && (
            <p className="text-xs text-red-400">Erro ao salvar produto. Tente novamente.</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : isEditing ? "Atualizar" : "Criar Produto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
