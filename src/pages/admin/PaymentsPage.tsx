import { PaymentStatusBadge } from '@/components/admin/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { paymentRecords } from '@/data/mock'
import { formatFcfa } from '@/lib/utils'

function formatTime(value: string) {
  return new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function PaymentsPage() {
  const totalCompleted = paymentRecords
    .filter((payment) => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Payments</h1>
        <p className="mt-1 text-sm text-slate">
          Track Mobile Money and on-site payment activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-slate">Completed volume</p>
            <p className="mt-2 font-display text-2xl font-bold text-brand">
              {formatFcfa(totalCompleted)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-slate">Transactions</p>
            <p className="mt-2 font-display text-2xl font-bold text-ink">
              {paymentRecords.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-slate">Pending / failed</p>
            <p className="mt-2 font-display text-2xl font-bold text-ink">
              {
                paymentRecords.filter((payment) => payment.status !== 'completed')
                  .length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent payments</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.12em] text-slate">
                <th className="px-3 py-2 font-semibold">Customer</th>
                <th className="px-3 py-2 font-semibold">Package</th>
                <th className="px-3 py-2 font-semibold">Method</th>
                <th className="px-3 py-2 font-semibold">Amount</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {paymentRecords.map((payment) => (
                <tr key={payment.id} className="bg-cloud/70">
                  <td className="rounded-l-xl px-3 py-3 font-semibold text-ink">
                    {payment.customer}
                  </td>
                  <td className="px-3 py-3 text-ink">{payment.packageName}</td>
                  <td className="px-3 py-3 text-ink">{payment.method}</td>
                  <td className="px-3 py-3 font-semibold text-ink">
                    {formatFcfa(payment.amount)}
                  </td>
                  <td className="px-3 py-3">
                    <PaymentStatusBadge status={payment.status} />
                  </td>
                  <td className="rounded-r-xl px-3 py-3 text-slate">
                    {formatTime(payment.createdAt)}
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
