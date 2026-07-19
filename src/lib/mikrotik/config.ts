/**
 * MikroTik hotspot simulation config.
 *
 * Demo acceleration: 1 purchased hour ≈ 8 real seconds.
 * This lets us prove expiry without waiting hours, while the UI still
 * shows commercial remaining time (mapped from the paid package).
 */
export const MIKROTIK_SIM = {
  storageKey: 'mktconnect.mikrotik.v1',
  /** Real milliseconds corresponding to 1 purchased package hour. */
  msPerPackageHour: 8_000,
  /** Warn when less than this commercial ratio remains. */
  expiringRatio: 0.12,
  routerName: 'MikroTik CCR2004-Hotspot-01',
  apiEndpoint: '/api/mikrotik/hotspot (simulated)',
} as const

export function grantedMsForHours(durationHours: number): number {
  return Math.max(1, durationHours) * MIKROTIK_SIM.msPerPackageHour
}

export function commercialMsForHours(durationHours: number): number {
  return Math.max(1, durationHours) * 60 * 60 * 1000
}
