import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"

export function AppLayout() {
  return (
    <div className="flex h-screen bg-page overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-60 overflow-y-auto">
        <div className="min-h-full p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
