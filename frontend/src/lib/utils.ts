import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

const PRODUCT_IMAGES: Record<string, string> = {
  // Jaquetas
  "Bomber Jacket":  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop&auto=format",
  "Denim Jacket":   "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400&h=300&fit=crop&auto=format",
  "Windbreaker":    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop&auto=format",
  "Puffer Jacket":  "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=300&fit=crop&auto=format",
  // Camisetas
  "Linen Shirt":    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop&auto=format",
  "Black Shirt":    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=300&fit=crop&auto=format",
  "Polo Shirt":     "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=300&fit=crop&auto=format",
  "Graphic Tee":    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=300&fit=crop&auto=format",
  "Henley Shirt":   "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=300&fit=crop&auto=format",
  // Calças
  "Ankle Pants":    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=300&fit=crop&auto=format",
  "Cargo Pants":    "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=300&fit=crop&auto=format",
  "Slim Jeans":     "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop&auto=format",
  "Jogger Pants":   "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop&auto=format",
  // Acessórios
  "Snapback Cap":   "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=300&fit=crop&auto=format",
  "Leather Belt":   "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&h=300&fit=crop&auto=format",
  "Sunglasses":     "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop&auto=format",
  "Wool Scarf":     "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=300&fit=crop&auto=format",
  // Calçados
  "Canvas Sneaker": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop&auto=format",
  "Running Shoe":   "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&auto=format",
  "Chelsea Boot":   "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&h=300&fit=crop&auto=format",
  "Slip-On":        "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=300&fit=crop&auto=format",
}

const CATEGORY_FALLBACKS: Record<string, string> = {
  "Jaquetas":   "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop&auto=format",
  "Camisetas":  "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=300&fit=crop&auto=format",
  "Calças":     "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop&auto=format",
  "Acessórios": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop&auto=format",
  "Calçados":   "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&auto=format",
}

export function getProductImage(name: string, category?: string): string {
  return (
    PRODUCT_IMAGES[name] ??
    (category ? CATEGORY_FALLBACKS[category] : null) ??
    `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop&auto=format`
  )
}
