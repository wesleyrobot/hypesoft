import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { productService } from "@/services/productService"
import type { Product } from "@/types"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  open: boolean
  product?: Product
  onClose: () => void
}

export function StockDialog({ open, product, onClose }: Props) {
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(product?.stockQuantity ?? 0)

  const mutation = useMutation({
    mutationFn: () => productService.updateStock(product!.id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      onClose()
    },
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Atualizar Estoque</DialogTitle>
          <DialogDescription>{product?.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Quantidade em Estoque</Label>
            <Input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          {product && product.stockQuantity < 10 && (
            <p className="text-xs text-yellow-400">
              Estoque atual: {product.stockQuantity} unidades (abaixo do mínimo de 10)
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Atualizar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
