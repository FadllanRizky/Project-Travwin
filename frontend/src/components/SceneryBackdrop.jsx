const PALETTES = {
  emerald: { sky1: '#065f46', sky2: '#a7f3d0', sun: '#fef3c7', hill1: '#065f46', hill2: '#064e3b', hill3: '#022c22', hill4: '#14532d', glow: '#34d399' },
  jungle: { sky1: '#065f46', sky2: '#d1fae5', sun: '#fde68a', hill1: '#047857', hill2: '#065f46', hill3: '#064e3b', hill4: '#14532d', glow: '#6ee7b7' },
  sunset: { sky1: '#7c2d12', sky2: '#fdba74', sun: '#fef3c7', hill1: '#9a3412', hill2: '#7c2d12', hill3: '#431407', hill4: '#9a3412', glow: '#fdba74' },
  ocean: { sky1: '#0c4a6e', sky2: '#7dd3fc', sun: '#fef9c3', hill1: '#0e7490', hill2: '#155e75', hill3: '#164e63', hill4: '#0c4a6e', glow: '#22d3ee' },
  lake: { sky1: '#1e3a8a', sky2: '#a5b4fc', sun: '#fef3c7', hill1: '#1e40af', hill2: '#1e3a8a', hill3: '#172554', hill4: '#0f766e', glow: '#818cf8' },
  dawn: { sky1: '#4c1d95', sky2: '#f59e0b', sun: '#fef3c7', hill1: '#6d28d9', hill2: '#4c1d95', hill3: '#2e1065', hill4: '#7c2d12', glow: '#fb923c' },
  teal: { sky1: '#134e4a', sky2: '#5eead4', sun: '#ecfeff', hill1: '#0f766e', hill2: '#115e59', hill3: '#042f2e', hill4: '#14532d', glow: '#2dd4bf' },
  coral: { sky1: '#9f1239', sky2: '#fda4af', sun: '#fff1f2', hill1: '#be123c', hill2: '#9f1239', hill3: '#4c0519', hill4: '#fb7185', glow: '#fb7185' },
  lagoon: { sky1: '#164e63', sky2: '#a5f3fc', sun: '#ffe4e6', hill1: '#155e75', hill2: '#0e7490', hill3: '#083344', hill4: '#0d9488', glow: '#67e8f9' },
  brick: { sky1: '#7c2d12', sky2: '#ffedd5', sun: '#fef9c3', hill1: '#9a3412', hill2: '#7c2d12', hill3: '#431407', hill4: '#c2410c', glow: '#fdba74' },
  pines: { sky1: '#065f46', sky2: '#b8e6d8', sun: '#fef3c7', hill1: '#047857', hill2: '#065f46', hill3: '#064e3b', hill4: '#14532d', glow: '#34d399' },
  sand: { sky1: '#0c4a6e', sky2: '#fed7aa', sun: '#fffbeb', hill1: '#b45309', hill2: '#92400e', hill3: '#78350f', hill4: '#c2703d', glow: '#fbbf24' },
  green: { sky1: '#065f46', sky2: '#bbf7d0', sun: '#fef9c3', hill1: '#15803d', hill2: '#166534', hill3: '#14532d', hill4: '#4d7c0f', glow: '#4ade80' },
  aqua: { sky1: '#155e75', sky2: '#a5f3fc', sun: '#fef3c7', hill1: '#0e7490', hill2: '#155e75', hill3: '#164e63', hill4: '#0f766e', glow: '#67e8f9' },
}

const DEFAULT_PALETTE = {
  sky1: '#0f766e', sky2: '#a7f3d0', sun: '#fef3c7', hill1: '#115e59', hill2: '#134e4a', hill3: '#042f2e', hill4: '#064e3b', glow: '#34d399',
}

export default function SceneryBackdrop({ palette = 'emerald', className = '' }) {
  const p = PALETTES[palette] ?? DEFAULT_PALETTE

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <style>{`
        @keyframes scenery-drift {
          0% { transform: translateX(-12%); }
          50% { transform: translateX(12%); }
          100% { transform: translateX(-12%); }
        }
        @keyframes scenery-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes scenery-sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${p.sky1} 0%, ${p.sky2} 62%, ${p.sky2}cc 100%)`,
        }}
      />

      <div
        className="absolute left-1/2 top-[16%] h-40 w-40 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `${p.sun}66` }}
      />
      <div
        className="absolute left-1/2 top-[14%] h-20 w-20 -translate-x-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${p.sun} 0%, ${p.sun}99 55%, transparent 72%)`,
          boxShadow: `0 0 80px 26px ${p.glow}55`,
          animation: 'scenery-float 7s ease-in-out infinite',
        }}
      />

      {[
        { top: '6%', scale: 1.2, delay: '0s', dur: '26s', opacity: 0.55 },
        { top: '10%', scale: 0.9, delay: '-9s', dur: '20s', opacity: 0.4 },
        { top: '22%', scale: 0.6, delay: '-4s', dur: '24s', opacity: 0.5 },
      ].map((c, i) => (
        <div
          key={i}
          className="absolute left-0"
          style={{
            top: c.top,
            opacity: c.opacity,
            animation: `scenery-drift ${c.dur} ease-in-out infinite`,
            animationDelay: c.delay,
          }}
        >
          <div className="relative flex" style={{ transform: `scale(${c.scale})` }}>
            <span
              className="ml-[8vw] block h-10 w-40 rounded-full blur-[1px]"
              style={{ background: `${p.sun}55` }}
            />
            <span
              className="ml-[4vw] block h-8 w-52 rounded-full blur-[1px]"
              style={{ background: `${p.sun}66` }}
            />
            <span
              className="ml-[6vw] block h-12 w-40 rounded-full blur-[1px]"
              style={{ background: `${p.sun}44` }}
            />
          </div>
        </div>
      ))}

      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 620"
        preserveAspectRatio="none"
      >
        <path d="M0 380 L220 190 L420 330 L680 140 L940 340 L1180 210 L1440 340 L1440 620 L0 620 Z" fill={p.hill1} opacity="0.42" />
        <path d="M0 440 L260 260 L520 405 L820 230 L1100 410 L1340 300 L1440 380 L1440 620 L0 620 Z" fill={p.hill2} opacity="0.55" />
        <path d="M0 520 L300 360 L600 500 L920 340 L1220 505 L1440 430 L1440 620 L0 620 Z" fill={p.hill3} opacity="0.7" />
        <path d="M0 580 L360 470 L720 560 L1080 450 L1440 560 L1440 620 L0 620 Z" fill={p.hill4} opacity="0.9" />
      </svg>

      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 14 }).map((_, i) => {
          const x = i * 110 + Math.sin(i * 7) * 40
          const h = 40 + ((i * 17) % 46)
          return (
            <polygon
              key={i}
              points={`${x},150 ${x + 9},${150 - h} ${x + 12},${150 - h - 14} ${x + 21},${150 - h} ${x + 30},150`}
              fill="#020617"
              opacity="0.85"
            />
          )
        })}
      </svg>

      <div
        className="absolute left-[8%] bottom-0 h-40 w-40"
        style={{ animation: 'scenery-sway 8s ease-in-out infinite', transformOrigin: 'bottom center' }}
      >
        <svg viewBox="0 0 100 120" className="h-full w-full drop-shadow-lg">
          <path d="M50 120 C 44 80, 30 66, 46 40 C 58 58, 56 70, 52 74 C 66 60, 78 48, 92 46 C 80 66, 66 76, 54 78 C 66 96, 62 108, 50 120 Z" fill="#020617" />
          <rect x="47" y="100" width="6" height="20" fill="#020617" />
        </svg>
      </div>

      <div
        className="absolute right-[10%] bottom-0 h-36 w-36"
        style={{ animation: 'scenery-sway 9s ease-in-out infinite', animationDelay: '-3s', transformOrigin: 'bottom center' }}
      >
        <svg viewBox="0 0 100 120" className="h-full w-full drop-shadow-lg">
          <path d="M50 120 C 44 80, 30 66, 46 40 C 58 58, 56 70, 52 74 C 66 60, 78 48, 92 46 C 80 66, 66 76, 54 78 C 66 96, 62 108, 50 120 Z" fill="#0f172a" />
          <rect x="47" y="100" width="6" height="20" fill="#0f172a" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-transparent to-slate-950/70" />
    </div>
  )
}