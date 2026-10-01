import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CalendarDays } from 'lucide-react'
import { api } from '../lib/api.js'

export default function SearchForm({ product }) {
  const navigate = useNavigate()
  const [values, setValues] = useState({})
  const [asyncData, setAsyncData] = useState({})

  const today = (() => {
    const d = new Date()
    const p = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
  })()

  useEffect(() => {
    const need = (product.fields || []).filter((f) => f.asyncOptions && !asyncData[f.key]?.options)
    if (need.length === 0) return
    need.forEach((field) => {
      setAsyncData((prev) => ({ ...prev, [field.key]: { status: 'loading' } }))
      api(field.asyncOptions.url)
        .then((list) => {
          setAsyncData((prev) => ({ ...prev, [field.key]: { status: 'ready', options: Array.isArray(list) ? list : [] } }))
        })
        .catch(() => {
          setAsyncData((prev) => ({ ...prev, [field.key]: { status: 'error' } }))
        })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  const setValue = (key, value) => setValues((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    for (const field of product.fields) {
      const v = values[field.key]
      if (v && String(v).trim() !== '' && String(v).trim().toLowerCase() !== 'semua') {
        params.set(field.key, String(v).trim())
      }
    }
    navigate(`/search/${product.key}?${params.toString()}`)
  }

  const renderField = (field) => {
    if (field.type === 'select') {
      if (field.asyncOptions) {
        const async = asyncData[field.key]
        if (async?.status === 'error') {
          return (
            <input
              type="text"
              placeholder={`Ketik ${field.label.toLowerCase()} (contoh: Gambir)`}
              value={values[field.key] ?? ''}
              required
              onChange={(e) => setValue(field.key, e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-sm font-medium text-white shadow-sm outline-none transition placeholder:text-slate-400 focus:border-travel-400 focus:ring-2 focus:ring-travel-400/30"
            />
          )
        }
        const isReady = async?.status === 'ready'
        return (
          <select
            value={values[field.key] ?? ''}
            onChange={(e) => setValue(field.key, e.target.value)}
            disabled={!isReady}
            className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-sm font-medium text-white shadow-sm outline-none transition focus:border-travel-400 focus:ring-2 focus:ring-travel-400/30 disabled:opacity-60"
          >
            <option value="" className="bg-slate-900 text-white">
              {!isReady ? 'Memuat daftar stasiun...' : `Pilih ${field.label}`}
            </option>
            {isReady &&
              async.options?.map((opt) => {
                const v = field.asyncOptions.value(opt)
                return (
                  <option key={v} value={v} className="bg-slate-900 text-white">
                    {field.asyncOptions.label(opt)}
                  </option>
                )
              })}
          </select>
        )
      }
      return (
        <select
          value={values[field.key] ?? ''}
          onChange={(e) => setValue(field.key, e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-sm font-medium text-white shadow-sm outline-none transition focus:border-travel-400 focus:ring-2 focus:ring-travel-400/30"
        >
          {(field.options || []).map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>
      )
    }
    return (
      <input
        type={field.type ?? 'text'}
        placeholder={field.placeholder}
        value={values[field.key] ?? ''}
        required
        min={field.type === 'date' ? (field.key === 'checkIn' ? today : values.checkIn || today) : undefined}
        onChange={(e) => setValue(field.key, e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-sm font-medium text-white shadow-sm outline-none transition placeholder:text-slate-400 focus:border-travel-400 focus:ring-2 focus:ring-travel-400/30"
      />
    )
  }

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
      <div className="mb-5 flex items-center gap-2">
        <CalendarDays size={20} className="text-travel-300" />
        <span className="font-bold text-white">Cari {product.label}</span>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {product.fields.map((field) => (
            <label key={field.key} className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-300">
                {field.label}
              </span>
              {renderField(field)}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-travel-600 to-travel-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-travel-600/40 transition hover:brightness-110 active:scale-[0.98]"
        >
          <Search size={18} />
          Cari dan Bandingkan
        </button>
      </form>
    </div>
  )
}