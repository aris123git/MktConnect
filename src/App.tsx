import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MikrotikSessionProvider } from '@/context/MikrotikSessionContext'
import { PortalPage } from '@/pages/PortalPage'
import { SuccessPage } from '@/pages/SuccessPage'
import { SessionPage } from '@/pages/SessionPage'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { OverviewPage } from '@/pages/admin/OverviewPage'
import { PendingRequestsPage } from '@/pages/admin/PendingRequestsPage'
import { ConnectedUsersPage } from '@/pages/admin/ConnectedUsersPage'
import { PackagesPage } from '@/pages/admin/PackagesPage'
import { PaymentsPage } from '@/pages/admin/PaymentsPage'
import { StatisticsPage } from '@/pages/admin/StatisticsPage'
import { SettingsPage } from '@/pages/admin/SettingsPage'

export default function App() {
  return (
    <MikrotikSessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortalPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/session" element={<SessionPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="pending" element={<PendingRequestsPage />} />
            <Route path="users" element={<ConnectedUsersPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="statistics" element={<StatisticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MikrotikSessionProvider>
  )
}
