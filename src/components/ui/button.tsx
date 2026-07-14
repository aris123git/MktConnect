import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-brand text-white shadow-[0_12px_28px_rgba(11,99,246,0.28)] hover:bg-brand-deep hover:-translate-y-0.5',
        secondary:
          'bg-white text-ink border border-line hover:border-brand/40 hover:bg-brand-soft/40',
        ghost: 'bg-transparent text-slate hover:bg-mist hover:text-ink',
        danger:
          'bg-danger text-white hover:bg-red-700 shadow-[0_10px_24px_rgba(220,38,38,0.22)]',
        success:
          'bg-success text-white hover:bg-emerald-700 shadow-[0_10px_24px_rgba(15,159,110,0.22)]',
        outline: 'border border-line bg-transparent text-ink hover:bg-cloud',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-12 px-7 text-base rounded-2xl',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
