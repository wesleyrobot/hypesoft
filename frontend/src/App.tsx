import { Suspense, lazy } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AppLayout } from "@/components/layout/AppLayout"
import { AuthGuard } from "@/components/auth/AuthGuard"

const Dashboard = lazy(() => import("@/pages/Dashboard"))
const Products = lazy(() => import("@/pages/Products"))
const Categories = lazy(() => import("@/pages/Categories"))
const Stock = lazy(() => import("@/pages/Stock"))
const Statistics = lazy(() => import("@/pages/Statistics"))
const Shop = lazy(() => import("@/pages/Shop"))
const Messages = lazy(() => import("@/pages/Messages"))
const Settings = lazy(() => import("@/pages/Settings"))
const Help = lazy(() => import("@/pages/Help"))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 2,
    },
  },
})

const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin h-8 w-8 rounded-full border-2 border-brand-purple border-t-transparent" />
  </div>
)

function App() {
  return (
    <AuthGuard>
      <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
            <Route path="/products" element={<Suspense fallback={<PageLoader />}><Products /></Suspense>} />
            <Route path="/categories" element={<Suspense fallback={<PageLoader />}><Categories /></Suspense>} />
            <Route path="/stock" element={<Suspense fallback={<PageLoader />}><Stock /></Suspense>} />
            <Route path="/statistics" element={<Suspense fallback={<PageLoader />}><Statistics /></Suspense>} />
            <Route path="/shop"     element={<Suspense fallback={<PageLoader />}><Shop /></Suspense>} />
            <Route path="/messages" element={<Suspense fallback={<PageLoader />}><Messages /></Suspense>} />
            <Route path="/settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
            <Route path="/help"     element={<Suspense fallback={<PageLoader />}><Help /></Suspense>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </QueryClientProvider>
    </AuthGuard>
  )
}

export default App
