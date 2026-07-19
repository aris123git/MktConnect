export type MikrotikSessionStatus = 'active' | 'expiring' | 'expired' | 'disconnected'

export interface MikrotikGrantInput {
  packageId: string
  packageName: string
  durationHours: number
  amountPaid: number
  paymentMethod: string
  phoneNumber?: string
  customerName?: string
  /** Optional override (admin approval for another device). */
  macAddress?: string
  device?: string
  /** When true, replaces any existing active session for this device. */
  forceReplace?: boolean
}

export interface MikrotikSession {
  id: string
  macAddress: string
  device: string
  customerName: string
  phoneNumber?: string
  packageId: string
  packageName: string
  amountPaid: number
  paymentMethod: string
  /** Commercial duration purchased (hours). Hard ceiling. */
  durationHours: number
  /** Wall-clock when MikroTik granted access. */
  connectedAt: string
  /** Absolute expiry timestamp (ISO). Never extended beyond purchase. */
  expiresAt: string
  status: MikrotikSessionStatus
  /** Simulation: milliseconds of real time granted for this package. */
  grantedMs: number
}

export interface MikrotikSessionView extends MikrotikSession {
  remainingMs: number
  remainingCommercialMs: number
  usedPercent: number
  isOnline: boolean
}

export interface MikrotikStoreState {
  sessions: MikrotikSession[]
  deviceMac: string
  deviceName: string
}
