import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, Lock, UserRound, UserPlus, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function AuthPage() {
  const [params] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (params.get('mode') === 'register') {
      navigate('/register', { replace: true })
    }
  }, [params, navigate])

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login({ username: form.username, password: form.password })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 pl-11 text-sm font-medium text-white shadow-sm outline-none transition placeholder:text-slate-400 focus:border-travel-400 focus:ring-2 focus:ring-travel-400/30'

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden px-4 py-6">
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-travel-950/75 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-9">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-travel-600 text-white">
            <UserRound size={24} />
          </span>
          <div>
            <h1 className="text-xl font-extrabold text-white">Menu Login</h1>
            <p className="text-sm text-white/70">Selamat datang para pengguna!</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-300">Username</span>
            <div className="relative">
              <UserPlus size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" required value={form.username} onChange={set('username')} placeholder="username" className={inputClass} />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-300">Password</span>
            <div className="relative">
              <Lock size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={form.password}
                onChange={set('password')}
                placeholder="••••••"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          {error && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/15 px-4 py-3 text-sm font-medium text-rose-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-travel-600 to-travel-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-travel-600/40 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? <Loader2 size={18} className="animate-spin" /> : <UserRound size={18} />}
            {busy ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-300">
          Belum punya akun?{' '}
          <Link to="/register" className="font-bold text-travel-300 underline-offset-2 hover:underline">
            Daftar di sini
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-slate-400">
          Kembali ke <Link to="/" className="font-semibold text-travel-300 underline-offset-2 hover:underline">Beranda</Link>
        </p>
      </div>
    </div>
  )
}