import {
  CircleDollarSign,
  Signal,
  TrendingUp,
  Users,
  Wifi,
} from 'lucide-react'
import { StatCard } from '@/components/admin/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardStats } from '@/data/mock'
import { formatFcfa } from '@/lib/utils'

const weekly = [
  { day: 'Mon', revenue: 42000, users: 31 },
  { day: 'Tue', revenue: 38500, users: 28 },
  { day: 'Wed', revenue: 51200, users: 39 },
  { day: 'Thu', revenue: 46800, users: 34 },
  { day: 'Fri', revenue: 61000, users: 45 },
  { day: 'Sat', revenue: 72000, users: 52 },
  { day: 'Sun', revenue: 18650, users: 48 },
]

export function StatisticsPage() {
  const maxRevenue = Math.max(...weekly.map((item) => item.revenue))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Statistics</h1>
        <p className="mt-1 text-sm text-slate">
          Performance metrics for hotspot usage and revenue.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Today's Users"
          value={String(dashboardStats.todaysUsers)}
          icon={Users}
          tone="brand"
        />
        <StatCard
          label="Today's Revenue"
          value={formatFcfa(dashboardStats.todaysRevenue)}
          icon={CircleDollarSign}
          tone="success"
        />
        <StatCard
          label="Connected Users"
          value={String(dashboardStats.connectedUsers)}
          icon={Wifi}
          tone="dark"
        />
        <StatCard
          label="Pending Requests"
          value={String(dashboardStats.pendingRequests)}
          icon={Signal}
          tone="warning"
        />
        <StatCard
          label="Monthly Revenue"
          value={formatFcfa(dashboardStats.monthlyRevenue)}
          icon={TrendingUp}
          tone="brand"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly revenue trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 items-end gap-3 md:gap-4">
            {weekly.map((item) => (
              <div key={item.day} className="text-center">
                <div className="mx-auto mb-3 flex h-44 items-end justify-center rounded-2xl bg-mist/70 px-2 py-3">
                  <div
                    className="w-full max-w-[42px] rounded-xl bg-gradient-to-t from-brand-deep to-brand shadow-[0_10px_24px_rgba(11,99,246,0.28)]"
                    style={{
                      height: `${Math.max(18, (item.revenue / maxRevenue) * 100)}%`,
                    }}
                    title={formatFcfa(item.revenue)}
                  />
                </div>
                <p className="text-xs font-semibold text-ink">{item.day}</p>
                <p className="mt-1 text-[11px] text-slate">{item.users} users</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
