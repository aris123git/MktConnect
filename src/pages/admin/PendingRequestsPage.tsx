import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { RequestStatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { pendingRequests as initialRequests } from '@/data/mock'
import { formatFcfa } from '@/lib/utils'
import type { PendingRequest, RequestStatus } from '@/types'

function formatTime(value: string) {
  return new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function PendingRequestsPage() {
  const [requests, setRequests] = useState<PendingRequest[]>(initialRequests)

  const updateStatus = (id: string, status: RequestStatus) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status } : request,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">
          Pending Requests
        </h1>
        <p className="mt-1 text-sm text-slate">
          Approve or reject customer access requests before MikroTik activation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access queue</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.12em] text-slate">
                <th className="px-3 py-2 font-semibold">Customer</th>
                <th className="px-3 py-2 font-semibold">Device</th>
                <th className="px-3 py-2 font-semibold">Package</th>
                <th className="px-3 py-2 font-semibold">Payment Method</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="rounded-xl bg-cloud/70 shadow-sm"
                >
                  <td className="rounded-l-xl px-3 py-3">
                    <p className="font-semibold text-ink">{request.customer}</p>
                    <p className="text-xs text-slate">
                      {request.phone ?? 'No phone'} · {formatTime(request.createdAt)}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-ink">{request.device}</p>
                    <p className="font-mono text-xs text-slate">
                      {request.macAddress}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-ink">{request.packageName}</p>
                    <p className="text-xs text-slate">
                      {formatFcfa(request.amount)}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-ink">{request.paymentMethod}</td>
                  <td className="px-3 py-3">
                    <RequestStatusBadge status={request.status} />
                  </td>
                  <td className="rounded-r-xl px-3 py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        disabled={request.status !== 'pending'}
                        onClick={() => updateStatus(request.id, 'approved')}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={request.status !== 'pending'}
                        onClick={() => updateStatus(request.id, 'rejected')}
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </div>
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
