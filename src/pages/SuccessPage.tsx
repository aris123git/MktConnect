import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Wifi } from 'lucide-react'
import { BrandMark } from '@/components/portal/BrandMark'
import { Button } from '@/components/ui/button'
import { formatFcfa } from '@/lib/utils'

interface SuccessState {
  packageName?: string
  paymentMethod?: string
  amount?: number
  phoneNumber?: string
}

export function SuccessPage() {
  const location = useLocation()
  const state = (location.state ?? {}) as SuccessState

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 surface-grid opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        <div className="mb-8 flex justify-center">
          <BrandMark />
        </div>

        <div className="glass rounded-[2rem] p-8 text-center md:p-10">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-success shadow-[0_18px_40px_rgba(15,159,110,0.35)]"
          >
            <Check className="h-12 w-12 text-white" strokeWidth={3} />
          </motion.div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Payment Request Created
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate">
            Your request has been submitted. Internet access will be activated
            after payment confirmation.
          </p>

          <div className="mt-8 space-y-3 rounded-2xl border border-line/80 bg-cloud/80 p-4 text-left text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate">Package</span>
              <span className="font-semibold text-ink">
                {state.packageName ?? 'Selected plan'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate">Payment</span>
              <span className="font-semibold text-ink">
                {state.paymentMethod ?? 'Pending'}
              </span>
            </div>
            {typeof state.amount === 'number' && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate">Amount</span>
                <span className="font-semibold text-brand">
                  {formatFcfa(state.amount)}
                </span>
              </div>
            )}
            {state.phoneNumber && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate">Phone</span>
                <span className="font-semibold text-ink">{state.phoneNumber}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate">
            <Wifi className="h-4 w-4 text-brand" />
            Waiting for hotspot activation
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="secondary">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to portal
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
