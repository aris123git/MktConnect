import { MIKROTIK_SIM } from './config'
import type { MikrotikSession, MikrotikStoreState } from './types'

function randomMac(): string {
  const bytes = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase(),
  )
  return bytes.join(':')
}

function detectDevice(): string {
  const ua = navigator.userAgent
  if (/iPhone/i.test(ua)) return 'iPhone'
  if (/iPad/i.test(ua)) return 'iPad'
  if (/Android/i.test(ua)) return 'Android Device'
  if (/Mac/i.test(ua)) return 'Mac'
  if (/Windows/i.test(ua)) return 'Windows PC'
  return 'Guest Device'
}

export function createDefaultState(): MikrotikStoreState {
  return {
    sessions: [],
    deviceMac: randomMac(),
    deviceName: detectDevice(),
  }
}

export function loadStore(): MikrotikStoreState {
  try {
    const raw = localStorage.getItem(MIKROTIK_SIM.storageKey)
    if (!raw) return createDefaultState()
    const parsed = JSON.parse(raw) as MikrotikStoreState
    if (!parsed.deviceMac || !Array.isArray(parsed.sessions)) {
      return createDefaultState()
    }
    return {
      ...parsed,
      deviceName: parsed.deviceName || detectDevice(),
    }
  } catch {
    return createDefaultState()
  }
}

export function saveStore(state: MikrotikStoreState): void {
  localStorage.setItem(MIKROTIK_SIM.storageKey, JSON.stringify(state))
}

export function upsertSession(
  state: MikrotikStoreState,
  session: MikrotikSession,
): MikrotikStoreState {
  const others = state.sessions.filter((item) => item.id !== session.id)
  return {
    ...state,
    sessions: [session, ...others],
  }
}

export function replaceActiveForMac(
  state: MikrotikStoreState,
  macAddress: string,
  session: MikrotikSession,
): MikrotikStoreState {
  const closed = state.sessions.map((item) =>
    item.macAddress === macAddress &&
    (item.status === 'active' || item.status === 'expiring')
      ? { ...item, status: 'disconnected' as const, expiresAt: new Date().toISOString() }
      : item,
  )
  return {
    ...state,
    sessions: [session, ...closed.filter((item) => item.id !== session.id)],
  }
}
