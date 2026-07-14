import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { PaymentMethod, PaymentMethodId } from '@/types'
import { cn } from '@/lib/utils'

const methodStyles: Record<
  PaymentMethodId,
  { mark: string; accent: string; iconBg: string }
> = {
  'orange-money': {
    mark: 'OM',
    accent: 'text-[#ff7900]',
    iconBg: 'bg-orange-50',
  },
  'moov-money': {
    mark: 'MM',
    accent: 'text-[#0066b3]',
    iconBg: 'bg-sky-50',
  },
  'telecel-cash': {
    mark: 'TC',
    accent: 'text-[#e30613]',
    iconBg: 'bg-red-50',
  },
  wave: {
    mark: 'W',
    accent: 'text-[#0ea5b7]',
    iconBg: 'bg-cyan-50',
  },
  'pay-on-site': {
    mark: 'POS',
    accent: 'text-ink',
    iconBg: 'bg-mist',
  },
}

interface PaymentMethodCardProps {
  method: PaymentMethod
  selected: boolean
  onSelect: (id: PaymentMethodId) => void
}

export function PaymentMethodCard({
  method,
  selected,
  onSelect,
}: PaymentMethodCardProps) {
  const style = methodStyles[method.id]

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onSelect(method.id)}
      className={cn(
        'flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all',
        selected
          ? 'border-brand bg-brand-soft/50 shadow-[0_14px_36px_rgba(11,99,246,0.16)] ring-2 ring-brand/25'
          : 'border-line/80 bg-white/80 hover:border-brand/30',
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold tracking-wide',
          style.iconBg,
          style.accent,
        )}
      >
        {style.mark}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">{method.name}</p>
        <p className="mt-0.5 text-sm text-slate">{method.description}</p>
      </div>
      <span
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full border',
          selected ? 'border-brand bg-brand text-white' : 'border-line bg-white',
        )}
      >
        {selected && <Check className="h-3.5 w-3.5" />}
      </span>
    </motion.button>
  )
}
