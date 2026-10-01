import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CalendarRange, CreditCard, Hotel, Plane, TrainFront, UserRound, Wallet } from 'lucide-react'
import { getProduct } from '../data/products.js'
import { api, formatRupiah, getField } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import BookingStepper from '../components/BookingStepper.jsx'

const EMPTY_PAX = {
  title: 'Tuan',
  fullName: '',
  idType: 'KTP',
  idNumber: '',
  dob: '',
  nationality: 'WNI',
}

const TITLES = ['Tuan', 'Nyonya', 'Nona']
const NATIONALITIES = ['WNI', 'WNA']

const formatDate = (v) => {
  if (!v) return '-'
  return new Date(v).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Checkout() {
  const { product: productKey } = useParams()
  const product = getProduct(productKey)
  const location = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { user } = useAuth()

  const item = location.state?.item
  const passedPrice = location.state?.price

  const hotel = location.state?.hotel
  const room = location.state?.room
  const checkIn = location.state?.checkIn ?? ''
  const checkOut = location.state?.checkOut ?? ''
  const nights = location.state?.nights ?? 0
  const guests = location.state?.guests ?? 1

  const isFlight = product.serviceType === 'FLIGHT'
  const isHotel = product.serviceType === 'HOTEL'
  const isTrain = product.serviceType === 'TRAIN'

  const price = useMemo(() => {
    if (isHotel) return Number(room?.basePricePerNight ?? 0) * Math.max(1, nights)
    if (passedPrice != null) return Number(passedPrice)
    if (item && product.cardPrice) {
      const v = getField(item, product.cardPrice)
      return v != null ? Number(v) : 0
    }
    return 0
  }, [item, product, passedPrice, isHotel, room, nights])

  const [quantity, setQuantity] = useState(1)
  const [form, setForm] = useState({
    userId: user?.userId ?? '',
    fullName: '',
    email: user?.email ?? '',
    phoneNumber: '',
  })
  const [pax, setPax] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const title = isHotel
    ? `${hotel?.name ?? 'Hotel'} – ${room?.name ?? 'Kamar'}`
    : isTrain && item
      ? `${getField(item, product.cardTitle) ?? 'Kereta'} — ${item.originStation} (${item.originStationCode}) → ${item.destinationStation} (${item.destinationStationCode})`
      : item
        ? (getField(item, product.cardTitle) ?? 'Item')
        : `Item #${params.get('id')}`
  const total = price * quantity

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const getPax = (i) => pax[i] ?? EMPTY_PAX
  const setPaxField = (i, key, value) =>
    setPax((prev) => ({ ...prev, [i]: { ...(prev[i] ?? EMPTY_PAX), [key]: value } }))

  const validateGuests = () => {
    if (!isHotel) return ''
    for (let i = 0; i < quantity; i++) {
      const p = getPax(i)
      const no = `Tamu kamar ${i + 1}: `
      if (!p.title) return `${no}titel wajib dipilih.`
      if (!p.fullName.trim()) return `${no}nama lengkap wajib diisi (sesuai identitas).`
      if (p.fullName.trim().length < 3) return `${no}nama minimal 3 karakter.`
      if (!p.idNumber.trim()) return `${no}nomor identitas wajib diisi.`
      if (p.idType === 'KTP' && !/^\d{16}$/.test(p.idNumber.trim()))
        return `${no}NIK KTP harus 16 digit angka.`
      if (p.idType === 'PASPOR' && !/^[A-Za-z0-9]{6,12}$/.test(p.idNumber.trim()))
        return `${no}nomor paspor 6-12 karakter alfanumerik.`
      if (!p.dob) return `${no}tanggal lahir wajib diisi.`
      if (p.dob && new Date(p.dob) > new Date()) return `${no}tanggal lahir tidak boleh di masa depan.`
      if (!p.nationality) return `${no}kewarganegaraan wajib dipilih.`
    }
    return ''
  }

  const validatePassengers = () => {
    if (!isFlight && !isTrain) return ''
    for (let i = 0; i < quantity; i++) {
      const p = getPax(i)
      const no = `Penumpang ${i + 1}: `
      if (!p.title) return `${no}titel wajib dipilih.`
      if (!p.fullName.trim()) return `${no}nama lengkap wajib diisi (sesuai identitas).`
      if (p.fullName.trim().length < 3) return `${no}nama minimal 3 karakter.`
      if (!p.idNumber.trim()) return `${no}nomor identitas wajib diisi.`
      if (p.idType === 'KTP' && !/^\d{16}$/.test(p.idNumber.trim()))
        return `${no}NIK KTP harus 16 digit angka.`
      if (p.idType === 'PASPOR' && !/^[A-Za-z0-9]{6,12}$/.test(p.idNumber.trim()))
        return `${no}nomor paspor 6-12 karakter alfanumerik.`
      if (!p.dob) return `${no}tanggal lahir wajib diisi.`
      if (p.dob && new Date(p.dob) > new Date()) return `${no}tanggal lahir tidak boleh di masa depan.`
      if (!p.nationality) return `${no}kewarganegaraan wajib dipilih.`
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.userId) {
      setError('Masukkan ID user (dari akun TravWin). Registrasi otomatis memuat ID user.')
      return
    }
    const validationError = validatePassengers() || validateGuests()
    if (validationError) {
      setError(validationError)
      return
    }
    setSubmitting(true)
    setError('')
    try {
      let details = null
      if (isFlight) {
        details = JSON.stringify({
          customer: {
            userId: Number(form.userId),
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phoneNumber: form.phoneNumber.trim(),
          },
          passengers: Array.from({ length: quantity }, (_, i) => getPax(i)),
          baggage: { cabin: '7 kg', checked: '20 kg' },
          flight: {
            flightNumber: item?.flightNumber ?? null,
            airlineName: item?.airlineName ?? null,
            airplaneModel: item?.airplaneModel ?? null,
            origin: item ? `${item.originCity} (${item.originAirportCode})` : null,
            destination: item ? `${item.destinationCity} (${item.destinationAirportCode})` : null,
            departureTime: item?.departureTime ?? null,
            arrivalTime: item?.arrivalTime ?? null,
          },
        })
      } else if (isTrain) {
        details = JSON.stringify({
          customer: {
            userId: Number(form.userId),
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phoneNumber: form.phoneNumber.trim(),
          },
          train: {
            trainNumber: item?.trainNumber ?? null,
            trainName: item?.trainName ?? null,
            trainClass: item?.trainClass ?? null,
            trainCategory: item?.trainCategory ?? null,
            origin: item ? `${item.originStation} (${item.originStationCode})` : null,
            destination: item ? `${item.destinationStation} (${item.destinationStationCode})` : null,
            departureTime: item?.departureTime ?? null,
            arrivalTime: item?.arrivalTime ?? null,
            durationMinutes: item?.durationMinutes ?? null,
          },
          passengers: Array.from({ length: quantity }, (_, i) => getPax(i)),
        })
      } else if (isHotel) {
        details = JSON.stringify({
          customer: {
            userId: Number(form.userId),
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phoneNumber: form.phoneNumber.trim(),
          },
          stay: {
            checkIn,
            checkOut,
            nights: Math.max(1, nights),
            guests,
            hotel: hotel
              ? {
                  id: hotel.id,
                  slug: hotel.slug,
                  name: hotel.name,
                  area: hotel.area,
                  city: hotel.city,
                  province: hotel.province,
                  palette: hotel.palette,
                }
              : null,
            room: room
              ? {
                  id: room.id,
                  name: room.name,
                  category: room.category,
                  bedType: room.bedType,
                  maxGuests: room.maxGuests,
                  basePricePerNight: room.basePricePerNight,
                }
              : null,
            roomCount: quantity,
          },
          guests: Array.from({ length: quantity }, (_, i) => getPax(i)),
        })
      }

      const booking = await api('/api/v1/bookings', {
        method: 'POST',
        body: JSON.stringify({
          userId: Number(form.userId),
          serviceType: product.serviceType,
          itemId: room?.id ?? item?.id ?? Number(params.get('id')),
          itemName: title,
          quantity,
          totalPrice: total,
          status: 'PENDING',
          ...(details ? { details } : {}),
        }),
      })
      sessionStorage.setItem(`pending_booking_${booking.id}`, JSON.stringify(booking))
      if (details) sessionStorage.setItem(`booking_admin_${booking.id}`, details)
      navigate(`/payment/${booking.id}`, { state: { booking } })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        to={`/search/${product.key}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
      >
        <ArrowLeft size={18} /> Kembali
      </Link>

      <h1 className="mb-6 text-2xl font-extrabold text-white text-shadow">Checkout — {product.label}</h1>

      {(isFlight || isHotel || isTrain) && (
        <div className="mb-6 rounded-2xl border border-white/15 bg-slate-900/60 px-5 py-4 backdrop-blur-xl">
          <BookingStepper current={2} variant={isHotel ? 'hotel' : isTrain ? 'train' : 'flight'} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <motion.form
          key={product.key}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <div className="mb-5 flex items-center gap-2">
            <UserRound size={20} className="text-travel-600" />
            <h2 className="font-bold text-slate-900">Data Pemesan</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-travel-800">
                ID User *
              </span>
              <input
                type="number"
                value={form.userId}
                onChange={set('userId')}
                disabled={!!user}
                className="w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-travel-500 disabled:opacity-60"
              />
              {!user && (
                <span className="mt-1 block text-xs text-slate-500">
                  Belum login? Gunakan ID dari akunmu.
                </span>
              )}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-travel-800">
                Nama Lengkap *
              </span>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={set('fullName')}
                placeholder="Nama sesuai identitas"
                className="w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-travel-500"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-travel-800">
                Email *
              </span>
              <input
                type="email"
                required
                value={form.email}
                onChange={set('email')}
                placeholder="nama@email.com"
                className="w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-travel-500"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-travel-800">
                No. Telepon
              </span>
              <input
                type="tel"
                maxLength={13}
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 13),
                  }))
                }
                placeholder="08xxxx"
                className="w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-travel-500"
              />
            </label>
          </div>

          {(isFlight || isHotel || isTrain) && (
            <>
              <div className="mt-7 flex items-center justify-between gap-2 border-t border-slate-200 pt-5">
                <div className="flex items-center gap-2">
                  {isHotel ? (
                    <Hotel size={20} className="text-travel-600" />
                  ) : isTrain ? (
                    <TrainFront size={20} className="text-travel-600" />
                  ) : (
                    <UserRound size={20} className="text-travel-600" />
                  )}
                  <h2 className="font-bold text-slate-900">
                    {isHotel ? `Data Tamu (Maks ${guests} tamu per kamar)` : 'Administrasi Penumpang'}
                  </h2>
                </div>
                <span className="rounded-full bg-travel-100 px-3 py-1 text-xs font-bold text-travel-800">
                  {isHotel ? `${quantity} kamar` : `${quantity} penumpang`}
                </span>
              </div>

              {isHotel && (
                <div className="mt-4 rounded-xl bg-slate-100/70 p-4 text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Regulasi penginapan:</span> setiap kamar diwakili
                  satu tamu utama (nama & identitas sesuai KTP/Paspor). Total kamar dapat diatur pada ringkasan
                  di samping.
                </div>
              )}

              {isFlight && (
                <div className="mt-4 rounded-xl bg-slate-100/70 p-4 text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Bagasi:</span> Kabin 7 kg + Bagasi terdaftar
                  20 kg (gratis untuk penerbangan domestik).
                </div>
              )}

              {isTrain && (
                <div className="mt-4 rounded-xl bg-slate-100/70 p-4 text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Tiket kereta:</span> 1 tiket per penumpang,
                  nama & identitas wajib sesuai KTP/Paspor. Kursi diatur otomatis oleh sistem reservasi.
                </div>
              )}

              <div className="mt-4 space-y-5">
                {Array.from({ length: quantity }, (_, i) => {
                  const p = getPax(i)
                  return (
                    <div key={i} className="rounded-xl border border-slate-200 bg-white/70 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        {isHotel ? (
                          <Hotel size={16} className="text-travel-600" />
                        ) : isTrain ? (
                          <TrainFront size={16} className="text-travel-600" />
                        ) : (
                          <Plane size={16} className="text-travel-600" />
                        )}
                        <span className="text-sm font-bold text-slate-800">
                          {isHotel ? `Kamar ${i + 1} — Tamu Utama` : `Penumpang ${i + 1}`}
                        </span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-travel-800">
                            Titel *
                          </span>
                          <select
                            value={p.title}
                            onChange={(e) => setPaxField(i, 'title', e.target.value)}
                            className="w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-travel-500"
                          >
                            {TITLES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-travel-800">
                            Nama Lengkap (sesuai identitas) *
                          </span>
                          <input
                            type="text"
                            value={p.fullName}
                            onChange={(e) => setPaxField(i, 'fullName', e.target.value)}
                            placeholder="cth: BUDI SANTOSO"
                            className="w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-travel-500"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-travel-800">
                            Jenis Identitas *
                          </span>
                          <select
                            value={p.idType}
                            onChange={(e) => setPaxField(i, 'idType', e.target.value)}
                            className="w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-travel-500"
                          >
                            <option value="KTP">KTP (16 digit)</option>
                            <option value="PASPOR">Paspor (6-12 karakter)</option>
                          </select>
                        </label>
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-travel-800">
                            Nomor Identitas *
                          </span>
                          <input
                            type="text"
                            value={p.idNumber}
                            onChange={(e) =>
                              setPaxField(
                                i,
                                'idNumber',
                                p.idType === 'KTP'
                                  ? e.target.value.replace(/\D/g, '').slice(0, 16)
                                  : e.target.value.toUpperCase().slice(0, 12),
                              )
                            }
                            placeholder={p.idType === 'KTP' ? '16 digit NIK' : 'cth: C1234567'}
                            className="w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-travel-500"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-travel-800">
                            Tanggal Lahir *
                          </span>
                          <input
                            type="date"
                            value={p.dob}
                            onChange={(e) => setPaxField(i, 'dob', e.target.value)}
                            className="w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-travel-500"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-travel-800">
                            Kewarganegaraan *
                          </span>
                          <select
                            value={p.nationality}
                            onChange={(e) => setPaxField(i, 'nationality', e.target.value)}
                            className="w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-travel-500"
                          >
                            {NATIONALITIES.map((n) => (
                              <option key={n} value={n}>
                                {n === 'WNI' ? 'WNI (Indonesia)' : 'WNA (Asing)'}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {error && (
            <div className="mt-4 rounded-xl bg-red-500/15 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-300/40">
              {error}
            </div>
          )}
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass h-fit rounded-2xl p-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <CreditCard size={20} className="text-travel-600" />
            <h2 className="font-bold text-slate-900">Ringkasan Pesanan</h2>
          </div>

          <div className="mb-4 rounded-xl bg-slate-100/70 p-4">
            <p className="text-sm font-bold text-slate-900">{title}</p>
            <p className="text-xs text-slate-500">{product.label}</p>

            {isHotel && room && (
              <div className="mt-2 space-y-1 border-t border-slate-200 pt-2 text-xs text-slate-600">
                <p>
                  {room.name} · {room.category} · maks {room.maxGuests} tamu
                </p>
                <p>
                  {hotel?.area ?? ''} {hotel?.city ? `· ${hotel.city}` : ''}
                </p>
                <p className="flex items-center gap-1 text-[11px] text-slate-500">
                  <CalendarRange size={11} /> {formatDate(checkIn)} — {formatDate(checkOut)} · {nights} malam · {guests} tamu
                </p>
              </div>
            )}

            {isFlight && item && (
              <div className="mt-2 space-y-1 border-t border-slate-200 pt-2 text-xs text-slate-600">
                <p>
                  {item.originCity} ({item.originAirportCode}) → {item.destinationCity} (
                  {item.destinationAirportCode})
                </p>
                <p>
                  {item.airlineName} · {item.flightNumber} · {item.airplaneModel}
                </p>
                <p className="text-[11px] text-slate-500">
                  Kelas {item.seatClass} · Sisa {item.availableSeats} kursi
                </p>
              </div>
            )}

            {isTrain && item && (
              <div className="mt-2 space-y-1 border-t border-slate-200 pt-2 text-xs text-slate-600">
                <p>
                  {item.originStation} ({item.originStationCode}) → {item.destinationStation} (
                  {item.destinationStationCode})
                </p>
                <p>
                  {item.trainName} · {item.trainNumber} · {item.trainCategory} · {item.trainClass}
                </p>
                <p className="text-[11px] text-slate-500">
                  {formatDate(item.departureTime)} — {item.durationMinutes} menit perjalanan
                </p>
              </div>
            )}
          </div>

          {isHotel && price > 0 && (
            <div className="mb-3 rounded-xl bg-slate-100/70 p-4 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{room?.name} × {nights} malam</span>
                <span className="font-semibold text-slate-800">{formatRupiah(price)}</span>
              </div>
              {quantity > 1 && (
                <div className="mt-1 flex justify-between">
                  <span>× {quantity} kamar</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(price * quantity)}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>{isHotel ? 'Jumlah Kamar' : 'Jumlah'}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="grid h-8 w-8 place-items-center rounded-lg bg-slate-200 font-bold text-slate-700 transition hover:bg-slate-300"
              >
                −
              </button>
              <span className="w-6 text-center font-bold text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(isHotel ? 3 : 10, q + 1))}
                className="grid h-8 w-8 place-items-center rounded-lg bg-slate-200 font-bold text-slate-700 transition hover:bg-slate-300"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <span className="font-semibold text-slate-700">Total Tagihan</span>
            <span className="text-xl font-extrabold text-travel-700">{formatRupiah(total)}</span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-travel-600 to-travel-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-travel-600/40 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          >
            <Wallet size={18} />
            {submitting ? 'Memproses...' : 'Lanjut ke Pembayaran'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}