import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  Landmark,
  LoaderCircle,
  CircleCheck,
  PartyPopper,
  Lock,
  Smartphone,
  ShieldCheck,
  Banknote,
  ChevronDown,
} from 'lucide-react'
import { api, formatRupiah } from '../lib/api.js'
import BookingStepper from '../components/BookingStepper.jsx'

const BANKS = [
  { code: 'BCA', name: 'Bank Central Asia', short: 'BCA', color: '#0060AF' },
  { code: 'MANDIRI', name: 'Bank Mandiri', short: 'Mandiri', color: '#F89D26' },
  { code: 'BNI', name: 'Bank Negara Indonesia', short: 'BNI', color: '#F26522' },
  { code: 'BRI', name: 'Bank Rakyat Indonesia', short: 'BRI', color: '#00529C' },
  { code: 'BTN', name: 'Bank Tabungan Negara', short: 'BTN', color: '#1F6F43' },
  { code: 'PERMATA', name: 'Bank Permata', short: 'Permata', color: '#004881' },
  { code: 'CIMB', name: 'CIMB Niaga', short: 'CIMB', color: '#962426' },
  { code: 'DANAMON', name: 'Bank Danamon', short: 'Danamon', color: '#009DD1' },
  { code: 'MAYBANK', name: 'Maybank Indonesia', short: 'Maybank', color: '#F17922' },
]

const CATEGORIES = [
  { key: 'QRIS', label: 'QRIS', desc: 'Scan QR lalu bayar dari e-wallet / m-banking apa pun.', icon: QrCode },
  { key: 'BANK', label: 'Transfer Bank', desc: '9 bank partner, kamu akan diarahkan ke halaman bank tujuan.', icon: Landmark },
  { key: 'CARD', label: 'Kartu Kredit', desc: 'Visa, Mastercard & JCB. Bayar langsung dari kartu.', icon: CreditCard },
]

const EMPTY_CARD = { holder: '', number: '', expiry: '', cvv: '' }

const safeParse = (raw) => {
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function hashCode(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function FakeQR({ seed = '00' }) {
  const h = hashCode(String(seed) || '00')
  const cells = []
  const n = 21
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inFinder =
        (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7)
      if (inFinder) continue
      const on = ((h >> ((x * 7 + y * 13 + x * y) % 30)) & 1) === 1
      if (on) cells.push(`${x},${y}`)
    }
  }
  return (
    <svg viewBox="0 0 24 24" className="h-40 w-40 rounded-xl bg-white p-2" role="img" aria-label="Kode QRIS">
      <rect width="24" height="24" rx="2" fill="#fff" />
      {[
        { ox: 0, oy: 0 },
        { ox: 17, oy: 0 },
        { ox: 0, oy: 17 },
      ].map((f, i) => {
        const { ox, oy } = f
        return (
          <g key={i}>
            <rect x={ox} y={oy} width="7" height="7" rx="1" fill="#000" />
            <rect x={ox + 1} y={oy + 1} width="5" height="5" fill="#fff" />
            <rect x={ox + 2} y={oy + 2} width="3" height="3" fill="#000" />
          </g>
        )
      })}
      {cells.map((c) => {
        const [x, y] = c.split(',').map(Number)
        return <rect key={c} x={x * (24 / 21)} y={y * (24 / 21)} width="1.1" height="1.1" fill="#000" />
      })}
    </svg>
  )
}

export default function Payment() {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  const [booking, setBooking] = useState(null)
  const [category, setCategory] = useState(null)
  const [bank, setBank] = useState(null)
  const [card, setCard] = useState(EMPTY_CARD)
  const [cardError, setCardError] = useState('')
  const [payment, setPayment] = useState(null)
  const [steps, setSteps] = useState('choose') // choose | created | success
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`pending_booking_${bookingId}`)
      if (raw) setBooking(JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }, [bookingId])

  const isFlight = booking?.serviceType === 'FLIGHT'
  const isHotel = booking?.serviceType === 'HOTEL'
  const isTrain = booking?.serviceType === 'TRAIN'
  const admin = safeParse(booking?.details)
  const stayNights = admin?.stay?.nights
  const checkIn = admin?.stay?.checkIn
  const checkOut = admin?.stay?.checkOut
  const selectedMethod =
    category === 'BANK' && bank ? bank.code : category === 'CARD' ? 'CREDIT_CARD' : category

  const createPayment = async () => {
    if (!booking || !selectedMethod) return
    setBusy(true)
    setError('')
    try {
      const created = await api('/api/v1/payments/pay', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: booking.id,
          bookingCode: booking.bookingCode,
          paymentMethod: selectedMethod,
          amount: booking.totalPrice,
        }),
      })
      setPayment(created)
      setSteps('created')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const confirmPayment = async () => {
    if (!payment) return
    setBusy(true)
    setError('')
    try {
      const confirmed = await api(`/api/v1/payments/${payment.id}/confirm`, { method: 'POST' })
      if (confirmed.status === 'SUCCESS' && booking?.id) {
        await api(`/api/v1/bookings/${booking.id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...booking, status: 'PAID' }),
        })
      }
      setPayment(confirmed)
      setSteps('success')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleCard = (e) => {
    e.preventDefault()
    const num = card.number.replace(/\s/g, '')
    if (card.holder.trim().length < 3) return setCardError('Nama pemegang kartu minimal 3 karakter.')
    if (!/^\d{16}$/.test(num)) return setCardError('Nomor kartu harus 16 digit.')
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry.trim())) return setCardError('Format masa berlaku salah (MM/YY).')
    if (!/^\d{3,4}$/.test(card.cvv.trim())) return setCardError('CVV harus 3-4 digit.')
    setCardError('')
    createPayment()
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="mb-4 text-lg font-semibold text-white">Booking tidak ditemukan. Silakan mulai checkout ulang.</p>
        <Link to="/" className="font-bold text-travel-200 underline">
          Kembali ke Beranda
        </Link>
      </div>
    )
  }

  const bankInfo = bank ? BANKS.find((b) => b.code === bank.code) : null
  const methodLabel =
    category === 'QRIS'
      ? 'QRIS'
      : category === 'BANK'
        ? `${bankInfo?.name ?? ''} (Virtual Account)`
        : category === 'CARD'
          ? 'Kartu Kredit'
          : '-'

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      <h1 className="mb-6 text-2xl font-extrabold text-white text-shadow">Pembayaran</h1>

      {(isFlight || isHotel || isTrain) && (
        <div className="mb-6 rounded-2xl border border-white/15 bg-slate-900/60 px-5 py-4 backdrop-blur-xl">
          <BookingStepper current={3} variant={isHotel ? 'hotel' : isTrain ? 'train' : 'flight'} />
        </div>
      )}

      <div className="glass rounded-2xl p-6">
        <div className="mb-6 rounded-xl bg-slate-100/70 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-600">Kode Booking</span>
            <span className="font-mono font-bold text-travel-800">{booking.bookingCode}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-600">Item</span>
            <span className="font-semibold text-slate-800">{booking.itemName}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-600">Jumlah</span>
            <span className="font-semibold text-slate-800">
              {isHotel ? `${booking.quantity} kamar${stayNights ? ` · ${stayNights} malam` : ''}` : `${booking.quantity} tiket`}
            </span>
          </div>
          {isHotel && checkIn && checkOut && (
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-600">Menginap</span>
              <span className="font-semibold text-slate-800">
                {new Date(checkIn).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} —{' '}
                {new Date(checkOut).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          )}
          {isTrain && admin?.train && (
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-600">Perjalanan</span>
              <span className="font-semibold text-slate-800">
                {admin.train.origin} → {admin.train.destination}
              </span>
            </div>
          )}
          {isTrain && admin?.train?.departureTime && (
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-600">Berangkat</span>
              <span className="font-semibold text-slate-800">
                {new Date(admin.train.departureTime).toLocaleString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}
          <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-base">
            <span className="font-bold text-slate-700">Total</span>
            <span className="text-xl font-extrabold text-travel-700">
              {formatRupiah(booking.totalPrice)}
            </span>
          </div>
        </div>

        {/* STEP: choose category / method */}
        {steps === 'choose' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!category && (
              <div>
                <h2 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                  <ShieldCheck size={18} className="text-travel-600" /> Pilih Metode Pembayaran
                </h2>
                <div className="grid gap-3">
                  {CATEGORIES.map((c) => {
                    const Icon = c.icon
                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => setCategory(c.key)}
                        className="flex items-center gap-4 rounded-xl border-2 border-slate-200 bg-white/60 p-4 text-left transition hover:border-travel-400 hover:bg-travel-50"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-travel-600 text-white">
                          <Icon size={22} />
                        </span>
                        <span className="flex-1">
                          <span className="block font-bold text-slate-800">{c.label}</span>
                          <span className="block text-xs text-slate-500">{c.desc}</span>
                        </span>
                        <ChevronDown size={18} className="-rotate-90 text-slate-400" />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* QRIS */}
            {category === 'QRIS' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="rounded-xl bg-slate-100/70 p-4 text-center">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Scan untuk membayar {formatRupiah(booking.totalPrice)}
                  </p>
                  <div className="mx-auto w-fit rounded-2xl bg-white p-3 shadow-sm">
                    <FakeQR seed={booking.bookingCode} />
                  </div>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-600">
                    <Smartphone size={14} /> Buka GoPay, OVO, DANA, ShopeePay, atau m-banking lalu pilih QRIS.
                  </p>
                </div>
                {error && <ErrorBox text={error} />}
                <button
                  onClick={createPayment}
                  disabled={busy}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-travel-600 to-travel-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-travel-600/40 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                >
                  {busy ? <LoaderCircle size={18} className="animate-spin" /> : <QrCode size={18} />}
                  {busy ? 'Membuat pembayaran...' : 'Buat Pembayaran QRIS'}
                </button>
                <button
                  onClick={() => setCategory(null)}
                  className="mt-2 w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Ganti metode
                </button>
              </motion.div>
            )}

            {/* BANK */}
            {category === 'BANK' && !bank && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-900">
                  <Landmark size={17} className="text-travel-600" /> Pilih Bank Kamu
                </h3>
                <p className="mb-4 text-xs text-slate-500">
                  Setelah dipilih, kamu akan diarahkan ke halaman pembayaran bank tersebut.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {BANKS.map((b) => (
                    <button
                      key={b.code}
                      type="button"
                      onClick={() => setBank(b)}
                      className="flex items-center justify-between rounded-xl border-2 border-slate-200 bg-white/70 px-4 py-3 text-left transition hover:border-travel-400"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="grid h-9 w-9 place-items-center rounded-full text-[11px] font-black text-white"
                          style={{ backgroundColor: b.color }}
                        >
                          {b.short.slice(0, 2).toUpperCase()}
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-slate-800">{b.name}</span>
                          <span className="block text-xs text-slate-500">Virtual Account</span>
                        </span>
                      </span>
                      <ChevronDown size={16} className="-rotate-90 text-slate-400" />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCategory(null)}
                  className="mt-3 w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Ganti metode
                </button>
              </motion.div>
            )}

            {/* BANK selected -> directed to that bank */}
            {category === 'BANK' && bank && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div
                  className="rounded-xl p-4 text-white"
                  style={{ background: `linear-gradient(120deg, ${bankInfo.color}, ${bankInfo.color}cc)` }}
                >
                  <div className="flex items-center gap-3">
                    <Banknote size={28} />
                    <div>
                      <p className="text-sm font-bold">{bankInfo.name}</p>
                      <p className="text-[11px] opacity-90">You will be redirected to {bankInfo.short}'s secure page</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[11px] opacity-80">Nomor Virtual Account</p>
                      <p className="font-mono font-bold">88{booking.id}9{String(booking.totalPrice).replace(/\D/g, '').slice(0, 6)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] opacity-80">Total Tagihan</p>
                      <p className="font-extrabold">{formatRupiah(booking.totalPrice)}</p>
                    </div>
                  </div>
                  <p className="mt-4 flex items-start gap-1.5 rounded-lg bg-black/20 px-3 py-2 text-[11px]">
                    <Lock size={12} className="mt-0.5 shrink-0" />
                    Simulasi: tombol di bawah mengarahkan pembayaran ke bank {bankInfo.short} (transaksi aman & terenkripsi).
                  </p>
                </div>
                {error && <ErrorBox text={error} />}
                <button
                  onClick={createPayment}
                  disabled={busy}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-travel-600 to-travel-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-travel-600/40 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                >
                  {busy ? <LoaderCircle size={18} className="animate-spin" /> : <Banknote size={18} />}
                  {busy ? 'Mengarahkan...' : `Lanjut ke ${bankInfo.short}`}
                </button>
                <button
                  onClick={() => setBank(null)}
                  className="mt-2 w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Pilih bank lain
                </button>
              </motion.div>
            )}

            {/* CARD */}
            {category === 'CARD' && (
              <motion.form onSubmit={handleCard} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-900">
                  <CreditCard size={17} className="text-travel-600" /> Data Kartu Kredit
                </h3>
                <div className="rounded-xl bg-slate-100/70 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                        Nama Pemegang Kartu *
                      </span>
                      <input
                        type="text"
                        value={card.holder}
                        onChange={(e) => setCard({ ...card, holder: e.target.value })}
                        placeholder="cth: ADE DERMAWAN"
                        className="w-full rounded-xl border-0 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-travel-500"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                        Nomor Kartu *
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={card.number}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
                          setCard({ ...card, number: digits.replace(/(\d{4})(?=\d)/g, '$1 ') })
                        }}
                        placeholder="0000 0000 0000 0000"
                        className="w-full rounded-xl border-0 bg-white px-4 py-3 font-mono text-sm font-medium text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-travel-500"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                        Masa Berlaku (MM/YY) *
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={card.expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                          if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
                          setCard({ ...card, expiry: v })
                        }}
                        placeholder="09/28"
                        className="w-full rounded-xl border-0 bg-white px-4 py-3 font-mono text-sm font-medium text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-travel-500"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                        CVV *
                      </span>
                      <input
                        type="password"
                        inputMode="numeric"
                        value={card.cvv}
                        onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        placeholder="123"
                        className="w-full rounded-xl border-0 bg-white px-4 py-3 font-mono text-sm font-medium text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-travel-500"
                      />
                    </label>
                  </div>
                  {cardError && <ErrorBox text={cardError} />}
                  <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Lock size={12} /> Data kartu disimulasikan & dienkripsi (tidak disimpan).
                  </p>
                </div>
                {error && <ErrorBox text={error} />}
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-travel-600 to-travel-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-travel-600/40 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                >
                  {busy ? <LoaderCircle size={18} className="animate-spin" /> : <CreditCard size={18} />}
                  {busy ? 'Memproses kartu...' : `Bayar ${formatRupiah(booking.totalPrice)}`}
                </button>
                <button
                  onClick={() => setCategory(null)}
                  className="mt-2 w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Ganti metode
                </button>
              </motion.form>
            )}
          </motion.div>
        )}

        {/* STEP: created */}
        {steps === 'created' && payment && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="mb-4 font-bold text-slate-900">Pembayaran Dibuat</h2>
            <div className="rounded-xl bg-slate-100/70 p-4">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-600">Metode</span>
                <span className="font-semibold text-travel-800">{methodLabel}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="font-semibold text-slate-600">Kode Pembayaran</span>
                <span className="font-mono font-bold text-travel-800">{payment.paymentCode}</span>
              </div>
              {payment.paymentMethod === 'QRIS' && (
                <div className="mt-3 flex flex-col items-center rounded-lg bg-white p-3 text-center">
                  <FakeQR seed={payment.paymentCode} />
                  <p className="mt-2 text-[11px] text-slate-500">
                    Scan QR di atas untuk menyelesaikan pembayaran.
                  </p>
                </div>
              )}
              {payment.paymentMethod !== 'QRIS' && payment.paymentMethod !== 'CREDIT_CARD' && (
                <div className="mt-3 rounded-lg bg-white p-3">
                  <p className="text-xs font-bold text-slate-700">
                    {BANKS.find((b) => payment.paymentMethod.includes(b.code))?.name ?? payment.paymentMethod}
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-slate-900">
                    VA 88{booking.id}9{String(payment.amount).replace(/\D/g, '').slice(0, 6)}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Transfer {formatRupiah(payment.amount)} melalui {payment.paymentMethod} / ATM / m-banking.
                  </p>
                </div>
              )}
              {payment.paymentMethod === 'CREDIT_CARD' && (
                <div className="mt-3 rounded-lg bg-white p-3">
                  <p className="text-xs font-bold text-slate-700">Pembayaran Kartu Kredit Anda diterima.</p>
                  <p className="font-mono text-sm font-bold text-slate-900">**** {card.number.replace(/\D/g, '').slice(-4)}</p>
                  <p className="mt-1 text-[11px] text-slate-500">Selesaikan otorisasi dengan menekan tombol konfirmasi.</p>
                </div>
              )}
              <div className="mt-1 flex justify-between text-sm">
                <span className="font-semibold text-slate-600">Status</span>
                <span className="font-semibold text-amber-600">{payment.status}</span>
              </div>
            </div>
            {error && <ErrorBox text={error} />}
            <button
              onClick={confirmPayment}
              disabled={busy}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/40 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
            >
              {busy ? <LoaderCircle size={18} className="animate-spin" /> : <CircleCheck size={18} />}
              {busy ? 'Mengonfirmasi...' : 'Saya Sudah Bayar (Konfirmasi)'}
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">
              Simulasi: konfirmasi langsung menandai pembayaran SUCCESS.
            </p>
          </motion.div>
        )}

        {/* STEP: success */}
        {steps === 'success' && payment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
              className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600"
            >
              <PartyPopper size={40} />
            </motion.div>
            <h2 className="text-2xl font-extrabold text-emerald-700">Pembayaran Berhasil!</h2>
            <p className="mt-2 text-sm text-slate-600">
              Booking kamu sudah dibayar dan berstatus PAID.
            </p>
            <div className="mx-auto mt-6 max-w-sm rounded-xl bg-slate-100/70 p-4 text-left">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-600">Kode Booking</span>
                <span className="font-mono font-bold text-travel-800">{booking.bookingCode}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="font-semibold text-slate-600">Metode</span>
                <span className="font-semibold text-travel-800">{methodLabel}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="font-semibold text-slate-600">Referensi Bayar</span>
                <span className="font-mono font-bold text-travel-800">{payment.paymentCode}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="font-semibold text-slate-600">Total</span>
                <span className="font-extrabold text-travel-700">{formatRupiah(payment.amount)}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => navigate('/bookings')}
                className="rounded-xl bg-gradient-to-r from-travel-600 to-travel-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
              >
                Lihat Pesanan
              </button>
              <Link
                to="/"
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-travel-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                Beranda
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function ErrorBox({ text }) {
  return (
    <div className="mt-4 rounded-xl bg-red-500/15 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-300/40">
      {text}
    </div>
  )
}