import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Info, Phone, SignalHigh } from 'lucide-react'
import { BrandMark } from '@/components/portal/BrandMark'
import { OrderSummary } from '@/components/portal/OrderSummary'
import { PackageCard } from '@/components/portal/PackageCard'
import { PaymentMethodCard } from '@/components/portal/PaymentMethodCard'
import { WifiIllustration } from '@/components/portal/WifiIllustration'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMikrotikSession } from '@/context/MikrotikSessionContext'
import { COMPANY, packages, paymentMethods } from '@/data/mock'
import { formatCommercialRemaining } from '@/lib/mikrotik'
import type { PaymentMethodId } from '@/types'

export function PortalPage() {
  const navigate = useNavigate()
  const { activeSession } = useMikrotikSession()
  const [packageId, setPackageId] = useState<string | null>('pkg-1d')
  const [paymentMethodId, setPaymentMethodId] = useState<PaymentMethodId | null>(
    null,
  )
  const [phoneNumber, setPhoneNumber] = useState('')

  const selectedPackage = useMemo(
    () => packages.find((item) => item.id === packageId) ?? null,
    [packageId],
  )
  const selectedPayment = useMemo(
    () => paymentMethods.find((item) => item.id === paymentMethodId) ?? null,
    [paymentMethodId],
  )

  const isMobileMoney = selectedPayment?.category === 'mobile-money'
  const isPayOnSite = selectedPayment?.id === 'pay-on-site'
  const phoneReady = phoneNumber.trim().length >= 8
  const hasActiveSession = Boolean(activeSession)

  const canSubmit =
    !hasActiveSession &&
    Boolean(selectedPackage && selectedPayment) &&
    (isPayOnSite || (isMobileMoney && phoneReady))

  const goToSuccess = () => {
    if (!selectedPackage || !selectedPayment || !canSubmit) return

    navigate('/success', {
      state: {
        packageId: selectedPackage.id,
        packageName: selectedPackage.durationLabel,
        durationHours: selectedPackage.durationHours,
        paymentMethod: selectedPayment.name,
        amount: selectedPackage.price,
        phoneNumber: isMobileMoney ? phoneNumber.trim() : undefined,
      },
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 surface-grid opacity-70" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-0 h-80 w-80 rounded-full bg-brand-deep/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-6 md:px-8 lg:px-10">
        <header className="mb-8 flex items-center justify-between gap-4">
          <BrandMark size="md" />
          <div className="flex items-center gap-2">
            {activeSession && (
              <Link
                to="/session"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300"
              >
                Live session
              </Link>
            )}
            <Link
              to="/admin"
              className="rounded-xl border border-line bg-white/70 px-3 py-2 text-xs font-semibold text-slate transition hover:border-brand/30 hover:text-brand"
            >
              Admin Dashboard
            </Link>
          </div>
        </header>

        {activeSession && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <SignalHigh className="mt-0.5 h-5 w-5 text-emerald-700" />
              <div>
                <p className="font-semibold text-emerald-900">
                  MikroTik session active — {activeSession.packageName}
                </p>
                <p className="mt-1 text-sm text-emerald-800/80">
                  Remaining{' '}
                  {formatCommercialRemaining(activeSession.remainingCommercialMs)}.
                  New purchases are blocked until this paid time ends.
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="secondary">
              <Link to="/session">View session</Link>
            </Button>
          </motion.div>
        )}

        <section className="mb-12 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
              Welcome to Starlink Hotspot
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate md:text-xl">
              {COMPANY.tagline}
            </p>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate/90">
              You are connected to a premium captive portal. Choose a package,
              pick your payment method, and get online in seconds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <WifiIllustration />
          </motion.div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-10">
            <section>
              <div className="mb-5">
                <h2 className="font-display text-2xl font-bold text-ink">
                  Internet Packages
                </h2>
                <p className="mt-1 text-sm text-slate">
                  Select the plan that matches how long you need to stay online.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.35 }}
                  >
                    <PackageCard
                      pkg={pkg}
                      selected={packageId === pkg.id}
                      onSelect={setPackageId}
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-5">
                <h2 className="font-display text-2xl font-bold text-ink">
                  Payment Methods
                </h2>
                <p className="mt-1 text-sm text-slate">
                  Choose one payment option to continue.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {paymentMethods.map((method, index) => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * index, duration: 0.3 }}
                  >
                    <PaymentMethodCard
                      method={method}
                      selected={paymentMethodId === method.id}
                      onSelect={(id) => {
                        setPaymentMethodId(id)
                        if (id === 'pay-on-site') setPhoneNumber('')
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {isPayOnSite && (
                  <motion.div
                    key="pay-on-site"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-4 rounded-2xl border border-brand/20 bg-brand-soft/40 p-4"
                  >
                    <div className="flex gap-3">
                      <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                      <div>
                        <p className="font-semibold text-ink">Pay on Site</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate">
                          You will pay directly to the hotspot owner. After
                          payment, your Internet access will be activated
                          immediately.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {isMobileMoney && (
                  <motion.div
                    key="mobile-money"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-4 rounded-2xl border border-line bg-white/80 p-5"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-brand" />
                      <p className="font-semibold text-ink">
                        {selectedPayment?.name} checkout
                      </p>
                    </div>
                    <label
                      className="mb-2 block text-sm text-slate"
                      htmlFor="phone"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      inputMode="tel"
                      placeholder="e.g. 70 12 34 56"
                      value={phoneNumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                    />
                    <Button
                      className="mt-4 w-full sm:w-auto"
                      disabled={!canSubmit}
                      onClick={goToSuccess}
                    >
                      Continue
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <div className="lg:hidden">
              <OrderSummary
                selectedPackage={selectedPackage}
                selectedPayment={selectedPayment}
                canPay={canSubmit}
                onPay={goToSuccess}
                sticky={false}
              />
            </div>
          </div>

          <div className="hidden lg:block">
            <OrderSummary
              selectedPackage={selectedPackage}
              selectedPayment={selectedPayment}
              canPay={canSubmit}
              onPay={goToSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
