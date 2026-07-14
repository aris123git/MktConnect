import { motion } from 'framer-motion'
import { Check, Clock3 } from 'lucide-react'
import type { InternetPackage } from '@/types'
import { formatFcfa } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PackageCardProps {
  pkg: InternetPackage
  selected: boolean
  onSelect: (id: string) => void
}

export function PackageCard({ pkg, selected, onSelect }: PackageCardProps) {
  return (
    <motion.button
      type="button"
      layout
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onSelect(pkg.id)}
      className={cn(
        'relative w-full rounded-2xl border p-5 text-left transition-all duration-300',
        selected
          ? 'border-brand bg-gradient-to-br from-brand-soft/80 via-white to-white shadow-[0_18px_50px_rgba(11,99,246,0.2)] ring-2 ring-brand/30'
          : 'border-line/80 bg-white/75 shadow-[0_10px_30px_rgba(7,17,31,0.06)] hover:border-brand/30 hover:shadow-[0_16px_40px_rgba(11,99,246,0.12)]',
      )}
    >
      {pkg.popular && (
        <Badge className="absolute -top-2.5 right-4" variant="dark">
          Most popular
        </Badge>
      )}

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <Clock3 className="h-5 w-5" />
        </div>
        {selected && (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white">
            <Check className="h-4 w-4" />
          </span>
        )}
      </div>

      <p className="font-display text-xl font-bold text-ink">{pkg.durationLabel}</p>
      <p className="mt-1 font-display text-2xl font-bold text-brand">{formatFcfa(pkg.price)}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate">{pkg.description}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate/80">
        Up to {pkg.speedMbps} Mbps
      </p>

      <Button
        type="button"
        variant={selected ? 'default' : 'secondary'}
        className="mt-5 w-full"
        onClick={(event) => {
          event.stopPropagation()
          onSelect(pkg.id)
        }}
      >
        {selected ? 'Selected' : 'Select'}
      </Button>
    </motion.button>
  )
}
