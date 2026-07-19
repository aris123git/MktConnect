import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock3,
  Router,
  ShieldCheck,
  SignalHigh,
  Unplug,
  Wifi,
} from 'lucide-react'
import { BrandMark } from '@/components/portal/BrandMark'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useMikrotikSession } from '@/context/MikrotikSessionContext'
import { MIKROTIK_SIM, formatCommercialRemaining, formatDemoHint } from '@/lib/mikrotik'
import { formatFcfa } from '@/lib/utils'

export function SessionPage() {
  const { activeSession, deviceMac, disconnect, sessions } = useMikrotikSession()
  const latest = activeSession ?? sessions[0] ?? null

  if (!latest) {
    return <Navigate to="/" replace />
  }

  const online = latest.isOnline
  const remainingLabel = formatCommercialRemaining(latest.remainingCommercialMs)

  return (
    <div className="relative min-h-screen px-4 py-8 md:px-8">
      <div className="pointer-events-none absolute inset-0 surface-grid opacity-60" />
      <div className="relative mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between gap-3">
          <BrandMark />
          <Link
            to="/admin/users"
            className="rounded-xl border border-line bg-white/70 px-3 py-2 text-xs font-semibold text-slate transition hover:border-brand/30 hover:text-brand"
          >
            Admin sessions
          </Link>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2rem] p-6 md:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate">
                MikroTik Hotspot Session
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">
                {online ? 'You are online' : 'Session ended'}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate">
                Access time is strictly limited to the package you paid for.
                MikroTik will cut the connection when the purchased duration is
                reached — no overrun.
              </p>
            </div>
            <Badge variant={online ? (latest.status === 'expiring' ? 'warning' : 'success') : 'danger'}>
              {online
                ? latest.status === 'expiring'
                  ? 'Expiring soon'
                  : 'Connected'
                : latest.status === 'expired'
                  ? 'Expired'
                  : 'Disconnected'}
            </Badge>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line/80 bg-cloud/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-slate">
                <Clock3 className="h-4 w-4 text-brand" />
                Remaining time
              </div>
              <p
                className="font-display text-3xl font-bold text-ink"
                data-testid="remaining-time"
              >
                {online ? remainingLabel : '0s'}
              </p>
              <p className="mt-2 text-xs text-slate">
                Purchased: {latest.packageName} ({latest.durationHours}h ceiling)
              </p>
            </div>

            <div className="rounded-2xl border border-line/80 bg-cloud/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-slate">
                <Wifi className="h-4 w-4 text-brand" />
                Package / payment
              </div>
              <p className="font-display text-2xl font-bold text-ink">
                {latest.packageName}
              </p>
              <p className="mt-2 text-sm text-slate">
                {formatFcfa(latest.amountPaid)} · {latest.paymentMethod}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-slate">
              <span>Consumed</span>
              <span>{Math.round(latest.usedPercent)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-mist">
              <motion.div
                className={`h-full rounded-full ${
                  latest.status === 'expiring'
                    ? 'bg-amber-500'
                    : online
                      ? 'bg-gradient-to-r from-brand to-brand-deep'
                      : 'bg-slate'
                }`}
                initial={false}
                animate={{ width: `${latest.usedPercent}%` }}
                transition={{ duration: 0.25 }}
              />
            </div>
          </div>

          <dl className="mt-8 grid gap-3 rounded-2xl border border-line/80 bg-white/70 p-4 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-3 sm:block">
              <dt className="text-slate">MAC address</dt>
              <dd className="font-mono font-semibold text-ink" data-testid="session-mac">
                {deviceMac}
              </dd>
            </div>
            <div className="flex justify-between gap-3 sm:block">
              <dt className="text-slate">Device</dt>
              <dd className="font-semibold text-ink">{latest.device}</dd>
            </div>
            <div className="flex justify-between gap-3 sm:block">
              <dt className="text-slate">Router</dt>
              <dd className="font-semibold text-ink">{MIKROTIK_SIM.routerName}</dd>
            </div>
            <div className="flex justify-between gap-3 sm:block">
              <dt className="text-slate">API</dt>
              <dd className="font-semibold text-ink">{MIKROTIK_SIM.apiEndpoint}</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-start gap-2 rounded-2xl border border-brand/20 bg-brand-soft/40 p-4 text-sm text-slate">
            <Router className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <div>
              <p className="font-semibold text-ink">Simulation clock</p>
              <p className="mt-1">
                {formatDemoHint(latest.durationHours)}. Commercial remaining time
                is shown above; MikroTik hard-stops at 100% consumption.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {online ? (
              <Button
                variant="danger"
                onClick={() => disconnect(latest.id)}
                data-testid="disconnect-session"
              >
                <Unplug className="h-4 w-4" />
                Disconnect now
              </Button>
            ) : (
              <Button asChild>
                <Link to="/">Buy more time</Link>
              </Button>
            )}
            <Button asChild variant="secondary">
              <Link to="/">Back to portal</Link>
            </Button>
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs text-slate">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" />
            Duration locked to paid amount — cannot exceed purchased package.
            <SignalHigh className="h-3.5 w-3.5 text-brand" />
          </p>
        </motion.div>
      </div>
    </div>
  )
}
