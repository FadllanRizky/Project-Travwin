import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Clock, Users, CircleAlert } from 'lucide-react'
import { getProduct, translateBadge } from '../data/products.js'
import { api, formatRupiah, formatDateTime, getField } from '../lib/api.js'

export default function SearchResults() {
  const { product: productKey } = useParams()
  const [params] = useSearchParams()
  const product = getProduct(productKey)

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  const paramsForQuery = new URLSearchParams()
  for (const field of product.fields) {
    const v = params.get(field.key)
    if (v) paramsForQuery.set(field.key, v)
  }
  const queryString = product.endpoint + (paramsForQuery.toString() ? '?' + paramsForQuery.toString() : '')

  useEffect(() => {
    setLoading(true)
    setError('')
    setItems([])
    setSelected(null)
    api(queryString)
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Respon tidak valid dari server.')
        setItems(data)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [queryString])

  const subtitle = (item) => {
    const parts = product.cardSubtitle
      .map((field) => (typeof field === 'function' ? field(item) : getField(item, field)))
      .filter((v) => v != null && String(v).trim() !== '')
      .join(' · ')
    return parts
  }

  const meta = (item) =>
    product.cardMeta
      .map((m) => ({ ...m, value: getField(item, m.field) }))
      .filter((m) => m.value != null && String(m.value).trim() !== '')

  if (!product) {
    return <Section className="max-w-3xl"><InfoBox type="error">Produk tidak ditemukan.</InfoBox></Section>
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
      >
        <ArrowLeft size={18} /> Kembali ke Beranda
      </Link>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white text-shadow">
            Hasil {product.label}
          </h1>
          <p className="text-sm text-white/70">
            {items.length} hasil ditemukan{params.get('city') ? ` untuk "${params.get('city')}"` : ''}
            {params.get('origin') ? ` — ${params.get('origin')} → ${params.get('destination') ?? ''}` : ''}
          </p>
        </div>
      </div>

      {loading && <SkeletonList />}
      {error && <InfoBox type="error">Gagal memuat data: {error}</InfoBox>}
      {!loading && !error && items.length === 0 && (
        <InfoBox type="empty">
          Tidak ada jadwal ditemukan. Coba ubah kata kunci pencarian atau masukkan data contoh (seed) ke service terkait.
        </InfoBox>
      )}

      <div className="grid gap-4">
        {!loading &&
          !error &&
          items.map((item, i) => {
            const badge = translateBadge(product.key, getField(item, product.cardBadge))
            const price = product.cardPrice ? getField(item, product.cardPrice) : null
            const unit = product.unit ?? ''
            return (
              <motion.div
                key={item.id ?? i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass rounded-2xl p-5 transition ring-2 ${
                  selected?.id === item.id
                    ? 'ring-travel-500 shadow-xl'
                    : 'ring-transparent hover:ring-travel-300'
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg font-extrabold text-slate-900">
                        {getField(item, product.cardTitle) ?? '-'}
                      </h3>
                      {badge && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            badge.ok
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {badge.text}
                        </span>
                      )}
                    </div>
                    {subtitle(item) && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-travel-500" />
                        {subtitle(item)}
                      </p>
                    )}

                    {meta(item).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600">
                        {meta(item).map((m) => (
                          <span key={m.label} className="inline-flex items-center gap-1.5">
                            {m.label === 'Rating' ? (
                              <><Star size={13} className="text-amber-500" /> {m.value}</>
                            ) : m.label === 'Kursi' || m.label === 'Kapasitas' ? (
                              <><Users size={13} className="text-travel-600" /> {m.label}: {m.value}</>
                            ) : m.label === 'Berangkat' || m.label === 'Tiba' ? (
                              <><Clock size={13} className="text-travel-600" /> {m.label}: {formatDateTime(m.value)}</>
                            ) : (
                              <><span className="font-semibold text-slate-500">{m.label}:</span> {m.value}{m.unit ?? ''}</>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                    {price != null ? (
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-travel-700">{formatRupiah(price)}</div>
                        <div className="text-xs text-slate-500">{unit}</div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500">{product.note ?? 'Tanya harga'}</div>
                    )}
                    <Link
                      to={`/checkout/${product.key}?id=${item.id}`}
                      state={{ item, price }}
                      className="rounded-xl bg-gradient-to-r from-travel-600 to-travel-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-travel-600/30 transition hover:brightness-110 active:scale-95"
                    >
                      Pilih
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
      </div>
    </div>
  )
}

function Section({ children, className }) {
  return <div className={`mx-auto ${className}`}>{children}</div>
}

function InfoBox({ type, children }) {
  const color =
    type === 'error'
      ? 'bg-red-500/15 text-red-100 ring-red-300/30'
      : 'bg-white/10 text-white/80 ring-white/20'
  return (
    <div className={`flex items-center gap-3 rounded-2xl p-5 ring-1 ${color}`}>
      <CircleAlert size={20} className="shrink-0" />
      <span className="text-sm">{children}</span>
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="grid gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="glass h-28 animate-pulse rounded-2xl" />
      ))}
    </div>
  )
}