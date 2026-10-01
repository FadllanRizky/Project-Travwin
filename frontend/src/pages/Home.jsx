import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Headset,
  BadgePercent,
  Compass,
  MapPin,
  Star,
  Users,
  BadgeCheck,
  Search,
  CalendarDays,
  CreditCard,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Quote,
} from 'lucide-react'
import ProductTabs from '../components/ProductTabs.jsx'
import SearchForm from '../components/SearchForm.jsx'
import { getProduct, PRODUCTS } from '../data/products.js'
import { formatRupiah } from '../lib/api.js'

const FEATURES = [
  { icon: ShieldCheck, title: 'Pembelian Aman', desc: 'Transaksi terproteksi penuh' },
  { icon: Headset, title: 'Support 24/7', desc: 'Bantuan kapan pun kamu butuh' },
  { icon: BadgePercent, title: 'Harga Terbaik', desc: 'Cicilan & promo terbaru' },
]

const STATS = [
  { icon: Compass, n: '7+', l: 'Layanan transport & akomodasi' },
  { icon: MapPin, n: '10rb+', l: 'Rute yang bisa dijelajahi' },
  { icon: Users, n: '50rb+', l: 'Traveler terdaftar' },
  { icon: Star, n: '4.8/5', l: 'Rating kepuasan pengguna' },
]

const POINTS = [
  'Satu akun untuk semua layanan perjalanan.',
  'Status pesanan bisa dicek kapan pun dari menu Pesanan Saya.',
  'Pembayaran aman dengan banyak pilihan metode.',
]

const DESTINATIONS = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Denpasar', 'Tokyo', 'Paris', 'Dubai', 'New York', 'Santorini']

const DESTINATION_CARDS = [
  { name: 'Ubud', region: 'Bali', hotels: 3, price: 950000, img: 'https://cdn.getyourguide.com/image/format=avif%2Cfit=cover%2Cgravity=auto%2Cquality=60/dam/iStock-2096414673-HeaderMobile.jpg' },
  { name: 'Kuta', region: 'Bali', hotels: 5, price: 580000, img: 'https://res.klook.com/image/upload/fl_lossy.progressive,q_60/v1777368017/destination/ai_poi_auto_51c61e_Uluwatu_Temple.png' },
  { name: 'Labuan Bajo', region: 'NTT · Pulau Komodo', hotels: 4, price: 1250000, img: 'https://res.klook.com/image/upload/fl_lossy.progressive,q_60/Mobile/City/rv76yqukp2hey0fckh99.jpg' },
  { name: 'Bromo', region: 'Jawa Timur', hotels: 4, price: 700000, img: 'https://jadiberangkat.id/wp-content/uploads/2025/03/penanjakan-bromo-1024x682.webp' },
  { name: 'Danau Toba', region: 'Sumatera Utara', hotels: 3, price: 650000, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEwUvozPQnak6bJVX-wQbk0NIhzn4GTm7DZXZn52ATRRGyBJoN4_eIkY0&s=10' },
  { name: 'Kuta Lombok', region: 'NTB · Mandalika', hotels: 3, price: 600000, img: 'https://2troubletravelers.com/wp-content/uploads/2025/07/mawun-beach-lombok-1.jpg' },
  { name: 'Raja Ampat', region: 'Papua Barat Daya', hotels: 3, price: 1150000, img: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Raja_Ampat%2C_Mutiara_Indah_di_Timur_Indonesia.jpg?utm_source=id.wikipedia.org&utm_campaign=index&utm_content=original' },
  { name: 'Yogyakarta', region: 'DI Yogyakarta', hotels: 4, price: 550000, img: 'https://ecolodgesindonesia.com/wp-content/uploads/2020/09/1-2.jpg' },
]

const SERVICE_DETAILS = {
  flights: 'Terbang ke kota-kota besar Indonesia dengan harga terbaik.',
  hotels: 'Menginap nyaman di 14 destinasi wisata unggulan.',
  trains: 'Jelajah antar kota dengan kereta api jadwal lengkap.',
  whoosh: 'Sampai tujuan berlipat cepat dengan kereta cepat.',
  travel: 'Travel shuttle & bus antar kota yang fleksibel.',
  rentals: 'Sewa mobil atau motor untuk mobilitas mandiri.',
  'airport-transfers': 'Antar jemput bandara yang selalu tepat waktu.',
}

const STEPS = [
  { icon: Search, t: 'Pilih Layanan', d: 'Pilih dari 7 layanan: pesawat, hotel, kereta, Whoosh, travel, rental, atau antar jemput bandara.' },
  { icon: CalendarDays, t: 'Isi Pencarian', d: 'Tentukan rute, tanggal, dan jumlah penumpang — hasil langsung diurutkan dari termurah.' },
  { icon: CreditCard, t: 'Bayar Aman', d: 'Lengkapi data & bayar lewat QRIS, virtual account, atau kartu kredit. Status update otomatis.' },
  { icon: Sparkles, t: 'Berangkat!', d: 'Tiket siap dipakai. Semua pesanan tersimpan di menu Pesanan Saya kapan pun kamu butuh.' },
]

const TESTIMONIALS = [
  { name: 'Raka Pratama', city: 'Jakarta', text: 'Booking pesawat plus hotel jadi sekali jalan, harga transparan, dan pembayaran QRIS-nya super gampang.' },
  { name: 'Dewi Anggraini', city: 'Bandung', text: 'Pertama kali pakai TravWin, nyari hotel di Ubud langsung ketemu mulai dari harga murah. Puas banget!' },
  { name: 'Bagus Wijaya', city: 'Surabaya', text: 'Rental mobilnya lengkap, ada motor juga. Antar jemput bandaranya pas banget sama jadwal mendarat.' },
]

const FAQS = [
  { q: 'Apakah pembayaran di TravWin aman?', a: 'Ya. Semua pembayaran diproses melalui kanal terpercaya dengan banyak pilihan metode: QRIS, transfer bank, virtual account, hingga kartu kredit.' },
  { q: 'Bagaimana cara melihat status pesanan saya?', a: 'Masuk ke menu Pesanan Saya — semua tiket, status pembayaran, dan detail perjalanan tampil lengkap di satu tempat.' },
  { q: 'Bisakah memesan untuk layanan selain pesawat & hotel?', a: 'Tentu. TravWin juga melayani kereta api, Whoosh, travel shuttle, rental kendaraan, dan antar jemput bandara.' },
  { q: 'Apakah harga sudah termasuk pajak?', a: 'Untuk penerbangan, harga yang tampil sudah termasuk pajak. Harga hotel dihitung per malam mengikuti tanggal menginap.' },
]

const dateStr = (d) => {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const TODAY_STR = dateStr(new Date())
const TOMORROW_STR = dateStr(new Date(Date.now() + 86400000))

function scrollToSearch() {
  document.getElementById('cari-booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Home() {
  const [active, setActive] = useState('flights')
  const [openFaq, setOpenFaq] = useState(0)
  const product = getProduct(active)

  return (
    <div className="mx-auto max-w-7xl px-4">
      <section id="cari-booking" className="flex min-h-[70vh] flex-col items-center justify-center gap-8 py-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl font-extrabold leading-tight text-white text-shadow sm:text-5xl">
            Tentukan <span className="text-travel-300">Arahmu</span>,
            <br />
            Kami Urus Sisanya
          </h1>
          <p className="mt-4 text-lg font-medium text-white/80">
            Pesan tiket pesawat, hotel, kereta, Whoosh, travel shuttle, rental mobil &
            motor, sampai antar jemput bandara — semua dalam satu tempat.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="w-full max-w-4xl"
        >
          <ProductTabs active={active} onChange={setActive} />
        </motion.div>

        <div className="w-full max-w-4xl">
          <SearchForm product={product} />
        </div>
      </section>

      <section className="grid gap-4 pb-12 sm:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20 backdrop-blur-md"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-travel-600/80 text-white ring-1 ring-white/10">
              <f.icon size={22} />
            </span>
            <div>
              <h3 className="font-bold text-white">{f.title}</h3>
              <p className="text-sm text-slate-300">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="py-14">
        <SectionHead
          badge="Semua Kebutuhanmu"
          title={
            <>
              Layanan dalam <span className="text-travel-300">Satu Platform</span>
            </>
          }
          sub="Tujuh layanan perjalanan andalan — tetap satu akun, satu riwayat, dan satu proses pembayaran."
        />
        <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <motion.button
              key={p.key}
              type="button"
              onClick={scrollToSearch}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group flex flex-col items-start rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-left shadow-lg shadow-black/20 backdrop-blur-md transition hover:border-travel-400/50 hover:bg-slate-900/90"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-travel-600/80 text-white ring-1 ring-white/10 transition group-hover:scale-105">
                <p.icon size={22} />
              </span>
              <h3 className="mt-3 font-extrabold text-white">{p.label}</h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-300">{SERVICE_DETAILS[p.key]}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-travel-300">
                Cari sekarang <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="py-14">
        <SectionHead
          badge="Destinasi Unggulan"
          title={
            <>
              Jelajah <span className="text-travel-300">Wisata Indonesia</span>
            </>
          }
          sub="Harga mulai dari kamar termurah di tiap destinasi — dari pantai Kuta sampai kepulauan Raja Ampat."
        />
        <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATION_CARDS.map((d, i) => (
            <motion.button
              key={d.name}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                const qs = new URLSearchParams({ destination: d.name, checkIn: TODAY_STR, checkOut: TOMORROW_STR, guests: '2' })
                window.location.href = `/search/hotels?${qs.toString()}`
              }}
              className="group relative h-64 overflow-hidden rounded-3xl border border-white/15 text-left shadow-xl shadow-black/30"
            >
              <img
                src={d.img}
                alt={`Destinasi ${d.name}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/25 to-slate-950/10" />
              <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/90 ring-1 ring-white/20 backdrop-blur">
                {d.region}
              </span>
              <span className="absolute inset-x-0 bottom-0 p-4">
                <span className="flex items-end justify-between gap-2">
                  <span>
                    <span className="block text-lg font-extrabold text-white text-shadow">{d.name}</span>
                    <span className="block text-[11px] font-semibold text-white/70">
                      {d.hotels} hotel · mulai {formatRupiah(d.price)}/malam
                    </span>
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-travel-600/90 text-white ring-1 ring-white/25 transition group-hover:scale-105 group-hover:brightness-110">
                    <ArrowRight size={16} />
                  </span>
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="py-14">
        <SectionHead
          badge="Gampang Banget"
          title={
            <>
              Cara Pesan dalam <span className="text-travel-300">4 Langkah</span>
            </>
          }
          sub="Dari mencari sampai bertolak, semuanya serba cepat dan tanpa ribet."
        />
        <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20 backdrop-blur-md"
            >
              <span className="absolute right-4 top-4 text-4xl font-black text-white/10">0{i + 1}</span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-travel-600/80 text-white ring-1 ring-white/10">
                <s.icon size={22} />
              </span>
              <h3 className="mt-3 font-extrabold text-white">{s.t}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-white/15 shadow-2xl shadow-black/40"
        >
          <img src="/img/flight-hero.jpg" alt="" loading="lazy" className="h-72 w-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/70 to-travel-900/40" />
          <div className="absolute inset-0 flex flex-col items-start justify-center gap-4 p-8 sm:p-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-200 ring-1 ring-amber-300/30 backdrop-blur">
              <Sparkles size={13} /> Promo Musim Ini
            </span>
            <h2 className="max-w-xl text-3xl font-extrabold leading-tight text-white text-shadow sm:text-4xl">
              Liburan Hemat, Kenangan <span className="text-amber-300">Maksimal</span>
            </h2>
            <p className="max-w-lg text-sm text-white/80">
              Rencanakan perjalananmu lebih awal dan dapatkan tarif terbaik di tiap layanan TravWin.
            </p>
            <button
              type="button"
              onClick={scrollToSearch}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-travel-600 to-travel-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-travel-900/40 transition hover:brightness-110 active:scale-95"
            >
              Mulai Cari Sekarang <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-14 text-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-travel-200 ring-1 ring-white/15">
          <Compass size={13} className="text-travel-300" /> Tentang TravWin
        </span>
        <h2 className="mt-4 text-3xl font-extrabold text-white text-shadow sm:text-4xl">
          Kenapa Harus <span className="text-travel-300">TravWin</span>?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
          TravWin menyatukan semua kebutuhan perjalanan dalam satu platform — dari tiket pesawat,
          hotel, kereta api, Whoosh, travel shuttle, rental, hingga antar jemput bandara — dengan
          pencarian yang cepat dan pembayaran yang terpercaya.
        </p>

        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20 backdrop-blur-md"
            >
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-travel-600/80 text-white ring-1 ring-white/10">
                <s.icon size={20} />
              </span>
              <p className="mt-3 text-2xl font-extrabold text-white">{s.n}</p>
              <p className="text-xs font-medium text-slate-300">{s.l}</p>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-left shadow-lg shadow-black/20 backdrop-blur-md">
            <h3 className="text-lg font-extrabold text-white">Mengapa kami dibangun?</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Berawal dari pengalaman traveling yang sering ribet: harga tersebar, jadwal tidak
              jelas, dan pembayaran tidak aman. Kami membangun platform yang transparan, mudah
              dipakai, dan bisa diandalkan kapan saja dan dimana saja.
            </p>
            <ul className="mt-4 space-y-2.5">
              {POINTS.map((pt) => (
                <li key={pt} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <BadgeCheck size={17} className="mt-0.5 shrink-0 text-emerald-400" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-left shadow-lg shadow-black/20 backdrop-blur-md">
            <h3 className="flex items-center gap-2 text-lg font-extrabold text-white">
              <MapPin size={18} className="text-travel-300" /> Populer untuk dijelajahi
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Dari kota lokal hingga destinasi mancanegara, TravWin membantumu sampai ke sana.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {DESTINATIONS.map((d) => (
                <span
                  key={d}
                  className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-travel-200 ring-1 ring-white/15 transition hover:bg-white/20"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <section className="py-14">
        <SectionHead
          badge="Kata Mereka"
          title={
            <>
              Cerita <span className="text-travel-300">Para Traveler</span>
            </>
          }
          sub="Pengalaman nyata yang mereka rasakan setelah menjelajah bersama TravWin."
        />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20 backdrop-blur-md"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-travel-600/80 text-white ring-1 ring-white/10">
                <Quote size={16} />
              </span>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-200">"{t.text}"</p>
              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="text-sm font-extrabold text-white">{t.name}</p>
                <p className="text-xs text-slate-400">{t.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-14">
        <SectionHead
          badge="Pusat Bantuan"
          title={
            <>
              Pertanyaan yang <span className="text-travel-300">Sering Ditanyakan</span>
            </>
          }
          sub="Tidak menemukan jawaban? Menu support 24/7 siap membantu kapan pun."
        />
        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {FAQS.map((f, i) => {
            const open = openFaq === i
            return (
              <div
                key={f.q}
                className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/20 backdrop-blur-md"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-extrabold text-white">{f.q}</span>
                  <ChevronDown size={18} className={`shrink-0 text-travel-300 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm leading-relaxed text-slate-300">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      <section className="pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-white/15 shadow-2xl shadow-black/40"
        >
          <img src="/img/beach-a.jpg" alt="" loading="lazy" className="h-80 w-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/55 to-travel-900/30" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 p-8 text-center">
            <h2 className="max-w-2xl text-3xl font-extrabold text-white text-shadow sm:text-4xl">
              Siap untuk <span className="text-travel-300">Petualangan</span> Berikutnya?
            </h2>
            <p className="text-sm text-white/80">
              Pesan sekarang — pilih arah, tentukan tujuan, dan biarkan kami yang mengurus sisanya.
            </p>
            <button
              type="button"
              onClick={scrollToSearch}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-travel-600 to-travel-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-travel-900/40 transition hover:brightness-110 active:scale-95"
            >
              Mulai Cari Sekarang <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

function SectionHead({ badge, title, sub }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-travel-200 ring-1 ring-white/15">
        {badge}
      </span>
      <h2 className="mt-4 text-3xl font-extrabold text-white text-shadow sm:text-4xl">{title}</h2>
      {sub && <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/70">{sub}</p>}
    </div>
  )
}