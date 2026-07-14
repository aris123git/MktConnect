import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { packages as initialPackages } from '@/data/mock'
import { formatFcfa } from '@/lib/utils'
import type { InternetPackage } from '@/types'

const emptyForm = {
  name: '',
  durationLabel: '',
  durationHours: 24,
  price: 200,
  description: '',
  speedMbps: 50,
  active: true,
}

export function PackagesPage() {
  const [items, setItems] = useState<InternetPackage[]>(initialPackages)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const startEdit = (pkg: InternetPackage) => {
    setEditingId(pkg.id)
    setForm({
      name: pkg.name,
      durationLabel: pkg.durationLabel,
      durationHours: pkg.durationHours,
      price: pkg.price,
      description: pkg.description,
      speedMbps: pkg.speedMbps,
      active: pkg.active,
    })
  }

  const savePackage = () => {
    if (!form.name.trim() || !form.durationLabel.trim() || !form.description.trim()) {
      return
    }

    if (editingId) {
      setItems((current) =>
        current.map((pkg) =>
          pkg.id === editingId
            ? {
                ...pkg,
                ...form,
                name: form.name.trim(),
                durationLabel: form.durationLabel.trim(),
                description: form.description.trim(),
              }
            : pkg,
        ),
      )
    } else {
      const created: InternetPackage = {
        id: `pkg-${Date.now()}`,
        ...form,
        name: form.name.trim(),
        durationLabel: form.durationLabel.trim(),
        description: form.description.trim(),
      }
      setItems((current) => [...current, created])
    }

    resetForm()
  }

  const removePackage = (id: string) => {
    setItems((current) => current.filter((pkg) => pkg.id !== id))
    if (editingId === id) resetForm()
  }

  const toggleActive = (id: string) => {
    setItems((current) =>
      current.map((pkg) =>
        pkg.id === id ? { ...pkg, active: !pkg.active } : pkg,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">
          Packages Management
        </h1>
        <p className="mt-1 text-sm text-slate">
          Create, update and activate internet packages for the captive portal.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit package' : 'Add package'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm text-slate">Package Name</label>
              <Input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="1 Day"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate">Duration</label>
              <Input
                value={form.durationLabel}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    durationLabel: event.target.value,
                  }))
                }
                placeholder="1 Day"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm text-slate">Price</label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      price: Number(event.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-slate">Speed (Mbps)</label>
                <Input
                  type="number"
                  value={form.speedMbps}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      speedMbps: Number(event.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate">Description</label>
              <Input
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Full-day access for travelers"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    active: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-line text-brand"
              />
              Active
            </label>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={savePackage}>
                <Plus className="h-4 w-4" />
                {editingId ? 'Update' : 'Create'}
              </Button>
              {editingId && (
                <Button variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Package catalog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((pkg) => (
              <div
                key={pkg.id}
                className="flex flex-col gap-3 rounded-2xl border border-line/70 bg-cloud/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-lg font-bold text-ink">
                      {pkg.name}
                    </p>
                    <Badge variant={pkg.active ? 'success' : 'muted'}>
                      {pkg.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate">{pkg.description}</p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {pkg.durationLabel} · {formatFcfa(pkg.price)} ·{' '}
                    {pkg.speedMbps} Mbps
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => startEdit(pkg)}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(pkg.id)}
                  >
                    {pkg.active ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => removePackage(pkg.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
