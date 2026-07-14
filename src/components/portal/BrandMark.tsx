import { Satellite } from 'lucide-react'
import { COMPANY } from '@/data/mock'
import { cn } from '@/lib/utils'

export function BrandMark({
  className,
  size = 'md',
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: {
      iconWrap: 'h-9 w-9 rounded-xl',
      icon: 'h-4 w-4',
      title: 'text-base',
      subtitle: 'text-[11px]',
    },
    md: {
      iconWrap: 'h-12 w-12 rounded-2xl',
      icon: 'h-5 w-5',
      title: 'text-xl',
      subtitle: 'text-xs',
    },
    lg: {
      iconWrap: 'h-16 w-16 rounded-[1.25rem]',
      icon: 'h-7 w-7',
      title: 'text-3xl md:text-4xl',
      subtitle: 'text-sm',
    },
  }[size]

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-brand to-brand-deep text-white shadow-[0_12px_30px_rgba(11,99,246,0.35)]',
          sizes.iconWrap,
        )}
      >
        <Satellite className={sizes.icon} />
      </div>
      <div>
        <p className={cn('font-display font-bold tracking-tight text-ink', sizes.title)}>
          {COMPANY.name}
        </p>
        <p className={cn('font-medium uppercase tracking-[0.18em] text-slate', sizes.subtitle)}>
          {COMPANY.product}
        </p>
      </div>
    </div>
  )
}
