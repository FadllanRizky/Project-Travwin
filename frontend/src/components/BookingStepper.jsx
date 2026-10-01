import { Link } from 'react-router-dom'
import { Plane, Hotel, TrainFront, ClipboardList, CreditCard, Check } from 'lucide-react'

const VARIANTS = {
  flight: {
    name: 'flight',
    steps: [
      { key: 1, label: 'Pilih Penerbangan', to: '/search/flights', icon: Plane },
      { key: 2, label: 'Data Penumpang', icon: ClipboardList },
      { key: 3, label: 'Pembayaran', icon: CreditCard },
    ],
  },
  hotel: {
    name: 'hotel',
    steps: [
      { key: 1, label: 'Pilih Hotel', to: '/search/hotels', icon: Hotel },
      { key: 2, label: 'Data Tamu', icon: ClipboardList },
      { key: 3, label: 'Pembayaran', icon: CreditCard },
    ],
  },
  train: {
    name: 'train',
    steps: [
      { key: 1, label: 'Pilih Jadwal', to: '/search/trains', icon: TrainFront },
      { key: 2, label: 'Data Penumpang', icon: ClipboardList },
      { key: 3, label: 'Pembayaran', icon: CreditCard },
    ],
  },
}

export default function BookingStepper({ current, variant = 'flight', onlyLabel = false }) {
  const STEPS = VARIANTS[variant]?.steps ?? VARIANTS.flight.steps
  return (
    <ol className="flex items-center gap-1 sm:gap-3">
      {STEPS.map((s, i) => {
        const Icon = s.icon
        const done = s.key < current
        const active = s.key === current
        const content = (
          <>
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ring-2 transition ${
                done
                  ? 'bg-emerald-500 text-white ring-emerald-300/60'
                  : active
                    ? 'bg-travel-500 text-white ring-travel-300/70'
                    : 'bg-white/5 text-slate-300 ring-white/15'
              }`}
            >
              {done ? <Check size={15} /> : <Icon size={15} />}
            </span>
            <span
              className={`hidden text-xs font-bold sm:block ${
                active ? 'text-white' : done ? 'text-slate-200' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
          </>
        )

        return (
          <li key={s.key} className={`flex items-center gap-1 sm:gap-3 ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
            {s.to && !onlyLabel ? (
              <Link
                to={s.to}
                className={`flex items-center gap-2 ${active ? 'pointer-events-none opacity-100' : 'hover:opacity-80'}`}
              >
                {content}
              </Link>
            ) : (
              <span className="flex items-center gap-2">{content}</span>
            )}
            {i < STEPS.length - 1 && (
              <span className={`h-px flex-1 ${active || done ? 'bg-travel-400/60' : 'bg-white/10'}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}