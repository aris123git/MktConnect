import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  hint?: string
  icon: LucideIcon
  tone?: 'brand' | 'success' | 'warning' | 'dark'
}

const tones = {
  brand: 'from-brand to-brand-deep text-white',
  success: 'from-emerald-500 to-emerald-700 text-white',
  warning: 'from-amber-400 to-amber-600 text-white',
  dark: 'from-ink to-ink-soft text-white',
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'brand',
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(7,17,31,0.06)] backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
            {value}
          </p>
        </div>
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg',
            tones[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {hint && <p className="text-xs text-slate">{hint}</p>}
    </div>
  )
}
