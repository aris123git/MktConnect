import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { RequestStatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMikrotikSession } from '@/context/MikrotikSessionContext'
import { pendingRequests as initialRequests } from '@/data/mock'
import { packages } from '@/data/mock'
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

function resolvePackage(packageName: string, amount: number) {
  return (
    packages.find((pkg) => pkg.name === packageName || pkg.durationLabel === packageName) ??
    packages.find((pkg) => pkg.price === amount) ??
    null
  )
}

export function PendingRequestsPage() {
  const [requests, setRequests] = useState<PendingRequest[]>(initialRequests)
  const { activateAccess, refresh } = useMikrotikSession()
  const [message, setMessage] = useState<string | null>(null)

  const updateStatus = (id: string, status: RequestStatus) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status } : request,
      ),
    )
  }

  const approve = (request: PendingRequest) => {
    const pkg = resolvePackage(request.packageName, request.amount)
    if (!pkg) {
      setMessage(`No package mapping for ${request.packageName}`)
      return
    }

    try {
      activateAccess({
        packageId: pkg.id,
        packageName: pkg.durationLabel,
        durationHours: pkg.durationHours,
        amountPaid: request.amount,
        paymentMethod: request.paymentMethod,
        phoneNumber: request.phone,
        customerName: request.customer,
        macAddress: request.macAddress,
        device: request.device,
        forceReplace: true,
      })
      updateStatus(request.id, 'approved')
      refresh()
      setMessage(
        `MikroTik access granted to ${request.macAddress} for ${pkg.durationHours}h (paid ${formatFcfa(request.amount)}).`,
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Approval failed')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">
          Pending Requests
        </h1>
        <p className="mt-1 text-sm text-slate">
          Approve to simulate MikroTik activation for exactly the paid package
          duration.
        </p>
      </div>

      {message && (
        <div className="rounded-2xl border border-brand/20 bg-brand-soft/50 px-4 py-3 text-sm text-ink">
          {message}
        </div>
      )}

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
                        onClick={() => approve(request)}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={request.status !== 'pending'}
                        onClick={() => {
                          updateStatus(request.id, 'rejected')
                          setMessage(`Request ${request.id} rejected — no MikroTik grant.`)
                        }}
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
