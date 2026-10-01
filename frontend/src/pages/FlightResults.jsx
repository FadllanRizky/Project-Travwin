import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plane, CalendarDays, Users, Layers, Ticket, MapPin } from 'lucide-react'
import { translateBadge } from '../data/products.js'
import { api, formatRupiah, formatDateTime } from '../lib/api.js'
import PlaneScene from '../components/three/PlaneScene.jsx'
import BookingStepper from '../components/BookingStepper.jsx'
import SmartImage from '../components/SmartImage.jsx'
import { flightHero, flightHeroImage, airportImage } from '../data/imgs.js'

const AIRPORT_NAMES = {
  CGK: 'Jakarta · Soekarno-Hatta',
  KNO: 'Medan · Kualanamu',
  BDO: 'Bandung · Husein Sastranegara',
  DPS: 'Denpasar · Ngurah Rai',
  SUB: 'Surabaya · Juanda',
  YIA: 'Yogyakarta · Kulon Progo',
  UPG: 'Makassar · Hasanuddin',
  PLM: 'Palembang · SMB II',
}

const formatTime = (value) =>
  value ? new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'

export default function FlightResults() {
  const [params] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const origin = (params.get('origin') || '').toUpperCase()
  const destination = (params.get('destination') || '').toUpperCase()
  const date = params.get('date') || ''

  const queryString = '/api/v1/flights/search?' + new URLSearchParams(params).toString()

  useEffect(() => {
    setLoading(true)
    setError('')
    api(queryString)
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Respon tidak valid dari server.')
        const sorted = [...data].sort((a, b) => {
          if (a.basePrice === b.basePrice) return 0
          return Number(a.basePrice) - Number(b.basePrice)
        })
        setItems(sorted)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [queryString])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PlaneScene />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-900/25 to-slate-950/80" />

      <section className="relative z-10 mx-auto max-w-5xl px-4 py-8">
        <Link
          to="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition hover:text-white"
        >
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>

        <div className="mb-4 flex justify-center">
          <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900/60 px-5 py-4 backdrop-blur-xl">
            <BookingStepper current={1} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/15 shadow-2xl shadow-black/40">
            <SmartImage
              src={flightHeroImage(origin, destination)}
              fallback={flightHero}
              eager
              alt="Langit biru terbentang dari sayap pesawat"
              imgClassName="h-56 w-full object-cover sm:h-64"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/50 to-slate-950/15" />
            <div className="relative z-10 flex flex-col items-center px-6 py-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-200 ring-1 ring-white/20 backdrop-blur">
            <Plane size={12} /> TravWin Flight
          </span>
          <h1 className="mt-3 text-3xl font-black text-white text-shadow sm:text-4xl">
            {origin} <span className="text-travel-300">→</span> {destination}
          </h1>
          <p className="mt-2 text-sm text-white/80">
            {AIRPORT_NAMES[origin] ?? origin} ke {AIRPORT_NAMES[destination] ?? destination}
            {date && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-white ring-1 ring-white/15">
                <CalendarDays size={12} /> {date}
              </span>
            )}
          </p>
          {!loading && !error && (
            <p className="mt-1 text-xs text-white/60">{items.length} penerbangan tersedia, diurutkan harga termurah</p>
          )}
            </div>
          </div>
        </motion.div>

        <div className="mt-8 pb-12">
          {loading && (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-36 animate-pulse rounded-3xl border border-white/10 bg-slate-800/50 backdrop-blur" />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-400/30 bg-red-950/40 px-5 py-4 text-center text-sm font-semibold text-red-200 backdrop-blur">
              Gagal memuat data: {error}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="rounded-2xl border border-white/15 bg-slate-900/60 px-5 py-10 text-center backdrop-blur-xl">
              <Plane size={40} className="mx-auto text-white/40" />
              <p className="mt-3 font-bold text-white">Tidak ada jadwal untuk rute ini.</p>
              <p className="text-sm text-white/60">Coba ganti bandara atau tanggal keberangkatan.</p>
              <Link to="/" className="mt-4 inline-block rounded-xl bg-travel-600 px-5 py-2.5 text-sm font-bold text-white hover:brightness-110">
                Cari Ulang
              </Link>
            </div>
          )}

          <div className="space-y-4">
            {items.map((it, i) => {
              const badge = translateBadge('flights', it.status)
              return (
                <motion.article
                  key={it.id ?? i}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-3xl border border-white/15 bg-slate-900/55 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl transition hover:border-travel-300/60 hover:shadow-travel-900/40"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-travel-600/90 text-white ring-1 ring-white/20">
                          <Plane size={17} />
                        </span>
                        <div>
                          <h3 className="text-base font-extrabold text-white">{it.airlineName}</h3>
                          <p className="text-xs font-semibold text-travel-200">
                            {it.flightNumber} · {it.airplaneModel}
                          </p>
                        </div>
                        {badge && (
                          <span
                            className={`ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              badge.ok ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {badge.text}
                          </span>
                        )}
                        <span className="hidden shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15 sm:block">
                          <SmartImage
                            src={airportImage(it.destinationAirportCode)}
                            alt={`Bandara ${it.destinationAirportCode}`}
                            imgClassName="h-20 w-32 object-cover transition duration-500 hover:scale-110"
                            placeholder={
                              <span className="grid h-20 w-32 place-items-center bg-gradient-to-br from-sky-800 to-travel-700 text-white/70">
                                <Plane size={24} />
                              </span>
                            }
                          />
                        </span>
                      </div>

                      <RouteGraphic item={it} />

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-white/70">
                        <span className="inline-flex items-center gap-1">
                          <Layers size={13} className="text-travel-300" /> {it.seatClass}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users size={13} className="text-travel-300" /> {it.availableSeats} kursi tersisa
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} className="text-travel-300" /> Penerbangan non-stop
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-row items-center justify-between gap-5 md:flex-col md:items-end">
                      <div className="text-right">
                        <div className="text-2xl font-black text-amber-300">{formatRupiah(it.basePrice)}</div>
                        <div className="text-[11px] text-white/50">per penumpang · sudah termasuk pajak</div>
                      </div>
                      <Link
                        to={`/checkout/flights?id=${it.id}`}
                        state={{ item: it, price: Number(it.basePrice) }}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-travel-600 to-travel-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-travel-900/40 transition hover:brightness-110 active:scale-95"
                      >
                        <Ticket size={16} /> Pilih
                      </Link>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

function RouteGraphic({ item }) {
  const dep = item.departureTime
  const arr = item.arrivalTime
  const durationMs = Date.parse(arr) - Date.parse(dep)
  let duration = '-'
  if (!Number.isNaN(durationMs) && durationMs > 0) {
    const mins = Math.round(durationMs / 60000)
    duration = `${Math.floor(mins / 60)}j ${mins % 60}m`
  }

  return (
    <div className="mt-4 rounded-2xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-2">
        <div className="text-center">
          <div className="text-lg font-extrabold text-white">{formatTime(dep)}</div>
          <div className="text-[11px] font-medium text-white/70">
            {item.originCity} · {item.originAirportCode}
          </div>
        </div>

        <div className="relative mx-3 flex-1">
          <svg className="h-6 w-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="route" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <line x1="0" y1="14" x2="100%" y2="14" stroke="url(#route)" strokeWidth="1.6" strokeDasharray="5 3" />
          </svg>
          <span className="absolute left-1/2 top-1/2 -ml-2.5 -mt-2.5 grid h-5 w-5 place-items-center rounded-full bg-travel-500 text-white ring-2 ring-white/30">
            <Plane size={11} className="rotate-0" />
          </span>
        </div>

        <div className="text-right">
          <div className="text-lg font-extrabold text-white">{formatTime(arr)}</div>
          <div className="text-[11px] font-medium text-white/70">
            {item.destinationCity} · {item.destinationAirportCode}
          </div>
        </div>
      </div>
      <div className="mt-1.5 text-center text-[11px] font-semibold text-white/50">
        Durasi ± {duration} · terbang {formatDateTime(dep)}
      </div>
    </div>
  )
}