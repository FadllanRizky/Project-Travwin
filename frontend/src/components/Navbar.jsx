import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plane, TicketCheck, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="relative z-20 bg-gradient-to-r from-travel-950/70 to-travel-800/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/30">
            <Plane size={22} className="text-white" />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-shadow">
            Trav<span className="text-travel-300">Win</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/bookings"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            <TicketCheck size={18} />
            <span className="hidden sm:inline">Pesanan Saya</span>
          </Link>

          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 ring-1 ring-white/30">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-travel-500 text-sm font-bold text-white">
                  {user.username?.charAt(0).toUpperCase()}
                </span>
                <span className="hidden text-sm font-semibold text-white sm:inline">
                  {user.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Keluar"
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white ring-1 ring-white/30 transition hover:bg-red-500/40"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/auth' && location.pathname !== '/register' && (
                <Link
                  to="/auth?mode=login"
                  className="hidden rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/25 sm:block"
                >
                  Masuk
                </Link>
              )}
              {location.pathname !== '/auth' && location.pathname !== '/register' && (
                <Link
                  to="/register"
                  className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-travel-800 shadow-lg transition hover:bg-travel-50"
                >
                  Daftar
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  )
}