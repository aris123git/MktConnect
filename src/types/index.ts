export type PaymentMethodId =
  | 'orange-money'
  | 'moov-money'
  | 'telecel-cash'
  | 'wave'
  | 'pay-on-site'

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'paid'
export type ConnectionStatus = 'online' | 'expiring' | 'offline'

export interface InternetPackage {
  id: string
  name: string
  durationLabel: string
  durationHours: number
  price: number
  description: string
  speedMbps: number
  active: boolean
  popular?: boolean
}

export interface PaymentMethod {
  id: PaymentMethodId
  name: string
  description: string
  category: 'mobile-money' | 'onsite'
}

export interface PendingRequest {
  id: string
  customer: string
  phone?: string
  device: string
  macAddress: string
  packageName: string
  paymentMethod: string
  amount: number
  status: RequestStatus
  createdAt: string
}

export interface ConnectedUser {
  id: string
  macAddress: string
  device: string
  packageName: string
  connectedAt: string
  remainingMinutes: number
  status: ConnectionStatus
}

export interface PaymentRecord {
  id: string
  customer: string
  packageName: string
  method: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  createdAt: string
}

export interface DashboardStats {
  todaysUsers: number
  todaysRevenue: number
  connectedUsers: number
  pendingRequests: number
  monthlyRevenue: number
}

export interface PortalOrder {
  packageId: string | null
  paymentMethodId: PaymentMethodId | null
  phoneNumber: string
}
