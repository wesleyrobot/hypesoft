import api from "@/lib/axios"
import type { DashboardData } from "@/types"

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const { data } = await api.get("/dashboard")
    return data
  },
}
