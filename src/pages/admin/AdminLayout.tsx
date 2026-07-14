import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Button } from '@/components/ui/button'

export function AdminLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f9fc_0%,#eef3fb_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <div className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            <AdminSidebar />
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-ink/40"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <div className="relative h-full w-72 max-w-[85vw]">
              <AdminSidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line/70 bg-white/75 px-4 py-3 backdrop-blur-xl md:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="icon"
                className="lg:hidden"
                onClick={() => setOpen((value) => !value)}
                aria-label="Toggle sidebar"
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              <div>
                <p className="font-display text-lg font-bold text-ink">Dashboard</p>
                <p className="text-xs text-slate">
                  Manage hotspot access, packages and payments
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold text-slate transition hover:border-brand/30 hover:text-brand"
            >
              Open Portal
            </Link>
          </header>

          <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
