import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  BarChart3,
  ShoppingBag,
  Package,
  Users,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  Zap,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import keycloak from "@/lib/keycloak"


const ICON_CLASS = "bg-white/10"

const mainItems = [
  { path: "/",           label: "Dashboard", icon: LayoutDashboard, iconClass: ICON_CLASS },
  { path: "/statistics", label: "Statistics", icon: BarChart3,      iconClass: ICON_CLASS },
]

const shopItems = [
  { path: "/shop",       label: "My Shop",   icon: ShoppingBag,   iconClass: ICON_CLASS, badge: undefined },
  { path: "/products",   label: "Products",  icon: Package,       iconClass: ICON_CLASS              },
  { path: "/categories", label: "Customers", icon: Users,         iconClass: ICON_CLASS              },
  { path: "/stock",      label: "Invoice",   icon: FileText,      iconClass: ICON_CLASS              },
  { path: "/messages",   label: "Message",   icon: MessageSquare, iconClass: ICON_CLASS, badge: 4    },
]

const supportItems = [
  { path: "/settings", label: "Settings", icon: Settings,   iconClass: ICON_CLASS },
  { path: "/help",     label: "Help",     icon: HelpCircle, iconClass: ICON_CLASS },
]

function NavItem({ path, label, icon: Icon, badge, isActive, iconClass }: {
  path: string; label: string; icon: React.ElementType; badge?: number; isActive: boolean; iconClass: string
}) {
  return (
    <NavLink
      to={path}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group",
        isActive
          ? "bg-brand-purple text-white shadow-sm"
          : "text-sidebar-text hover:bg-sidebar-hover hover:text-white"
      )}
    >
      <div className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg transition-all shrink-0",
        isActive ? "bg-white/25" : iconClass
      )}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <span className="flex-1">{label}</span>
      {badge != null && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-purple px-1.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  const location = useLocation()

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)

  return (
    <aside
      className="flex h-screen w-60 flex-col fixed left-0 top-0 z-50"
      style={{ backgroundColor: "#1e2139" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <img src="/logo.png" alt="Hypesoft" className="h-9 w-9 rounded-xl object-cover shrink-0 shadow-lg shadow-purple-900/40" />
        <div>
          <p className="text-sm font-bold text-white tracking-wide lowercase">hypesoft</p>
          <p className="text-[10px] text-gray-500 font-medium">Management</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {/* Main */}
        <div className="space-y-1">
          {mainItems.map((item) => (
            <NavItem key={item.path} {...item} isActive={isActive(item.path)} />
          ))}
        </div>

        {/* Shop */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
            Shop
          </p>
          <div className="space-y-1">
            {shopItems.map((item) => (
              <NavItem key={item.path} {...item} isActive={isActive(item.path)} />
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
            Support
          </p>
          <div className="space-y-1">
            {supportItems.map((item) => (
              <NavItem key={item.path} {...item} isActive={isActive(item.path)} />
            ))}
          </div>
        </div>
      </nav>

      {/* Upgrade card */}
      <div className="mx-3 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 mb-3">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <p className="text-sm font-bold text-white mb-0.5">Try Hypesoft Pro</p>
        <p className="text-[11px] text-purple-200 mb-3 leading-tight">
          Get Pro and enjoy 20+ features to enhance your sales. Free 30 days trial!
        </p>
        <button className="w-full rounded-lg bg-white py-1.5 text-xs font-bold text-brand-purple hover:bg-purple-50 transition-colors">
          Upgrade Plan
        </button>
      </div>

      {/* Logout */}
      <div className="px-3 pb-4 pt-2">
        <button
          onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 group-hover:bg-red-500/10 transition-all">
            <LogOut className="h-4 w-4" />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
