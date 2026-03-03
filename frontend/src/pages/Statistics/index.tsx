import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "@/services/dashboardService"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"

const COLORS = ["#7c3aed", "#a78bfa", "#6d28d9", "#8b5cf6", "#5b21b6", "#c4b5fd"]

export default function Statistics() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getDashboard,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 rounded-full border-2 border-brand-purple border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Statistics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Visual analysis of the product catalog</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Products by Category</h2>
          {data?.productsByCategory && data.productsByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.productsByCategory} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="categoryName" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", color: "#374151", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="productCount" name="Qtd." radius={[6, 6, 0, 0]}>
                  {data.productsByCategory.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">Sem dados</div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Category Distribution</h2>
          {data?.productsByCategory && data.productsByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.productsByCategory}
                  dataKey="productCount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ categoryName, percent }) =>
                    `${categoryName} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={{ stroke: "#9ca3af" }}
                >
                  {data.productsByCategory.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => <span style={{ color: "#6b7280", fontSize: 12 }}>{value}</span>}
                />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", color: "#374151", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">Sem dados</div>
          )}
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Category Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Category</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Products</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.productsByCategory.map((cat, idx) => {
                const pct = data.totalProducts > 0 ? ((cat.productCount / Number(data.totalProducts)) * 100).toFixed(1) : "0.0"
                return (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-sm font-medium text-gray-800">{cat.categoryName}</span>
                    </td>
                    <td className="px-5 py-3 text-right text-sm text-gray-600">{cat.productCount}</td>
                    <td className="px-5 py-3 text-right text-sm font-semibold text-gray-700">{pct}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
