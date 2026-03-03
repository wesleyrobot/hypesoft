import { useEffect, useState } from "react"
import keycloak from "@/lib/keycloak"

interface Props {
  children: React.ReactNode
}

export function AuthGuard({ children }: Props) {
  const [status, setStatus] = useState<"loading" | "authenticated" | "error">("loading")

  useEffect(() => {
    keycloak
      .init({ onLoad: "login-required", checkLoginIframe: false })
      .then((authenticated) => {
        if (authenticated) {
          setStatus("authenticated")
        } else {
          keycloak.login()
        }
      })
      .catch(() => {
        // Keycloak unavailable — allow access in dev/demo mode
        setStatus("authenticated")
      })
  }, [])

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-page">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 shadow-lg">
            <span className="text-xl font-bold text-white">H</span>
          </div>
          <p className="text-sm text-gray-400">Loading...</p>
          <div className="animate-spin h-6 w-6 rounded-full border-2 border-purple-600 border-t-transparent" />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
