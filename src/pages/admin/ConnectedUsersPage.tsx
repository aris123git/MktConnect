import { Unplug } from 'lucide-react'
import { ConnectionStatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useMikrotikSession } from '@/context/MikrotikSessionContext'
import { formatCommercialRemaining } from '@/lib/mikrotik'
import { formatFcfa } from '@/lib/utils'
import type { ConnectionStatus } from '@/types'

function formatConnectedAt(value: string) {
  return new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function toConnectionStatus(
  status: 'active' | 'expiring' | 'expired' | 'disconnected',
): ConnectionStatus {
  if (status === 'active') return 'online'
  if (status === 'expiring') return 'expiring'
  return 'offline'
}

export function ConnectedUsersPage() {
  const { sessions, disconnect } = useMikrotikSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">
          Connected Users
        </h1>
        <p className="mt-1 text-sm text-slate">
          Live MikroTik simulation sessions. Remaining time never exceeds the
          paid package duration.
        </p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Active & recent devices</CardTitle>
          <Badge variant="default">{sessions.length} sessions</Badge>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {sessions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-cloud/60 px-4 py-10 text-center text-sm text-slate">
              No MikroTik sessions yet. Complete a portal payment to grant access.
            </div>
          ) : (
            <table className="w-full min-w-[980px] border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-[0.12em] text-slate">
                  <th className="px-3 py-2 font-semibold">MAC Address</th>
                  <th className="px-3 py-2 font-semibold">Connection Time</th>
                  <th className="px-3 py-2 font-semibold">Remaining Time</th>
                  <th className="px-3 py-2 font-semibold">Package</th>
                  <th className="px-3 py-2 font-semibold">Paid</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((user) => (
                  <tr key={user.id} className="bg-cloud/70">
                    <td className="rounded-l-xl px-3 py-3">
                      <p className="font-mono font-semibold text-ink">
                        {user.macAddress}
                      </p>
                      <p className="text-xs text-slate">
                        {user.device} · {user.customerName}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-ink">
                      {formatConnectedAt(user.connectedAt)}
                    </td>
                    <td className="px-3 py-3 font-semibold text-ink">
                      {user.isOnline
                        ? formatCommercialRemaining(user.remainingCommercialMs)
                        : '0s'}
                      <p className="text-xs font-normal text-slate">
                        Ceiling {user.durationHours}h
                      </p>
                    </td>
                    <td className="px-3 py-3 text-ink">{user.packageName}</td>
                    <td className="px-3 py-3 text-ink">
                      {formatFcfa(user.amountPaid)}
                      <p className="text-xs text-slate">{user.paymentMethod}</p>
                    </td>
                    <td className="px-3 py-3">
                      <ConnectionStatusBadge
                        status={toConnectionStatus(user.status)}
                      />
                    </td>
                    <td className="rounded-r-xl px-3 py-3">
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={!user.isOnline}
                        onClick={() => disconnect(user.id)}
                      >
                        <Unplug className="h-3.5 w-3.5" />
                        Disconnect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
