import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { dashboardService } from "@/services/dashboardService"
import { salesService } from "@/services/salesService"
import { formatCurrency, formatDate, getProductImage } from "@/lib/utils"
import {
  TrendingUp, TrendingDown, Search, Bell, Boxes, CircleDollarSign, LayoutGrid,
  PackageX, AlertTriangle, ChevronDown, SlidersHorizontal, Check,
  BarChart2 as BarIcon, Filter as FunnelIcon,
} from "lucide-react"
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts"

const FUNNEL_STAGES = [
  { count: 23, label: "MQL",          pctLeft: null,  pctRight: "13%" },
  { count: 11, label: "SQL",          pctLeft: "48%", pctRight: "27%" },
  { count: 7,  label: "Oportunidade", pctLeft: "64%", pctRight: null  },
  { count: 3,  label: "Cliente",      pctLeft: "43%", pctRight: null  },
]

function FunnelViz() {
  const max = FUNNEL_STAGES[0].count
  return (
    <div className="flex flex-col justify-center h-full gap-3 py-3">
      {FUNNEL_STAGES.map((stage, i) => {
        const w = Math.max(38, (stage.count / max) * 100)
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="w-20 text-right shrink-0">
              {stage.pctLeft ? (
                <>
                  <p className="text-sm font-bold text-gray-700">{stage.pctLeft}</p>
                  <p className="text-[10px] text-gray-400">conversão</p>
                </>
              ) : <div className="h-8" />}
            </div>
            <div className="flex-1 flex justify-center">
              <div
                className="flex items-center justify-between px-5 py-2.5 rounded-xl text-white"
                style={{
                  width: `${w}%`,
                  background: "linear-gradient(135deg, #22d3ee, #0891b2)",
                  boxShadow: "0 4px 14px rgba(8,145,178,0.30)",
                }}
              >
                <span className="text-xl font-bold">{stage.count}</span>
                <span className="text-sm font-medium opacity-90">{stage.label}</span>
              </div>
            </div>
            <div className="w-16 text-left shrink-0">
              {stage.pctRight ? (
                <>
                  <p className="text-sm font-bold text-gray-700">{stage.pctRight}</p>
                  <p className="text-[10px] text-gray-400">conversão</p>
                </>
              ) : <div className="h-8" />}
            </div>
          </div>
        )
      })}
    </div>
  )
}
import { cn } from "@/lib/utils"

const CATEGORY_COLORS_BG = [
  "bg-purple-500", "bg-blue-500", "bg-green-500", "bg-orange-400", "bg-pink-500",
]

const PERIOD_LABELS: Record<string, { label: string; current: string }> = {
  daily:   { label: "Daily",   current: "Daily Sales"   },
  weekly:  { label: "Weekly",  current: "Weekly Sales"  },
  monthly: { label: "Monthly", current: "Monthly Sales" },
}

const FILTER_OPTIONS = ["All Categories", "Camisetas", "Calças", "Jaquetas", "Acessórios", "Calçados"]

const CUSTOMERS = [
  { name: "Alice Morgan",  avatar: "https://i.pravatar.cc/40?img=1"  },
  { name: "James Carter",  avatar: "https://i.pravatar.cc/40?img=5"  },
  { name: "Sofia Lima",    avatar: "https://i.pravatar.cc/40?img=9"  },
  { name: "Ryan Brooks",   avatar: "https://i.pravatar.cc/40?img=12" },
  { name: "Mia Torres",    avatar: "https://i.pravatar.cc/40?img=15" },
  { name: "Lucas Silva",   avatar: "https://i.pravatar.cc/40?img=20" },
]

const TX_STATUSES = ["Completed", "Processing", "Pending"]

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("")
  const [notifOpen, setNotifOpen]     = useState(false)
  const [periodOpen, setPeriodOpen]   = useState(false)
  const [filterOpen, setFilterOpen]   = useState(false)
  const [period, setPeriod]           = useState<"daily" | "weekly" | "monthly">("weekly")
  const [chartType, setChartType]     = useState<"line" | "bar" | "funnel">("line")
  const [activeFilter, setActiveFilter] = useState("All Categories")

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getDashboard,
    refetchInterval: 30_000,
  })

  const categoryParam = activeFilter !== "All Categories" ? activeFilter : undefined
  const { data: salesData } = useQuery({
    queryKey: ["sales", period, categoryParam],
    queryFn: () => salesService.getSalesData(period, categoryParam),
  })

  const chartData = (salesData?.points ?? []).map((p) => ({ day: p.label, value: p.value }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
      </div>
    )
  }

  const stats = [
    {
      title: "Stock Value",
      value: formatCurrency(data?.totalStockValue ?? 0),
      change: "+12.5%",
      up: true,
      icon: CircleDollarSign,
      gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
      shadow: "rgba(124,58,237,0.30)",
    },
    {
      title: "Total Products",
      value: String(data?.totalProducts ?? 0),
      change: "+8.2%",
      up: true,
      icon: Boxes,
      gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
      shadow: "rgba(124,58,237,0.30)",
    },
    {
      title: "Categories",
      value: String(data?.categoryCount ?? 0),
      change: "Active",
      up: true,
      icon: LayoutGrid,
      gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
      shadow: "rgba(124,58,237,0.30)",
    },
    {
      title: "Low Stock",
      value: String(data?.lowStockCount ?? 0),
      change: (data?.lowStockCount ?? 0) > 0 ? "Needs review" : "All good",
      up: (data?.lowStockCount ?? 0) === 0,
      icon: PackageX,
      gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
      shadow: "rgba(124,58,237,0.30)",
    },
  ]

  // Top Products from real low-stock data
  const topProducts = (data?.lowStockProducts ?? []).slice(0, 5).map((product, i) => ({
    name: product.name,
    category: product.categoryName,
    stock: product.stockQuantity,
    price: product.price,
    pct: Math.max(10, 95 - i * 15),
    image: getProductImage(product.name, product.categoryName),
  }))

  // Transactions from real recent products
  const transactions = (data?.recentProducts ?? []).map((p, i) => ({
    id: `#TXN${1000 + i}`,
    product: p.name,
    category: p.categoryName,
    amount: p.price * p.stockQuantity,
    status: TX_STATUSES[i % TX_STATUSES.length],
    customer: CUSTOMERS[i % CUSTOMERS.length],
    date: formatDate(p.createdAt),
  }))


  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              className="pl-8 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl w-52 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchValue.trim()) {
                  navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`)
                }
              }}
            />
          </div>
          <div className="relative">
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => setNotifOpen((o) => !o)}
            >
              <Bell className="h-4 w-4 text-gray-500" />
              {(data?.lowStockCount ?? 0) > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">Notifications</p>
                  {(data?.lowStockCount ?? 0) > 0 && (
                    <span className="text-xs text-white bg-red-500 rounded-full px-2 py-0.5">
                      {data!.lowStockCount}
                    </span>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                  {(data?.lowStockProducts ?? []).length > 0 ? (
                    data!.lowStockProducts.map((p) => (
                      <div
                        key={p.id}
                        className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => { navigate("/products"); setNotifOpen(false) }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50 shrink-0 mt-0.5">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{p.name}</p>
                            <p className="text-xs text-gray-400">Low stock: {p.stockQuantity} units left</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-6 text-center text-sm text-gray-400">No notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="h-9 w-9 rounded-xl overflow-hidden border-2 border-purple-200 cursor-pointer select-none">
            <img src={CUSTOMERS[0].avatar} alt="Admin" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0"
                  style={{
                    background: stat.gradient,
                    boxShadow: `0 8px 20px ${stat.shadow}`,
                  }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${stat.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                  {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          )
        })}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Sales Insight Chart */}
        <div className="col-span-2 bg-white rounded-2xl shadow-card p-5 relative">
          {/* Chart header */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100">
                  <CircleDollarSign className="h-4 w-4 text-purple-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-700">Sales Insight</h2>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(chartData.reduce((sum, p) => sum + p.value, 0))}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1.5">
                <TrendingUp className="h-3 w-3" />
                {PERIOD_LABELS[period].current}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Period selector */}
              <div className="relative">
                <button
                  onClick={() => { setPeriodOpen(o => !o); setFilterOpen(false) }}
                  className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-xl px-3 py-1.5 hover:bg-gray-50 transition-colors"
                >
                  {PERIOD_LABELS[period].label} <ChevronDown className="h-3 w-3" />
                </button>
                {periodOpen && (
                  <div className="absolute right-0 top-9 w-36 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                    {(["daily", "weekly", "monthly"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPeriod(p); setPeriodOpen(false) }}
                        className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                        {PERIOD_LABELS[p].label}
                        {period === p && <Check className="h-3 w-3 text-purple-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter selector */}
              <div className="relative">
                <button
                  onClick={() => { setFilterOpen(o => !o); setPeriodOpen(false) }}
                  className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-xl px-3 py-1.5 hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal className="h-3 w-3" /> Filter
                </button>
                {filterOpen && (
                  <div className="absolute right-0 top-9 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                    {FILTER_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setActiveFilter(opt); setFilterOpen(false) }}
                        className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                        {opt}
                        {activeFilter === opt && <Check className="h-3 w-3 text-purple-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Chart type selector */}
              <div className="flex items-center gap-0.5 border border-gray-200 rounded-xl p-1">
                {([
                  { type: "line",   Icon: TrendingUp, title: "Line"   },
                  { type: "bar",    Icon: BarIcon,    title: "Bar"    },
                  { type: "funnel", Icon: FunnelIcon, title: "Funnel" },
                ] as const).map(({ type, Icon, title }) => (
                  <button
                    key={type}
                    title={title}
                    onClick={() => setChartType(type)}
                    className={cn(
                      "rounded-lg p-1.5 transition-colors",
                      chartType === type ? "bg-purple-100 text-purple-600" : "text-gray-400 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 justify-end mb-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-indigo-600" />
              <span className="text-xs text-gray-400">{PERIOD_LABELS[period].current}</span>
            </div>
          </div>

          {/* Chart */}
          {chartType === "funnel" ? (
            <div style={{ height: 165 }}>
              <FunnelViz />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={165}>
              {chartType === "bar" ? (
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e2139", border: "none", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", fontSize: 12, color: "#fff" }}
                    labelStyle={{ color: "#fff", fontWeight: 700, marginBottom: 6 }}
                    formatter={(v: number) => [formatCurrency(v), PERIOD_LABELS[period].current]}
                    itemStyle={{ color: "#e5e7eb" }}
                  />
                  <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e2139", border: "none", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", fontSize: 12, color: "#fff" }}
                    labelStyle={{ color: "#fff", fontWeight: 700, marginBottom: 6 }}
                    formatter={(v: number) => [formatCurrency(v), PERIOD_LABELS[period].current]}
                    itemStyle={{ color: "#e5e7eb" }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#4f46e5", strokeWidth: 0 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Products — real low-stock data */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-800">Low Stock Alert</h2>
            <a href="/stock" className="text-xs text-purple-600 font-medium hover:underline">See all</a>
          </div>
          <div className="space-y-4">
            {topProducts.length > 0 ? topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const fallback = `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop&auto=format`
                      if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-gray-700 truncate">{p.name}</p>
                    <span className="text-xs font-bold text-yellow-600 ml-2 shrink-0">{p.stock} left</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                      <div
                        className="h-1.5 rounded-full bg-yellow-400"
                        style={{ width: `${Math.min(100, (p.stock / 10) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">{formatCurrency(p.price)}</span>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-400 text-center py-6">All products in stock</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Recent Products as Transactions — real DB data */}
        <div className="col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Recent Products</h2>
            <a href="/products" className="text-xs text-purple-600 font-medium hover:underline">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/70">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Added by</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">Value</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.length > 0 ? transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={tx.customer.avatar} alt={tx.customer.name} className="h-8 w-8 rounded-full object-cover shrink-0 border border-gray-100" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate max-w-[110px]">{tx.customer.name}</p>
                          <p className="text-[11px] text-gray-400">{tx.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-md bg-purple-50 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-purple-600">{tx.product[0]}</span>
                        </div>
                        <span className="text-sm text-gray-700 truncate max-w-[120px]">{tx.product}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-sm font-semibold text-gray-800">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === "Completed" ? "bg-green-50 text-green-600"
                        : tx.status === "Pending" ? "bg-yellow-50 text-yellow-600"
                        : "bg-blue-50 text-blue-600"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">No products yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category breakdown — real DB data */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-800">By Category</h2>
            <a href="/categories" className="text-xs text-purple-600 font-medium hover:underline">See all</a>
          </div>
          <div className="space-y-4">
            {(data?.productsByCategory ?? []).length > 0
              ? data!.productsByCategory.map((cat, i) => {
                  const totalValue = data!.productsByCategory.reduce((s, c) => s + c.stockValue, 0) || 1
                  const pct = Math.max(5, Math.round((cat.stockValue / totalValue) * 100))
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-gray-700">{cat.categoryName}</span>
                        <span className="text-xs font-medium text-gray-400">{pct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div
                          className={`h-2 rounded-full ${CATEGORY_COLORS_BG[i % CATEGORY_COLORS_BG.length]}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              : <p className="text-sm text-gray-400 text-center py-6">No data</p>
            }
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Team members</p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {CUSTOMERS.map((c, i) => (
                  <img key={i} src={c.avatar} alt={c.name} title={c.name}
                    className="h-7 w-7 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">+{(data?.totalProducts ?? 0) * 3} views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
