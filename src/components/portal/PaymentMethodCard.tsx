import { motion } from 'framer-motion'
import {
  Banknote,
  Check,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import type { PaymentMethod, PaymentMethodId } from '@/types'
import { cn } from '@/lib/utils'

const methodStyles: Record<
  PaymentMethodId,
  { icon: LucideIcon; accent: string; iconBg: string }
> = {
  'orange-money': {
    icon: Smartphone,
    accent: 'text-[#ff7900]',
    iconBg: 'bg-orange-50',
  },
  'moov-money': {
    icon: Smartphone,
    accent: 'text-[#0066b3]',
    iconBg: 'bg-sky-50',
  },
  'telecel-cash': {
    icon: Smartphone,
    accent: 'text-[#e30613]',
    iconBg: 'bg-red-50',
  },
  wave: {
    icon: Smartphone,
    accent: 'text-[#0ea5b7]',
    iconBg: 'bg-cyan-50',
  },
  'pay-on-site': {
    icon: Banknote,
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
  const Icon = style.icon

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
          'flex h-12 w-12 items-center justify-center rounded-xl',
          style.iconBg,
          style.accent,
        )}
      >
        <Icon className="h-5 w-5" />
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
