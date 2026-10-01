import { motion } from 'framer-motion'

const DESTINATIONS = [
  {
    name: 'Paris',
    country: 'Prancis',
    photo: 'photo-1502602898657-3e91760cbb34',
    cls: 'left-[2%] top-[8%] h-52 w-80 -rotate-3',
    zoom: [1, 1.09],
    duration: 30,
    delay: 0,
  },
  {
    name: 'Santorini',
    country: 'Yunani',
    photo: 'photo-1613395877344-13d4a8e0d49e',
    cls: 'right-[3%] top-[10%] h-40 w-64 rotate-2 hidden md:block',
    zoom: [1, 1.11],
    duration: 26,
    delay: 2,
  },
  {
    name: 'Tokyo',
    country: 'Jepang',
    photo: 'photo-1503899036084-c55cdd92da26',
    cls: 'right-[1%] top-[38%] h-44 w-72 -rotate-2 hidden md:block',
    zoom: [1, 1.08],
    duration: 34,
    delay: 4,
  },
  {
    name: 'Taj Mahal',
    country: 'India',
    photo: 'photo-1564507592333-c60657eea523',
    cls: 'left-[1%] top-[40%] h-40 w-64 rotate-3',
    zoom: [1, 1.1],
    duration: 28,
    delay: 1,
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    photo: 'photo-1537996194471-e657df975ab4',
    cls: 'bottom-[4%] left-[5%] h-44 w-72 -rotate-2',
    zoom: [1, 1.09],
    duration: 32,
    delay: 3,
  },
  {
    name: 'Dubai',
    country: 'UEA',
    photo: 'photo-1512453979798-5ea266f8880c',
    cls: 'bottom-[3%] right-[4%] h-40 w-64 rotate-2 hidden md:block',
    zoom: [1, 1.12],
    duration: 27,
    delay: 5,
  },
  {
    name: 'Machu Picchu',
    country: 'Peru',
    photo: 'photo-1526392060635-9d6019884377',
    cls: 'left-[20%] top-[4%] h-36 w-56 rotate-1 hidden lg:block',
    zoom: [1, 1.1],
    duration: 29,
    delay: 2,
  },
  {
    name: 'New York',
    country: 'AS',
    photo: 'photo-1496442226666-8d4d0e62e6e9',
    cls: 'bottom-[8%] right-[20%] h-36 w-52 -rotate-1 hidden lg:block',
    zoom: [1, 1.08],
    duration: 31,
    delay: 4,
  },
]

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-travel-950 via-travel-900 to-sky-900">
      {/* World destination collage */}
      <div className="absolute inset-0">
        {DESTINATIONS.map((d) => (
          <DestinationCard key={d.name} {...d} />
        ))}
      </div>

      {/* Soft vignette so content stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(3,10,45,0.12)_0%,rgba(3,10,45,0.72)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-travel-950/80 to-transparent" />

      {/* Faint grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  )
}

function DestinationCard({ name, country, photo, cls, zoom, duration, delay }) {
  return (
    <motion.figure
      className={`absolute overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/25 ${cls}`}
      animate={{ scale: zoom }}
      transition={{ duration, delay, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
    >
      <img
        src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=700&q=80`}
        alt={name}
        loading="lazy"
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      <figcaption className="absolute bottom-2 left-2 rounded-lg bg-travel-950/75 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
        {name}
        <span className="ml-1.5 font-medium text-white/70">{country}</span>
      </figcaption>
    </motion.figure>
  )
}