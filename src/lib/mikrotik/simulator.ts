import {
  commercialMsForHours,
  grantedMsForHours,
  MIKROTIK_SIM,
} from './config'
import {
  loadStore,
  replaceActiveForMac,
  saveStore,
  upsertSession,
} from './store'
import type {
  MikrotikGrantInput,
  MikrotikSession,
  MikrotikSessionView,
  MikrotikStoreState,
} from './types'

function nowMs(): number {
  return Date.now()
}

function clampRemaining(expiresAt: string, now = nowMs()): number {
  return Math.max(0, new Date(expiresAt).getTime() - now)
}

function deriveStatus(
  remainingMs: number,
  grantedMs: number,
  current: MikrotikSession['status'],
): MikrotikSession['status'] {
  if (current === 'disconnected') return 'disconnected'
  if (remainingMs <= 0) return 'expired'
  if (remainingMs / grantedMs <= MIKROTIK_SIM.expiringRatio) return 'expiring'
  return 'active'
}

export function toSessionView(
  session: MikrotikSession,
  now = nowMs(),
): MikrotikSessionView {
  const remainingMs = clampRemaining(session.expiresAt, now)
  const status = deriveStatus(remainingMs, session.grantedMs, session.status)
  const usedPercent =
    session.grantedMs <= 0
      ? 100
      : Math.min(100, ((session.grantedMs - remainingMs) / session.grantedMs) * 100)

  const remainingRatio = session.grantedMs <= 0 ? 0 : remainingMs / session.grantedMs
  const remainingCommercialMs =
    remainingRatio * commercialMsForHours(session.durationHours)

  return {
    ...session,
    status,
    remainingMs,
    remainingCommercialMs,
    usedPercent,
    isOnline: status === 'active' || status === 'expiring',
  }
}

function refreshSessions(state: MikrotikStoreState, now = nowMs()): MikrotikStoreState {
  let changed = false
  const sessions = state.sessions.map((session) => {
    const view = toSessionView(session, now)
    if (view.status !== session.status) {
      changed = true
      return { ...session, status: view.status }
    }
    return session
  })
  return changed ? { ...state, sessions } : state
}

export function getStoreSnapshot(): MikrotikStoreState {
  const refreshed = refreshSessions(loadStore())
  saveStore(refreshed)
  return refreshed
}

export function listSessionViews(now = nowMs()): MikrotikSessionView[] {
  return getStoreSnapshot()
    .sessions.map((session) => toSessionView(session, now))
    .sort(
      (a, b) =>
        new Date(b.connectedAt).getTime() - new Date(a.connectedAt).getTime(),
    )
}

export function getActiveSessionForDevice(
  now = nowMs(),
): MikrotikSessionView | null {
  const state = getStoreSnapshot()
  const active = state.sessions
    .map((session) => toSessionView(session, now))
    .find(
      (session) =>
        session.macAddress === state.deviceMac && session.isOnline,
    )
  return active ?? null
}

export function getDeviceIdentity() {
  const state = getStoreSnapshot()
  return { macAddress: state.deviceMac, deviceName: state.deviceName }
}

/**
 * Grant hotspot access for exactly the purchased package duration.
 * Hard rule: expiresAt is computed from durationHours and never exceeds it.
 */
export function grantAccess(input: MikrotikGrantInput): MikrotikSessionView {
  if (input.durationHours <= 0) {
    throw new Error('Invalid package duration')
  }
  if (input.amountPaid <= 0) {
    throw new Error('Payment amount required to grant access')
  }

  const state = getStoreSnapshot()
  const macAddress = input.macAddress || state.deviceMac
  const device = input.device || state.deviceName

  const existingForMac = state.sessions
    .map((session) => toSessionView(session))
    .find((session) => session.macAddress === macAddress && session.isOnline)

  if (existingForMac && !input.forceReplace) {
    throw new Error(
      'An active MikroTik session already exists for this device. Finish it before buying more time.',
    )
  }

  const grantedMs = grantedMsForHours(input.durationHours)
  const connectedAt = new Date()
  // Absolute ceiling: expiresAt is strictly durationHours from grant time.
  const maxExpiry = connectedAt.getTime() + grantedMs
  const expiresAt = new Date(maxExpiry)

  const session: MikrotikSession = {
    id: `mk-${connectedAt.getTime()}-${macAddress.replace(/:/g, '').slice(-6)}`,
    macAddress,
    device,
    customerName: input.customerName || input.phoneNumber || 'Guest',
    phoneNumber: input.phoneNumber,
    packageId: input.packageId,
    packageName: input.packageName,
    amountPaid: input.amountPaid,
    paymentMethod: input.paymentMethod,
    durationHours: input.durationHours,
    connectedAt: connectedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: 'active',
    grantedMs,
  }

  const next = input.forceReplace
    ? replaceActiveForMac(state, macAddress, session)
    : upsertSession(state, session)

  saveStore(next)
  return toSessionView(session)
}

export function disconnectSession(sessionId: string): MikrotikSessionView | null {
  const state = getStoreSnapshot()
  const target = state.sessions.find((session) => session.id === sessionId)
  if (!target) return null

  const disconnected: MikrotikSession = {
    ...target,
    status: 'disconnected',
    expiresAt: new Date().toISOString(),
  }
  saveStore(upsertSession(state, disconnected))
  return toSessionView(disconnected)
}

export function clearAllSessions(): void {
  const state = getStoreSnapshot()
  saveStore({ ...state, sessions: [] })
}

export function formatCommercialRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    const remHours = hours % 24
    return `${days}d ${remHours}h ${minutes}m`
  }
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

export function formatDemoHint(durationHours: number): string {
  const seconds = Math.round(grantedMsForHours(durationHours) / 1000)
  return `${durationHours}h package ≈ ${seconds}s in demo clock`
}
