import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  BedDouble,
  Building2,
  CalendarDays,
  ChevronDown,
  Users,
  Star,
  MapPin,
  Check,
  BadgeInfo,
} from 'lucide-react'
import { api, formatRupiah } from '../lib/api.js'
import BookingStepper from '../components/BookingStepper.jsx'
import SceneryBackdrop from '../components/SceneryBackdrop.jsx'
import SmartImage from '../components/SmartImage.jsx'
import { hotelImage, hotelImageFallback } from '../data/imgs.js'

const PROPERTY_LABEL = {
  RESORT: 'Resort',
  HOTEL: 'Hotel',
  VILLA: 'Villa',
  INN: 'Penginapan',
  LODGE: 'Lodge',
  HOMESTAY: 'Homestay',
  BOUTIQUE_HOTEL: 'Boutique Hotel',
}

const PALETTE_BY_DEST = {
  Ubud: 'emerald',
  Kuta: 'sunset',
  'Labuan Bajo': 'ocean',
  'Danau Toba': 'lake',
  Bromo: 'dawn',
  'Kuta Lombok': 'teal',
  Bintan: 'coral',
  'Raja Ampat': 'lagoon',
  Yogyakarta: 'brick',
  Lembang: 'pines',
  Belitung: 'sand',
  Bunaken: 'coral',
  Derawan: 'green',
  Wakatobi: 'aqua',
}

const SCENE_LABEL = {
  beach: 'Pantai',
  mountain: 'Gunung',
  city: 'Kota',
  island: 'Pulau',
}

const formatDate = (v) => {
  if (!v) return '-'
  const d = new Date(v)
  return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export default function HotelResults() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openSlug, setOpenSlug] = useState(null)

  const destination = (params.get('destination') || '').trim()
  const checkIn = params.get('checkIn') || ''
  const checkOut = params.get('checkOut') || ''
  const guests = Math.max(1, Math.min(8, Number(params.get('guests')) || 1))

  const nights =
    checkIn && checkOut
      ? Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86400000)
      : 0

  const palette = PALETTE_BY_DEST[destination] ?? 'emerald'

  const queryString =
    '/api/v1/hotels/search?' +
    new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      guests: String(guests),
    }).toString()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    api(queryString)
      .then((data) => {
        if (cancelled) return
        if (!Array.isArray(data)) throw new Error('Respon tidak valid dari server.')
        const sorted = [...data].sort((a, b) => Number(a.minPricePerNight) - Number(b.minPricePerNight))
        setItems(sorted)
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [queryString])

  const roomTotal = (room) => Number(room.basePricePerNight) * Math.max(1, nights)

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SceneryBackdrop palette={palette} />
      <div className="pointer-events-none absolute inset-0" />

      <section className="relative z-10 mx-auto max-w-5xl px-4 py-8">
        <Link
          to="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-white/90 drop-shadow transition hover:text-white"
        >
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>

        <div className="mb-4 flex justify-center">
          <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-slate-950/55 px-5 py-4 shadow-xl shadow-black/20 backdrop-blur-xl">
            <BookingStepper current={1} variant="hotel" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white ring-1 ring-white/25 backdrop-blur">
            <MapPin size={12} /> TravWin Stay
          </span>
          <h1 className="mt-3 text-3xl font-black text-white text-shadow sm:text-4xl">
            {destination || 'Cari Hotel'}
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {checkIn && checkOut && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/20 backdrop-blur">
                <CalendarDays size={13} /> {formatDate(checkIn)} — {formatDate(checkOut)}
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{nights} malam</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/20 backdrop-blur">
              <Users size={13} /> {guests} tamu
            </span>
          </div>
          {!loading && !error && (
            <p className="mt-2 text-xs text-white/80">
              {items.length} properti ditemukan, diurutkan dari harga termurah
            </p>
          )}
        </motion.div>

        <div className="mt-8 pb-12">
          {loading && (
            <div className="space-y-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-44 animate-pulse rounded-3xl border border-white/15 bg-slate-900/50 backdrop-blur" />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-400/40 bg-red-950/50 px-5 py-4 text-center text-sm font-semibold text-red-100 backdrop-blur">
              Gagal memuat data: {error}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="rounded-2xl border border-white/20 bg-slate-950/60 px-5 py-10 text-center backdrop-blur-xl">
              <Building2 size={40} className="mx-auto text-white/50" />
              <p className="mt-3 font-bold text-white">Belum ada properti untuk destinasi ini.</p>
              <p className="text-sm text-white/70">Coba destinasi wisata lain atau sesuaikan tanggal menginap.</p>
              <Link to="/" className="mt-4 inline-block rounded-xl bg-travel-600 px-5 py-2.5 text-sm font-bold text-white hover:brightness-110">
                Cari Ulang
              </Link>
            </div>
          )}

          <div className="space-y-5">
            {items.map((it, i) => {
              const expanded = openSlug === it.slug
              return (
                <motion.article
                  key={it.id ?? i}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="group overflow-hidden rounded-3xl border border-white/15 bg-slate-950/60 shadow-2xl shadow-black/30 backdrop-blur-2xl"
                >
                  <div className="flex flex-col md:flex-row">
                    <button
                      type="button"
                      className="relative h-44 shrink-0 md:h-auto md:w-60"
                      onClick={() => setOpenSlug(expanded ? null : it.slug)}
                    >
                      <SmartImage
                        src={hotelImage(it)}
                        fallback={hotelImageFallback(it)}
                        alt={it.name}
                        imgClassName="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        placeholder={
                          <span className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                        }
                      />
                      <span className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/45" />
                      <span className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-bold text-white ring-1 ring-white/20 backdrop-blur">
                        <Star size={11} className="text-amber-300" /> {Number(it.rating || 0).toFixed(1)}
                      </span>
                      <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white ring-1 ring-white/20 backdrop-blur">
                        {PROPERTY_LABEL[it.propertyType] ?? it.propertyType}
                      </span>
                      {SCENE_LABEL[it.sceneType] && (
                        <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/90 ring-1 ring-white/15 backdrop-blur">
                          {SCENE_LABEL[it.sceneType]}
                        </span>
                      )}
                    </button>

                    <div className="flex min-w-0 flex-1 flex-col p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-lg font-extrabold text-white">{it.name}</h3>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-white/65">
                            <MapPin size={12} /> {it.area} · {it.city}, {it.province}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] uppercase tracking-wide text-white/55">mulai</div>
                          <div className="text-2xl font-black text-amber-300">{formatRupiah(it.minPricePerNight)}</div>
                          <div className="text-[11px] text-white/50">per malam</div>
                        </div>
                      </div>

                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/60">{it.description}</p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(it.facilities || '').split(',').slice(0, 5).map((f, idx) => (
                          <span key={idx} className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white/80 ring-1 ring-white/10">
                            {f.trim()}
                          </span>
                        ))}
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-400/20">
                          {it.totalAvailableRooms} kamar tersedia
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                        <span className="text-xs font-semibold text-white/70">
                          {it.rooms.length} tipe kamar{' '}
                          {nights > 1 && <span className="text-white/45">· total menginap {nights} malam</span>}
                        </span>
                        <button
                          type="button"
                          onClick={() => setOpenSlug(expanded ? null : it.slug)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white ring-1 ring-white/15 transition hover:bg-white/20"
                        >
                          {expanded ? 'Tutup Kamar' : 'Lihat Kamar'}
                          <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/10 bg-black/25"
                      >
                        <div className="divide-y divide-white/10">
                          {it.rooms.map((room) => {
                            const fitGuests = room.maxGuests >= guests
                            return (
                              <div key={room.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <BedDouble size={15} className="text-travel-300" />
                                    <span className="text-sm font-extrabold text-white">{room.name}</span>
                                    <span className="rounded-full bg-travel-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-travel-200 ring-1 ring-travel-400/30">
                                      {room.category}
                                    </span>
                                  </div>
                                  <p className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-white/60">
                                    <span>{room.bedType}</span>
                                    <span className="inline-flex items-center gap-1">
                                      <Users size={11} /> muat hingga {room.maxGuests} tamu
                                    </span>
                                    <span>{room.sizeSqm} m²</span>
                                    <span>{room.availableRooms} kamar tersisa</span>
                                  </p>
                                  <p className="mt-0.5 text-[10px] text-white/40">{(room.amenities || '').split(',').slice(0, 6).join(' · ')}</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-base font-black text-amber-300">{formatRupiah(room.basePricePerNight)}</div>
                                    <div className="text-[11px] text-white/50">/ malam</div>
                                    <div className="text-[11px] font-semibold text-white/70">
                                      {nights} malam = <span className="text-white">{formatRupiah(roomTotal(room))}</span>
                                    </div>
                                  </div>
                                  {fitGuests ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        navigate(`/checkout/hotels?id=${room.id}`, {
                                          state: {
                                            hotel: {
                                              id: it.id,
                                              slug: it.slug,
                                              name: it.name,
                                              area: it.area,
                                              city: it.city,
                                              province: it.province,
                                              palette: it.palette,
                                            },
                                            room,
                                            checkIn,
                                            checkOut,
                                            nights,
                                            guests,
                                          },
                                        })
                                      }
                                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-travel-600 to-travel-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-travel-900/40 transition hover:brightness-110 active:scale-95"
                                    >
                                      <Check size={15} /> Pilih
                                    </button>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-3 py-2 text-[11px] font-semibold text-white/45 ring-1 ring-white/10">
                                      <BadgeInfo size={12} /> maks {room.maxGuests} tamu
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}