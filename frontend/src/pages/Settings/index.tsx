import { useState } from "react"
import { Save, User, Bell, Shield, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import keycloak from "@/lib/keycloak"

export default function Settings() {
  const token = keycloak.tokenParsed as Record<string, string> | undefined
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    name: token?.name ?? token?.preferred_username ?? "Admin User",
    email: token?.email ?? "admin@hypesoft.com",
    role: (token?.realm_access as unknown as { roles?: string[] })?.roles?.find((r) => r !== "default-roles-hypesoft" && r !== "offline_access" && r !== "uma_authorization") ?? "Administrator",
    language: "pt-BR",
  })
  const [notifications, setNotifications] = useState({
    lowStock:     true,
    newOrders:    true,
    weeklyReport: true,
    emailAlerts:  true,
  })
  const [theme, setTheme] = useState<"Light" | "Dark" | "System">("Light")

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const THEMES: { label: "Light" | "Dark" | "System"; preview: string }[] = [
    { label: "Light",  preview: "#f4f5f7" },
    { label: "Dark",   preview: "#1e2139" },
    { label: "System", preview: "#7c3aed" },
  ]

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50">
            <User className="h-4 w-4 text-purple-600" />
          </div>
          <h2 className="text-sm font-semibold text-gray-800">Profile</h2>
        </div>

        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
          <img
            src="https://i.pravatar.cc/80?img=1"
            alt="Avatar"
            className="h-16 w-16 rounded-2xl object-cover border-2 border-purple-100"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{profile.email}</p>
            <span className="inline-block mt-1.5 text-[10px] font-semibold text-purple-600 bg-purple-50 rounded-full px-2 py-0.5">
              {profile.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
            <input
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
            <input
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Role</label>
            <input
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
              value={profile.role}
              readOnly
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Language</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              value={profile.language}
              onChange={(e) => setProfile({ ...profile, language: e.target.value })}
            >
              <option value="pt-BR">Português (BR)</option>
              <option value="en-US">English (US)</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
            <Bell className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: "lowStock"     as const, label: "Low stock alerts",  desc: "Get notified when products are running low" },
            { key: "newOrders"    as const, label: "New orders",         desc: "Receive alerts for incoming orders" },
            { key: "weeklyReport" as const, label: "Weekly report",      desc: "Summary of weekly performance" },
            { key: "emailAlerts"  as const, label: "Email alerts",       desc: "Send notifications via email" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[key] ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    notifications[key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
          </div>
          <h2 className="text-sm font-semibold text-gray-800">Security</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-800">Authentication Provider</p>
              <p className="text-xs text-gray-400 mt-0.5">Managed via Keycloak SSO</p>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 rounded-full px-2.5 py-1">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-800">Two-Factor Authentication</p>
              <p className="text-xs text-gray-400 mt-0.5">Configured in Keycloak admin panel</p>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 rounded-full px-2.5 py-1">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-800">Session Timeout</p>
              <p className="text-xs text-gray-400 mt-0.5">Auto logout after 30 minutes of inactivity</p>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 rounded-full px-2.5 py-1">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-800">API Rate Limiting</p>
              <p className="text-xs text-gray-400 mt-0.5">Requests are rate-limited to prevent abuse</p>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 rounded-full px-2.5 py-1">Active</span>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50">
            <Palette className="h-4 w-4 text-orange-500" />
          </div>
          <h2 className="text-sm font-semibold text-gray-800">Appearance</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ label, preview }) => {
            const isActive = theme === label
            return (
              <button
                key={label}
                onClick={() => setTheme(label)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  isActive ? "border-purple-500 bg-purple-50/50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div className="h-10 w-full rounded-lg border border-gray-200 overflow-hidden flex">
                  <div className="w-1/4 h-full" style={{ backgroundColor: "#1e2139" }} />
                  <div className="flex-1 h-full" style={{ backgroundColor: preview }} />
                </div>
                <p className={`text-xs font-medium ${isActive ? "text-purple-600" : "text-gray-500"}`}>{label}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
