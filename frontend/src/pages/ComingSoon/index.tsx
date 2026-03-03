import { useLocation, useNavigate } from "react-router-dom"
import { Construction } from "lucide-react"
import { Button } from "@/components/ui/button"

const LABELS: Record<string, string> = {
  "/shop":     "My Shop",
  "/messages": "Messages",
  "/settings": "Settings",
  "/help":     "Help",
}

export default function ComingSoon() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const label = LABELS[pathname] ?? "This page"

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 mb-5">
        <Construction className="h-8 w-8 text-purple-500" />
      </div>
      <h1 className="text-xl font-bold text-gray-800 mb-1">{label}</h1>
      <p className="text-sm text-gray-400 mb-6">This feature is coming soon. Stay tuned!</p>
      <Button variant="outline" onClick={() => navigate("/")}>
        Back to Dashboard
      </Button>
    </div>
  )
}
