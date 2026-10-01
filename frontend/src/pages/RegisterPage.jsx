import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  CircleCheck,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const SLIDES = [
  { photo: 'https://visitjawatengah.jatengprov.go.id/assets/images/b2238f62-0d5f-45c4-95d5-64a187b30cc32.jpeg', label: 'Candi Borobudur · Indonesia' },
  { photo: 'https://awsimages.detik.net.id/community/media/visual/2019/11/20/be1dfa6c-2431-4fc0-9ffc-0094a29df392_169.jpeg?w=1200', label: 'El Nido · Filipina' },
  { photo: 'https://www.les13assiettes.com/bases/visite_image/grande/35/1024px-Mont_St_Michel_at_sunrise1.jpg', label: 'Mont Saint Michel · Perancis' },
  { photo: 'https://cdn.kimkim.com/files/a/content_articles/featured_photos/67e29f693c4419341c375d333e11c210955cf3dc/big-4961ddd185dc668d672a13b52b6fe90f.jpg', label: 'Rio de Janeiro · Brazil' },
]

const COUNTRY_CODES = [
  { code: '+62', flag: '🇮🇩', label: 'Indonesia (+62)' },
  { code: '+60', flag: '🇲🇾', label: 'Malaysia (+60)' },
  { code: '+65', flag: '🇸🇬', label: 'Singapura (+65)' },
  { code: '+63', flag: '🇵🇭', label: 'Filipina (+63)' },
  { code: '+66', flag: '🇹🇭', label: 'Thailand (+66)' },
  { code: '+84', flag: '🇻🇳', label: 'Vietnam (+84)' },
  { code: '+81', flag: '🇯🇵', label: 'Jepang (+81)' },
  { code: '+82', flag: '🇰🇷', label: 'Korea Selatan (+82)' },
  { code: '+86', flag: '🇨🇳', label: 'China (+86)' },
  { code: '+966', flag: '🇸🇦', label: 'Arab Saudi (+966)' },
  { code: '+61', flag: '🇦🇺', label: 'Australia (+61)' },
  { code: '+44', flag: '🇬🇧', label: 'Inggris (+44)' },
  { code: '+1', flag: '🇺🇸', label: 'Amerika (+1)' },
  { code: '+49', flag: '🇩🇪', label: 'Jerman (+49)' },
  { code: '+33', flag: '🇫🇷', label: 'Prancis (+33)' },
  { code: '+31', flag: '🇳🇱', label: 'Belanda (+31)' },
  { code: '+90', flag: '🇹🇷', label: 'Turki (+90)' },
]

const EMAIL_DOMAIN_REGEX = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|yahoo\.co\.id|outlook\.com)$/i
const NAME_CHARS_REGEX = /^[a-zA-Z\s]+$/
const VOWEL_REGEX = /[aiueoAIUEO]/

function evaluatePassword(pw) {
  const hasMinLength = pw.length >= 7
  const hasUpper = /[A-Z]/.test(pw)
  const hasLower = /[a-z]/.test(pw)
  const hasNumber = /[0-9]/.test(pw)
  const hasSymbol = /[^A-Za-z0-9]/.test(pw)

  const valid = hasMinLength && hasUpper && hasLower && hasNumber && hasSymbol
  const criteriaPassed = [hasMinLength, hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length

  let label = 'Lemah'
  let bar = 'bg-rose-400'
  if (criteriaPassed >= 5) {
    label = 'Sangat Kuat'
    bar = 'bg-emerald-400'
  } else if (criteriaPassed >= 3) {
    label = 'Sedang'
    bar = 'bg-amber-400'
  }

  return {
    valid,
    criteriaPassed,
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSymbol,
    label,
    bar,
  }
}

const baseInput =
  'w-full rounded-xl border bg-white/10 px-4 py-3 text-sm text-white placeholder-white/35 outline-none backdrop-blur-sm transition focus:ring-2'

function Field({ icon: Icon, label, error, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-white/70">
        <Icon size={13} className="text-travel-300" />
        {label}
      </span>
      {children}
      {(error || hint) && (
        <span
          className={`mt-1.5 flex items-center gap-1 text-[11px] ${
            error ? 'font-medium text-rose-300' : 'text-white/45'
          }`}
        >
          {error && <CircleAlert size={12} className="shrink-0" />}
          <span>{error || hint}</span>
        </span>
      )}
    </label>
  )
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [slide, setSlide] = useState(0)
  const [countryCode, setCountryCode] = useState('+62')
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', username: '', email: '', password: '' })
  const [confirm, setConfirm] = useState('')
  const [touched, setTouched] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [duplicateModal, setDuplicateModal] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000)
    return () => clearInterval(t)
  }, [])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const touch = (key) => () => setTouched((t) => ({ ...t, [key]: true }))

  const trimmedName = form.fullName.trim()
  const nameMinOk = trimmedName.length >= 3
  const nameCharsOk = trimmedName.length > 0 && NAME_CHARS_REGEX.test(trimmedName)
  const nameVowelOk = VOWEL_REGEX.test(trimmedName)
  const fullNameOk = nameMinOk && nameCharsOk && nameVowelOk

  let nameError = ''
  if (touched.fullName) {
    if (!nameMinOk) nameError = 'Nama minimal 3 huruf'
    else if (!nameCharsOk) nameError = 'Hanya boleh berisi huruf alfabet (tanpa angka/simbol)'
    else if (!nameVowelOk) nameError = 'Wajib mengandung huruf vokal (a, i, u, e, o)'
  }

  const emailOk = EMAIL_DOMAIN_REGEX.test(form.email.trim())
  const usernameOk = form.username.trim().length >= 3

  const phoneDigits = form.phoneNumber.replace(/\D/g, '')
  const phoneOk = phoneDigits.length >= 8 && phoneDigits.length <= 13

  const pwEval = evaluatePassword(form.password)
  const passwordOk = pwEval.valid
  const confirmOk = confirm.length > 0 && confirm === form.password

  const canSubmit = fullNameOk && emailOk && usernameOk && phoneOk && passwordOk && confirmOk && !busy

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit || busy) return
    setBusy(true)
    setError('')
    setDuplicateModal(null)

    const fullPhoneNumber = `${countryCode}${phoneDigits}`

    try {
      await register({
        fullName: trimmedName,
        email: form.email.trim().toLowerCase(),
        phoneNumber: fullPhoneNumber,
        username: form.username.trim(),
        password: form.password,
      })
      setSuccess(true)
      setTimeout(() => navigate('/', { replace: true }), 1800)
    } catch (err) {
      setBusy(false)
      const errCode = err?.code || ''
      const errMsg = err?.message || ''

      if (errCode === 'EMAIL_EXISTS' || (errMsg.toLowerCase().includes('email') && errMsg.toLowerCase().includes('terdaftar'))) {
        setDuplicateModal({
          type: 'email',
          title: 'Email Sudah Terdaftar',
          field: 'Email',
          value: form.email.trim(),
          message: 'Email ini telah digunakan oleh akun lain di TravWin. Karena alamat email bersifat sensitif dan penting untuk keamanan akun, satu email hanya dapat digunakan untuk satu akun.',
        })
      } else if (errCode === 'PHONE_EXISTS' || (errMsg.toLowerCase().includes('telepon') && errMsg.toLowerCase().includes('terdaftar'))) {
        setDuplicateModal({
          type: 'phone',
          title: 'Nomor Telepon Sudah Terdaftar',
          field: 'No. Telepon',
          value: `${countryCode} ${phoneDigits}`,
          message: 'Nomor telepon ini telah terdaftar di sistem TravWin. Demi keamanan transaksi dan perlindungan data pribadi, setiap akun wajib memiliki nomor telepon yang unik.',
        })
      } else if (errCode === 'USERNAME_EXISTS' || (errMsg.toLowerCase().includes('username') && errMsg.toLowerCase().includes('digunakan'))) {
        setError('Username sudah digunakan oleh akun lain. Silakan pilih username yang berbeda.')
      } else {
        setError(errMsg || 'Terjadi kesalahan saat pendaftaran. Silakan periksa kembali data Anda.')
      }
    }
  }

  return (
    <div className="relative z-10 mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:gap-14">
      {/* Brand / showcase — desktop */}
      <div className="relative hidden lg:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] ring-1 ring-white/15 shadow-2xl shadow-black/50"
        >
          <div className="absolute inset-0">
            <AnimatePresence>
              {SLIDES.map((s, i) =>
                i === slide ? (
                  <motion.img
                    key={s.photo}
                    src={s.photo}
                    alt={s.label}
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1.08 }}
                    exit={{ opacity: 0 }}
                    transition={{ opacity: { duration: 1.4 }, scale: { duration: 7, ease: 'linear' } }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null
              )}
            </AnimatePresence>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-travel-950/95 via-travel-950/25 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-7">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
              <Sparkles size={13} className="text-amber-300" />
              1 akun · semua perjalanan
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white text-shadow">
              Perjalanan impianmu
              <br />
              dimulai dari sini.
            </h2>
            <div className="mt-5 flex gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={s.photo}
                  onClick={() => setSlide(i)}
                  aria-label={s.label}
                  className={`h-1.5 rounded-full transition-all ${
                    i === slide ? 'w-10 bg-white' : 'w-4 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-xs font-semibold text-white/70">{SLIDES[slide].label}</p>
          </div>
        </motion.div>
      </div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto w-full max-w-md rounded-[2rem] bg-travel-950/70 p-7 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-xl sm:p-9"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-10 text-center"
            >
              <span className="relative grid h-20 w-20 place-items-center rounded-full bg-emerald-100">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }}
                  className="absolute inset-2 rounded-full bg-emerald-500"
                />
                <CircleCheck size={38} className="relative text-white" />
              </span>
              <h3 className="mt-5 text-2xl font-extrabold text-white">Akun berhasil dibuat!</h3>
              <p className="mt-1.5 text-sm text-white/70">Selamat datang di keluarga TravWin. Mengarahkanmu ke beranda...</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-6">
                <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-travel-200 ring-1 ring-white/15">
                  <Sparkles size={12} className="text-travel-300" /> Daftar gratis
                </p>
                <h1 className="mt-3 text-2xl font-extrabold text-white">Buat Akun Baru</h1>
                <p className="mt-1 text-sm text-white/70">Pendaftaran mudah dengan verifikasi data terpercaya.</p>
              </div>

              <form onSubmit={submit} className="space-y-4" noValidate>
                <Field
                  icon={UserRound}
                  label="Nama Lengkap (Min. 3 huruf & wajib huruf vokal)"
                  error={nameError}
                >
                  <input
                    className={`${baseInput} ${
                      nameError
                        ? 'border-rose-400/70 focus:ring-rose-400/40'
                        : 'border-white/15 hover:border-white/30 focus:border-travel-300 focus:ring-travel-300/40'
                    }`}
                    placeholder="cth: Budi Santoso"
                    value={form.fullName}
                    onChange={set('fullName')}
                    onBlur={touch('fullName')}
                    autoFocus
                  />
                </Field>

                <Field
                  icon={Phone}
                  label="No. Telepon (Pilih kode negara & 8 - 13 digit)"
                  error={touched.phoneNumber && !phoneOk ? 'Nomor telepon harus antara 8 - 13 digit angka' : ''}
                >
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-28 shrink-0 rounded-xl border border-white/15 bg-slate-900/90 px-2 py-3 text-xs font-bold text-white outline-none backdrop-blur-sm transition hover:border-white/30 focus:border-travel-300 focus:ring-2 focus:ring-travel-300/40"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      maxLength={13}
                      className={`flex-1 ${baseInput} ${
                        touched.phoneNumber && !phoneOk
                          ? 'border-rose-400/70 focus:ring-rose-400/40'
                          : 'border-white/15 hover:border-white/30 focus:border-travel-300 focus:ring-travel-300/40'
                      }`}
                      placeholder="8123456789"
                      value={form.phoneNumber}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 13)
                        setForm((prev) => ({ ...prev, phoneNumber: digits }))
                      }}
                      onBlur={touch('phoneNumber')}
                    />
                  </div>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    icon={Lock}
                    label="Username"
                    error={touched.username && !usernameOk ? 'Minimal 3 karakter' : ''}
                  >
                    <input
                      className={`${baseInput} ${
                        touched.username && !usernameOk
                          ? 'border-rose-400/70 focus:ring-rose-400/40'
                          : 'border-white/15 hover:border-white/30 focus:border-travel-300 focus:ring-travel-300/40'
                      }`}
                      placeholder="cth: budi_travel"
                      value={form.username}
                      onChange={set('username')}
                      onBlur={touch('username')}
                    />
                  </Field>

                  <Field
                    icon={Mail}
                    label="Email (Gmail, Yahoo, Outlook)"
                    error={
                      touched.email && !emailOk
                        ? 'Wajib @gmail.com, @yahoo.com, atau @outlook.com'
                        : ''
                    }
                  >
                    <input
                      type="email"
                      className={`${baseInput} ${
                        touched.email && !emailOk
                          ? 'border-rose-400/70 focus:ring-rose-400/40'
                          : 'border-white/15 hover:border-white/30 focus:border-travel-300 focus:ring-travel-300/40'
                      }`}
                      placeholder="nama@gmail.com"
                      value={form.email}
                      onChange={set('email')}
                      onBlur={touch('email')}
                    />
                  </Field>
                </div>

                <div>
                  <Field
                    icon={ShieldCheck}
                    label="Password"
                    error={touched.password && !passwordOk ? 'Password belum memenuhi seluruh syarat' : ''}
                  >
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        className={`${baseInput} pr-11 ${
                          touched.password && !passwordOk
                            ? 'border-rose-400/70 focus:ring-rose-400/40'
                            : 'border-white/15 hover:border-white/30 focus:border-travel-300 focus:ring-travel-300/40'
                        }`}
                        placeholder="Min. 7 karakter & simbol"
                        value={form.password}
                        onChange={set('password')}
                        onBlur={touch('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300/80 transition hover:text-white"
                        aria-label="Tampilkan password"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>

                  {/* Password Requirements Checklist */}
                  <div className="mt-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-[11px]">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold text-white/70">Syarat Keamanan Password:</span>
                      <span className={`font-bold ${pwEval.valid ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {form.password ? pwEval.label : 'Wajib diisi'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <span className={`flex items-center gap-1.5 ${pwEval.hasMinLength ? 'text-emerald-300' : 'text-white/40'}`}>
                        <Check size={12} className={pwEval.hasMinLength ? 'text-emerald-400' : 'opacity-40'} /> Min. 7 Karakter
                      </span>
                      <span className={`flex items-center gap-1.5 ${pwEval.hasUpper ? 'text-emerald-300' : 'text-white/40'}`}>
                        <Check size={12} className={pwEval.hasUpper ? 'text-emerald-400' : 'opacity-40'} /> 1 Huruf Besar (A-Z)
                      </span>
                      <span className={`flex items-center gap-1.5 ${pwEval.hasLower ? 'text-emerald-300' : 'text-white/40'}`}>
                        <Check size={12} className={pwEval.hasLower ? 'text-emerald-400' : 'opacity-40'} /> 1 Huruf Kecil (a-z)
                      </span>
                      <span className={`flex items-center gap-1.5 ${pwEval.hasNumber ? 'text-emerald-300' : 'text-white/40'}`}>
                        <Check size={12} className={pwEval.hasNumber ? 'text-emerald-400' : 'opacity-40'} /> 1 Angka (0-9)
                      </span>
                      <span className={`col-span-2 flex items-center gap-1.5 ${pwEval.hasSymbol ? 'text-emerald-300' : 'text-white/40'}`}>
                        <Check size={12} className={pwEval.hasSymbol ? 'text-emerald-400' : 'opacity-40'} /> 1 Simbol Khusus (!@#$%^&*...)
                      </span>
                    </div>
                  </div>
                </div>

                <Field
                  icon={ShieldCheck}
                  label="Konfirmasi Password"
                  error={touched.confirm && !confirmOk ? 'Konfirmasi password tidak sama' : ''}
                  hint={!touched.confirm ? 'Ketik ulang password barusan' : ''}
                >
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      className={`${baseInput} pr-11 ${
                        touched.confirm && !confirmOk
                          ? 'border-rose-400/70 focus:ring-rose-400/40'
                          : 'border-white/15 hover:border-white/30 focus:border-travel-300 focus:ring-travel-300/40'
                      }`}
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      onBlur={touch('confirm')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300/80 transition hover:text-white"
                      aria-label="Tampilkan konfirmasi password"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/15 px-3.5 py-2.5 text-xs font-semibold text-rose-200"
                  >
                    <CircleAlert size={15} className="shrink-0" />
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-travel-600 to-travel-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-travel-600/40 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Memverifikasi data...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="transition-transform group-hover:rotate-12" />
                      Daftar Sekarang
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 flex items-center gap-3 text-[11px] text-white/60">
                <span className="flex items-center gap-1">
                  <BadgeCheck size={13} className="text-emerald-400" /> Data terenkripsi
                </span>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                <span className="flex items-center gap-1">
                  <BadgeCheck size={13} className="text-emerald-400" /> 1 akun unik per email &amp; no. hp
                </span>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-white/50">
                Dengan mendaftar, kamu menyetujui Syarat &amp; Ketentuan dan Kebijakan Privasi TravWin.
              </p>

              <p className="mt-5 border-t border-white/20 pt-4 text-center text-sm text-white/70">
                Sudah punya akun?{' '}
                <Link to="/auth?mode=login" className="font-bold text-travel-300 underline-offset-2 hover:underline">
                  Masuk di sini
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Duplicate Data Pop-up Modal */}
      <AnimatePresence>
        {duplicateModal && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDuplicateModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-rose-400/30 bg-slate-900/95 p-7 text-white shadow-2xl shadow-rose-950/50 backdrop-blur-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30">
                    <ShieldAlert size={26} />
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">{duplicateModal.title}</h3>
                    <p className="text-xs text-rose-300/80">Peringatan Keamanan &amp; Data Sensitif</p>
                  </div>
                </div>
                <button
                  onClick={() => setDuplicateModal(null)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="my-5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5">
                <p className="text-xs font-semibold text-rose-300">
                  {duplicateModal.field}: <span className="font-mono text-white">{duplicateModal.value}</span>
                </p>
              </div>

              <p className="text-sm leading-relaxed text-slate-300">
                {duplicateModal.message}
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setDuplicateModal(null)}
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 active:scale-95"
                >
                  Ganti {duplicateModal.field}
                </button>
                <Link
                  to="/auth?mode=login"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-travel-600 to-travel-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-travel-600/30 transition hover:brightness-110 active:scale-95"
                >
                  Masuk Sekarang
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}