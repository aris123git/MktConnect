import { Badge } from '@/components/ui/badge'
import type { ConnectionStatus, RequestStatus } from '@/types'

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const map = {
    pending: { label: 'Pending', variant: 'warning' as const },
    approved: { label: 'Approved', variant: 'success' as const },
    rejected: { label: 'Rejected', variant: 'danger' as const },
    paid: { label: 'Paid', variant: 'default' as const },
  }
  const item = map[status]
  return <Badge variant={item.variant}>{item.label}</Badge>
}

export function ConnectionStatusBadge({
  status,
}: {
  status: ConnectionStatus
}) {
  const map = {
    online: { label: 'Online', variant: 'success' as const },
    expiring: { label: 'Expiring', variant: 'warning' as const },
    offline: { label: 'Offline', variant: 'muted' as const },
  }
  const item = map[status]
  return <Badge variant={item.variant}>{item.label}</Badge>
}

export function PaymentStatusBadge({
  status,
}: {
  status: 'completed' | 'pending' | 'failed'
}) {
  const map = {
    completed: { label: 'Completed', variant: 'success' as const },
    pending: { label: 'Pending', variant: 'warning' as const },
    failed: { label: 'Failed', variant: 'danger' as const },
  }
  const item = map[status]
  return <Badge variant={item.variant}>{item.label}</Badge>
}
