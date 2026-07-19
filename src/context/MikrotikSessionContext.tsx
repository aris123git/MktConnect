import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
  type ReactNode,
} from 'react'
import {
  disconnectSession,
  getActiveSessionForDevice,
  getDeviceIdentity,
  grantAccess,
  listSessionViews,
  type MikrotikGrantInput,
  type MikrotikSessionView,
} from '@/lib/mikrotik'

interface MikrotikContextValue {
  deviceMac: string
  deviceName: string
  activeSession: MikrotikSessionView | null
  sessions: MikrotikSessionView[]
  refresh: () => void
  activateAccess: (input: MikrotikGrantInput) => MikrotikSessionView
  disconnect: (sessionId: string) => void
}

const MikrotikSessionContext = createContext<MikrotikContextValue | null>(null)

function readState() {
  const identity = getDeviceIdentity()
  return {
    deviceMac: identity.macAddress,
    deviceName: identity.deviceName,
    activeSession: getActiveSessionForDevice(),
    sessions: listSessionViews(),
  }
}

export function MikrotikSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(readState)

  const refresh = useEffectEvent(() => {
    setState(readState())
  })

  useEffect(() => {
    refresh()
    const timer = window.setInterval(() => refresh(), 250)
    const onStorage = (event: StorageEvent) => {
      if (event.key?.includes('mktconnect.mikrotik')) refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const activateAccess = (input: MikrotikGrantInput) => {
    const session = grantAccess(input)
    refresh()
    return session
  }

  const disconnect = (sessionId: string) => {
    disconnectSession(sessionId)
    refresh()
  }

  return (
    <MikrotikSessionContext.Provider
      value={{
        ...state,
        refresh,
        activateAccess,
        disconnect,
      }}
    >
      {children}
    </MikrotikSessionContext.Provider>
  )
}

export function useMikrotikSession() {
  const ctx = useContext(MikrotikSessionContext)
  if (!ctx) {
    throw new Error('useMikrotikSession must be used within MikrotikSessionProvider')
  }
  return ctx
}
