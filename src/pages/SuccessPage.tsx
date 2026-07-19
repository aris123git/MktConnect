import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, LoaderCircle, Router, Wifi } from 'lucide-react'
import { BrandMark } from '@/components/portal/BrandMark'
import { Button } from '@/components/ui/button'
import { useMikrotikSession } from '@/context/MikrotikSessionContext'
import { formatDemoHint } from '@/lib/mikrotik'
import { formatFcfa } from '@/lib/utils'

export interface PaymentSuccessState {
  packageId?: string
  packageName?: string
  durationHours?: number
  paymentMethod?: string
  amount?: number
  phoneNumber?: string
}

type Phase = 'confirming' | 'activating' | 'online' | 'error'

export function SuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = (location.state ?? {}) as PaymentSuccessState
  const { activateAccess, activeSession } = useMikrotikSession()
  const [phase, setPhase] = useState<Phase>('confirming')
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const durationHours = state.durationHours
    const amount = state.amount
    const packageId = state.packageId
    const packageName = state.packageName
    const paymentMethod = state.paymentMethod

    if (!durationHours || !amount || !packageId || !packageName || !paymentMethod) {
      setPhase('error')
      setError('Missing payment details. Please restart from the portal.')
      return
    }

    const run = async () => {
      setPhase('confirming')
      await wait(700)
      setPhase('activating')
      await wait(900)

      try {
        activateAccess({
          packageId,
          packageName,
          durationHours,
          amountPaid: amount,
          paymentMethod,
          phoneNumber: state.phoneNumber,
          forceReplace: false,
        })
        setPhase('online')
        await wait(700)
        navigate('/session', { replace: true })
      } catch (err) {
        setPhase('error')
        setError(err instanceof Error ? err.message : 'MikroTik activation failed')
      }
    }

    void run()
  }, [activateAccess, navigate, state])

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
            className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full shadow-[0_18px_40px_rgba(15,159,110,0.35)] ${
              phase === 'error'
                ? 'bg-gradient-to-br from-red-400 to-danger'
                : 'bg-gradient-to-br from-emerald-400 to-success'
            }`}
          >
            {phase === 'confirming' || phase === 'activating' ? (
              <LoaderCircle className="h-12 w-12 animate-spin text-white" />
            ) : (
              <Check className="h-12 w-12 text-white" strokeWidth={3} />
            )}
          </motion.div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {phase === 'confirming' && 'Payment confirmed'}
            {phase === 'activating' && 'Activating MikroTik access'}
            {phase === 'online' && 'Internet access granted'}
            {phase === 'error' && 'Activation blocked'}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate">
            {phase === 'confirming' &&
              'Your payment request was accepted. Preparing hotspot authorization…'}
            {phase === 'activating' &&
              'Calling simulated MikroTik RouterOS API to bind MAC ↔ package duration.'}
            {phase === 'online' &&
              'You are connected. Remaining time matches exactly what you paid for.'}
            {phase === 'error' && (error ?? 'Unable to activate session.')}
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
            {typeof state.durationHours === 'number' && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate">Duration ceiling</span>
                <span className="font-semibold text-ink">
                  {state.durationHours}h (hard limit)
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

          {typeof state.durationHours === 'number' && (
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate">
              <Router className="h-3.5 w-3.5 text-brand" />
              {formatDemoHint(state.durationHours)}
            </p>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate">
            <Wifi className="h-4 w-4 text-brand" />
            {phase === 'online' || activeSession
              ? 'Hotspot session active'
              : 'Binding device to MikroTik user-manager profile'}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {(phase === 'online' || activeSession) && (
              <Button asChild>
                <Link to="/session">
                  Open live session
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {phase === 'error' && activeSession && (
              <Button asChild>
                <Link to="/session">View current session</Link>
              </Button>
            )}
            <Button asChild variant="secondary">
              <Link to="/">Back to portal</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
