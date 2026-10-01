import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CalendarRange, Copy, LogIn } from 'lucide-react'
import { api, formatRupiah, formatDateTime } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function MyBookings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const userId = user?.userId

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    api(`/api/v1/bookings/user/${userId}`)
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [userId])

  if (!userId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <CalendarRange size={40} className="mx-auto mb-4 text-white/60" />
        <h1 className="mb-2 text-2xl font-extrabold text-white text-shadow">Pesanan Saya</h1>
        <p className="mb-6 text-white/70">Login dulu untuk melihat pesanan kamu.</p>
        <button
          onClick={() => navigate('/auth?mode=login')}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-travel-800 shadow-lg transition hover:bg-travel-50"
        >
          <LogIn size={18} /> Masuk / Daftar
        </button>
      </div>
    )
  }

  const badgeColor = (status) => {
    const s = String(status || '').toUpperCase()
    if (s === 'PAID') return 'bg-emerald-100 text-emerald-700'
    if (s === 'CANCELLED') return 'bg-red-100 text-red-700'
    return 'bg-amber-100 text-amber-700'
  }

  const StayChip = ({ details }) => {
    let stay = null
    try {
      stay = details ? JSON.parse(details)?.stay : null
    } catch {
      /* ignore */
    }
    if (!stay?.checkIn || !stay?.checkOut) return null
    const fmt = (v) => new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    return (
      <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-travel-100 px-2 py-0.5 font-bold text-travel-800">
        {fmt(stay.checkIn)} — {fmt(stay.checkOut)} · {stay.nights ?? '-'} malam
      </span>
    )
  }

  const TrainChip = ({ details }) => {
    let train = null
    try {
      train = details ? JSON.parse(details)?.train : null
    } catch {
      /* ignore */
    }
    if (!train?.origin || !train?.destination) return null
    const t = (v) => new Date(v).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    return (
      <span className="mt-1 flex items-center gap-2 font-mono text-xs font-bold text-travel-800">
        <span className="rounded-full bg-travel-100 px-2.5 py-0.5">
          {train.origin} → {train.destination}
        </span>
        {train.departureTime && (
          <span className="font-sans font-semibold text-slate-600">{t(train.departureTime)}</span>
        )}
        {train.trainName && (
          <span className="font-sans font-semibold text-slate-600">
            {train.trainName} · {train.trainClass}
          </span>
        )}
      </span>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
      >
        <ArrowLeft size={18} /> Beranda
      </Link>

      <h1 className="mb-2 text-2xl font-extrabold text-white text-shadow">Pesanan Saya</h1>
      <p className="mb-6 text-sm text-white/70">
        Menampilkan riwayat untuk akun <span className="font-bold text-white">{user.username}</span> (ID {user.userId}).
      </p>

      {loading && <div className="glass h-36 animate-pulse rounded-2xl" />}
      {error && (
        <div className="rounded-2xl bg-red-500/15 p-5 text-sm font-medium text-red-100 ring-1 ring-red-300/30">
          Gagal memuat pesanan: {error}
        </div>
      )}
      {!loading && !error && bookings.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center text-white/80">
          Belum ada pesanan. Mulai booking tiket pertamamu!
        </div>
      )}

      <div className="grid gap-4">
        {bookings.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-slate-900">{b.itemName}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeColor(b.status)}`}>
                    {b.status}
                  </span>
                </div>
                <p className="mt-1 inline-flex items-center gap-2 rounded-lg bg-slate-100/70 px-2.5 py-1 font-mono text-xs font-bold text-travel-800">
                  {b.bookingCode}
                  <button
                    onClick={() => navigator.clipboard?.writeText(b.bookingCode)}
                    title="Salin kode"
                    className="text-slate-400 transition hover:text-travel-600"
                  >
                    <Copy size={13} />
                  </button>
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                  <CalendarRange size={13} /> {formatDateTime(b.bookingDate)} · {b.serviceType} · {b.quantity} pcs
                  {b.serviceType === 'HOTEL' && (
                    <StayChip details={b.details} />
                  )}
                </p>
                {b.serviceType === 'TRAIN' && (
                  <TrainChip details={b.details} />
                )}
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-travel-700">{formatRupiah(b.totalPrice)}</div>
                {b.status !== 'PAID' && (
                  <Link
                    to={`/payment/${b.id}`}
                    state={{ booking: b }}
                    className="mt-2 inline-block rounded-lg bg-travel-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-travel-500"
                  >
                    Bayar Sekarang
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}