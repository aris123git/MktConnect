import { Link } from 'react-router-dom'
import {
  CircleDollarSign,
  Clock3,
  Signal,
  Users,
  Wifi,
} from 'lucide-react'
import { StatCard } from '@/components/admin/StatCard'
import { RequestStatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  connectedUsers,
  dashboardStats,
  pendingRequests,
} from '@/data/mock'
import { formatFcfa } from '@/lib/utils'

export function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Overview</h1>
        <p className="mt-1 text-sm text-slate">
          Live snapshot of your Starlink hotspot network.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Today's Users"
          value={String(dashboardStats.todaysUsers)}
          hint="+12 since yesterday"
          icon={Users}
          tone="brand"
        />
        <StatCard
          label="Today's Revenue"
          value={formatFcfa(dashboardStats.todaysRevenue)}
          hint="Mobile money + on-site"
          icon={CircleDollarSign}
          tone="success"
        />
        <StatCard
          label="Connected Users"
          value={String(dashboardStats.connectedUsers)}
          hint="Active MikroTik sessions"
          icon={Wifi}
          tone="dark"
        />
        <StatCard
          label="Pending Requests"
          value={String(dashboardStats.pendingRequests)}
          hint="Awaiting approval"
          icon={Signal}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Latest pending requests</CardTitle>
            <Button asChild size="sm" variant="secondary">
              <Link to="/admin/pending">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingRequests.slice(0, 4).map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line/70 bg-cloud/60 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">
                    {request.customer}
                  </p>
                  <p className="truncate text-xs text-slate">
                    {request.packageName} · {request.paymentMethod}
                  </p>
                </div>
                <RequestStatusBadge status={request.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Active sessions</CardTitle>
            <Button asChild size="sm" variant="secondary">
              <Link to="/admin/users">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {connectedUsers.slice(0, 4).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line/70 bg-cloud/60 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">
                    {user.macAddress}
                  </p>
                  <p className="truncate text-xs text-slate">
                    {user.device} · {user.packageName}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate">
                  <Clock3 className="h-3.5 w-3.5" />
                  {Math.floor(user.remainingMinutes / 60)}h left
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
