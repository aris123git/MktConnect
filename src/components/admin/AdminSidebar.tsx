import { NavLink } from 'react-router-dom'
import {
  Boxes,
  CircleDollarSign,
  LayoutDashboard,
  Settings,
  Signal,
  Users,
  BarChart3,
  Wifi,
} from 'lucide-react'
import { BrandMark } from '@/components/portal/BrandMark'
import { cn } from '@/lib/utils'

const links = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/pending', label: 'Pending Requests', icon: Signal },
  { to: '/admin/users', label: 'Connected Users', icon: Users },
  { to: '/admin/packages', label: 'Packages', icon: Boxes },
  { to: '/admin/payments', label: 'Payments', icon: CircleDollarSign },
  { to: '/admin/statistics', label: 'Statistics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full flex-col border-r border-line/70 bg-white/80 backdrop-blur-xl">
      <div className="border-b border-line/70 p-5">
        <BrandMark size="sm" />
        <p className="mt-3 flex items-center gap-2 text-xs font-medium text-slate">
          <Wifi className="h-3.5 w-3.5 text-brand" />
          Hotspot Manager
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-brand text-white shadow-[0_10px_24px_rgba(11,99,246,0.28)]'
                  : 'text-slate hover:bg-mist hover:text-ink',
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 rounded-2xl bg-gradient-to-br from-ink to-ink-soft p-4 text-white">
        <p className="font-display text-sm font-semibold">Ready for APIs</p>
        <p className="mt-1 text-xs leading-relaxed text-white/70">
          Designed to connect later to MikroTik, Yenga, Orange Money, Moov,
          Telecel, Wave and FastAPI.
        </p>
      </div>
    </aside>
  )
}
