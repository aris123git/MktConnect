import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { COMPANY } from '@/data/mock'

export function SettingsPage() {
  const [hotspotName, setHotspotName] = useState(COMPANY.product)
  const [ssid, setSsid] = useState('MktConnect-Starlink')
  const [ownerPhone, setOwnerPhone] = useState('+226 70 00 00 00')
  const [autoApprove, setAutoApprove] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-slate">
          Configure portal branding and hotspot operator preferences.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portal branding</CardTitle>
            <CardDescription>
              These values will map to your FastAPI backend configuration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm text-slate">Hotspot name</label>
              <Input
                value={hotspotName}
                onChange={(event) => setHotspotName(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate">Wi-Fi SSID</label>
              <Input value={ssid} onChange={(event) => setSsid(event.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate">Owner phone</label>
              <Input
                value={ownerPhone}
                onChange={(event) => setOwnerPhone(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operations</CardTitle>
            <CardDescription>
              Frontend-only toggles for future MikroTik and payment workflows.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-start gap-3 rounded-2xl border border-line bg-cloud/70 p-4">
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={(event) => setAutoApprove(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-line text-brand"
              />
              <span>
                <span className="block font-semibold text-ink">
                  Auto-approve paid requests
                </span>
                <span className="mt-1 block text-sm text-slate">
                  When enabled, confirmed Mobile Money payments will grant
                  access without manual review.
                </span>
              </span>
            </label>

            <div className="rounded-2xl border border-line bg-white p-4 text-sm text-slate">
              Integration targets ready for wiring: MikroTik RouterOS API, Yenga
              API, Orange Money, Moov Money, Telecel Cash, Wave, FastAPI.
            </div>

            <Button onClick={save}>{saved ? 'Saved' : 'Save settings'}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
