import { useState } from 'react'
import { Plus, MapPin, Phone, Edit2, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Loading, ErrorState } from '../components/LoadingState'
import { useApp } from '../context/AppContext'
import { api, type Shop } from '../services/api'

export default function Shops() {
  const { shops, loading, error, refresh } = useApp()
  const [editing, setEditing] = useState<Shop | null>(null)
  const [creating, setCreating] = useState(false)

  if (loading) return <Loading />
  if (error) return <ErrorState message={error} />

  return (
    <div>
      <PageHeader
        title="Shops"
        subtitle={`${shops.length} shops`}
        action={
          <button
            onClick={() => setCreating(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Shop
          </button>
        }
      />

      {shops.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          No shops yet. Click "Add Shop" to create your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map(shop => (
            <div key={shop.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{shop.name}</h3>
                    <span className="text-xs text-slate-500">{shop.id}</span>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(shop)}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-500"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-600 mb-2">{shop.address}</p>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                <Phone className="w-3.5 h-3.5" />
                <span>{shop.contact}</span>
              </div>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                shop.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {shop.active ? '● Active' : '○ Inactive'}
              </span>
            </div>
          ))}
        </div>
      )}

      {(creating || editing) && (
        <ShopFormModal
          shop={editing}
          onClose={() => { setEditing(null); setCreating(false) }}
          onSaved={() => { refresh(); setEditing(null); setCreating(false) }}
        />
      )}
    </div>
  )
}

function ShopFormModal({ shop, onClose, onSaved }: { shop: Shop | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!shop
  const [id, setId] = useState(shop?.id ?? '')
  const [name, setName] = useState(shop?.name ?? '')
  const [address, setAddress] = useState(shop?.address ?? '')
  const [contact, setContact] = useState(shop?.contact ?? '')
  const [active, setActive] = useState(shop?.active ?? true)
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErr(null)
    try {
      if (isEdit) await api.shops.update(id, { id, name, address, contact, active })
      else        await api.shops.create({ id, name, address, contact, active })
      onSaved()
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Failed')
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">{isEdit ? 'Edit Shop' : 'Add Shop'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Shop ID</label>
            <input
              value={id}
              onChange={e => setId(e.target.value.toUpperCase())}
              placeholder="SHP006"
              disabled={isEdit}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact</label>
            <input value={contact} onChange={e => setContact(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" required />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} />
            Active
          </label>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded-lg text-sm font-medium">
              {submitting ? 'Saving…' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
