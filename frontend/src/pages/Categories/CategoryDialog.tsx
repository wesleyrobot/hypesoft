import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { categoryService } from "@/services/categoryService"
import type { Category } from "@/types"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  description: z.string().max(500),
})

type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  category?: Category
  onClose: () => void
}

export function CategoryDialog({ open, category, onClose }: Props) {
  const queryClient = useQueryClient()
  const isEditing = !!category

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (open) {
      reset({ name: category?.name ?? "", description: category?.description ?? "" })
    }
  }, [open, category, reset])

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEditing
        ? categoryService.updateCategory(category!.id, data)
        : categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      onClose()
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      alert(msg ?? "Erro ao salvar. Tente novamente.")
    },
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Edite as informações da categoria" : "Crie uma nova categoria de produtos"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Nome *</Label>
            <Input id="cat-name" {...register("name")} placeholder="Nome da categoria" />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Descrição</Label>
            <Textarea id="cat-desc" {...register("description")} placeholder="Descrição da categoria" rows={3} />
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
