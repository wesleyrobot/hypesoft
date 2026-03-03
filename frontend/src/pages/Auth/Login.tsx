import { useEffect } from "react"
import keycloak from "@/lib/keycloak"

export default function Login() {
  useEffect(() => {
    keycloak.login()
  }, [])

  return (
    <div className="flex h-screen items-center justify-center bg-page">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 shadow-lg">
          <span className="text-xl font-bold text-white">H</span>
        </div>
        <p className="text-base font-semibold text-gray-800">Hypesoft</p>
        <p className="text-sm text-gray-400">Redirecting to login...</p>
        <div className="animate-spin h-6 w-6 rounded-full border-2 border-purple-600 border-t-transparent" />
      </div>
    </div>
  )
}
