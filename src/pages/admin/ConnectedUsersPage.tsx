import { useState } from 'react'
import { Unplug } from 'lucide-react'
import { ConnectionStatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { connectedUsers as initialUsers } from '@/data/mock'
import type { ConnectedUser } from '@/types'

function formatRemaining(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    const remHours = hours % 24
    return `${days}d ${remHours}h`
  }
  return `${hours}h ${mins}m`
}

function formatConnectedAt(value: string) {
  return new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ConnectedUsersPage() {
  const [users, setUsers] = useState<ConnectedUser[]>(initialUsers)

  const disconnect = (id: string) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? { ...user, status: 'offline', remainingMinutes: 0 }
          : user,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">
          Connected Users
        </h1>
        <p className="mt-1 text-sm text-slate">
          Monitor live sessions and disconnect devices when needed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active devices</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.12em] text-slate">
                <th className="px-3 py-2 font-semibold">MAC Address</th>
                <th className="px-3 py-2 font-semibold">Connection Time</th>
                <th className="px-3 py-2 font-semibold">Remaining Time</th>
                <th className="px-3 py-2 font-semibold">Package</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="bg-cloud/70">
                  <td className="rounded-l-xl px-3 py-3">
                    <p className="font-mono font-semibold text-ink">
                      {user.macAddress}
                    </p>
                    <p className="text-xs text-slate">{user.device}</p>
                  </td>
                  <td className="px-3 py-3 text-ink">
                    {formatConnectedAt(user.connectedAt)}
                  </td>
                  <td className="px-3 py-3 font-semibold text-ink">
                    {user.status === 'offline'
                      ? 'Disconnected'
                      : formatRemaining(user.remainingMinutes)}
                  </td>
                  <td className="px-3 py-3 text-ink">{user.packageName}</td>
                  <td className="px-3 py-3">
                    <ConnectionStatusBadge status={user.status} />
                  </td>
                  <td className="rounded-r-xl px-3 py-3">
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={user.status === 'offline'}
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
        </CardContent>
      </Card>
    </div>
  )
}
