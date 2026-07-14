import { ArrowRight, ShieldCheck, Wifi } from 'lucide-react'
import type { InternetPackage, PaymentMethod } from '@/types'
import { formatDuration, formatFcfa } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OrderSummaryProps {
  selectedPackage: InternetPackage | null
  selectedPayment: PaymentMethod | null
  canPay: boolean
  onPay: () => void
  className?: string
  sticky?: boolean
}

export function OrderSummary({
  selectedPackage,
  selectedPayment,
  canPay,
  onPay,
  className,
  sticky = true,
}: OrderSummaryProps) {
  return (
    <aside
      className={cn(
        'glass rounded-[1.75rem] p-5 md:p-6',
        sticky && 'sticky top-6',
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-3 md:mb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white">
          <Wifi className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-lg font-bold text-ink">Order Summary</p>
          <p className="text-sm text-slate">Review and connect in one step</p>
        </div>
      </div>

      <dl className="space-y-3 text-sm md:space-y-4">
        <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-3">
          <dt className="text-slate">Selected package</dt>
          <dd className="font-semibold text-ink">
            {selectedPackage?.durationLabel ?? 'None selected'}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-3">
          <dt className="text-slate">Price</dt>
          <dd className="font-display text-xl font-bold text-brand">
            {selectedPackage ? formatFcfa(selectedPackage.price) : '—'}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-3">
          <dt className="text-slate">Payment method</dt>
          <dd className="text-right font-semibold text-ink">
            {selectedPayment?.name ?? 'Not chosen'}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate">Estimated duration</dt>
          <dd className="font-semibold text-ink">
            {selectedPackage
              ? formatDuration(selectedPackage.durationHours)
              : '—'}
          </dd>
        </div>
      </dl>

      <Button
        size="lg"
        className="mt-5 h-14 w-full text-base tracking-wide md:mt-6"
        disabled={!canPay}
        onClick={onPay}
      >
        PAY & CONNECT
        <ArrowRight className="h-4 w-4" />
      </Button>

      <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate md:mt-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        Secure checkout. Internet access activates after payment confirmation
        via MikroTik.
      </p>
    </aside>
  )
}
