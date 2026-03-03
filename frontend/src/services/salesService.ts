import api from "@/lib/axios"

export interface SalesDataPoint {
  label: string
  value: number
}

export interface SalesData {
  points: SalesDataPoint[]
}

export const salesService = {
  async getSalesData(period: string, category?: string): Promise<SalesData> {
    const params: Record<string, string> = { period }
    if (category && category !== "All Categories") params.category = category
    const { data } = await api.get("/sales", { params })
    return data
  },
}
