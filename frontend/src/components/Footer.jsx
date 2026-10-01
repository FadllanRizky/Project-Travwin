import { useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, FileText, ScrollText, LifeBuoy, Headset, Star, MapPin, Mail, Phone, X, Plane, ShieldCheck, BadgePercent, Heart } from 'lucide-react'
import { PRODUCTS } from '../data/products.js'

const INFO = {
  tentang: {
    title: 'Tentang TravWin',
    icon: Compass,
    sections: [
      {
        h: 'Apa itu TravWin?',
        p: 'TravWin adalah platform pemesanan perjalanan all-in-one yang menghubungkan kamu dengan tiket pesawat, hotel, kereta api, Whoosh, travel shuttle, rental mobil & motor, hingga antar jemput bandara — semua dalam satu ekosistem.',
      },
      {
        h: 'Misi Kami',
        p: 'Kami percaya perjalanan harus mudah dan menyenangkan. Misi kami adalah menyederhanakan proses pencarian, pembandingan, dan pembayaran sehingga kamu bisa fokus menikmati destinasi, bukan repot dengan urusan logistik.',
      },
      {
        h: 'Siapa di Baliknya',
        p: 'Dibangun oleh tim penggemar traveling dengan pendekatan microservices yang modern, aman, dan skalabel. Data kamu disimpan dengan enkripsi dan ditangani sesuai standar industri.',
      },
    ],
  },
  kebijakan: {
    title: 'Kebijakan Privasi',
    icon: FileText,
    sections: [
      {
        h: 'Pengumpulan Data',
        p: 'Kami mengumpulkan data yang kamu berikan saat mendaftar (nama, email, nomor telepon, username) serta data pencarian dan pemesanan untuk memperbaiki layanan. Kami tidak pernah menjual data pribadimu.',
      },
      {
        h: 'Penggunaan Data',
        p: 'Data digunakan untuk memproses pemesanan, menyimpan riwayat, memverifikasi akun, dan memberikan dukungan pelanggan. Notifikasi hanya dikirim sesuai kebutuhan akunmu.',
      },
      {
        h: 'Perlindungan Data',
        p: 'Kata sandi disimpan dengan aman, sesi dilindungi token, dan akses ke sistem dibatasi hanya untuk keperluan operasional. Koneksi dilindungi enkripsi HTTPS.',
      },
      {
        h: 'Cookie & Penyimpanan Lokal',
        p: 'Kami menggunakan penyimpanan lokal di browser untuk mengingat sesi login agar kamu tidak perlu masuk berulang kali. Data sesi dapat dihapus kapan saja dari pengaturan browser.',
      },
    ],
  },
  syarat: {
    title: 'Syarat & Ketentuan',
    icon: ScrollText,
    sections: [
      {
        h: 'Pemesanan',
        p: 'Dengan melakukan pemesanan, kamu dianggap telah membaca dan menyetujui skema jadwal, harga, serta ketersediaan yang ditampilkan layanan mitra. Harga dapat berubah mengikuti kebijakan mitra.',
      },
      {
        h: 'Pembayaran',
        p: 'Pembayaran dilakukan setelah konfirmasi pesanan. Kami mendukung beberapa metode (virtual account, transfer, e-wallet). Pesanan dianggap sah setelah pembayaran dikonfirmasi.',
      },
      {
        h: 'Pembatalan & Pengembalian',
        p: 'Kebijakan pembatalan mengikuti aturan masing-masing layanan mitra. Ajukan pembatalan melalui halaman Pesanan Saya atau hubungi pusat bantuan kami.',
      },
      {
        h: 'Tanggung Jawab Pengguna',
        p: 'Pastikan data penumpang/peserta sudah benar sebelum menyelesaikan pembayaran. Data yang salah dapat membuat tiket tidak dapat digunakan.',
      },
    ],
  },
  bantuan: {
    title: 'Pusat Bantuan & Kontak',
    icon: LifeBuoy,
    contact: true,
    sections: [
      {
        h: 'Layanan Pelanggan 24/7',
        p: 'Tim support kami siap membantu kapan pun. Beri tahu kode booking untuk respons yang lebih cepat.',
      },
      {
        h: 'Jam Operasional Kantor',
        p: 'Senin - Minggu, 08.00 - 21.00 WIB.',
      },
    ],
  },
  faq: {
    title: 'Pertanyaan Umum (FAQ)',
    icon: Headset,
    sections: [
      {
        h: 'Bagaimana cara melihat pesanan saya?',
        p: 'Masuk ke akun, lalu buka menu "Pesanan Saya" di pojok kanan atas. Semua pemesanan aktif beserta status pembayarannya tampil di sana.',
      },
      {
        h: 'Apakah pembayaran bisa diangsur?',
        p: 'Tersedia opsi cicilan untuk beberapa metode pembayaran. Pilih metode favoritmu saat checkout untuk melihat opsi yang tersedia.',
      },
      {
        h: 'Bagaimana jika mencari hasil kosong?',
        p: 'Coba ubah kata kunci atau tambahkan data jadwal pada layanan terkait. Untuk evaluasi internal, contoh data (seed) dapat dimasukkan melalui API service.',
      },
    ],
  },
}

const CONTACT = [
  { icon: Mail, label: 'Email', value: 'support@travwin.id' },
  { icon: Phone, label: 'Telepon', value: '+62 21 0000 8888' },
  { icon: MapPin, label: 'Alamat', value: 'Jakarta Selatan, Indonesia' },
]

export default function Footer() {
  const [active, setActive] = useState(null)

  const open = (key) => setActive(key)
  const close = () => setActive(null)

  return (
    <footer className="relative z-10 mt-16 border-t border-white/10 bg-travel-950/80 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/30">
              <Plane size={22} className="text-white" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Trav<span className="text-travel-300">Win</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Satu tempat untuk semua kebutuhan perjalananmu: pesawat, hotel, kereta, Whoosh,
            travel shuttle, rental, hingga antar jemput bandara.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
              <ShieldCheck size={14} className="text-emerald-300" /> Aman
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
              <Headset size={14} className="text-travel-300" /> 24/7 Support
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
              <BadgePercent size={14} className="text-amber-300" /> Harga Terbaik
            </span>
          </div>
        </div>

        {/* Layanan */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Layanan</h4>
          <ul className="mt-4 space-y-2.5">
            {PRODUCTS.map((p) => (
              <li key={p.key}>
                <a
                  href="#/"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:translate-x-0.5 hover:text-white"
                >
                  <p.icon size={15} className="text-travel-300" />
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Bantuan */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Bantuan</h4>
          <ul className="mt-4 space-y-2.5">
            <li>
              <button onClick={() => open('bantuan')} className="text-sm text-white/60 transition hover:text-white">
                Pusat Bantuan & Kontak
              </button>
            </li>
            <li>
              <button onClick={() => open('faq')} className="text-sm text-white/60 transition hover:text-white">
                Pertanyaan Umum (FAQ)
              </button>
            </li>
            <li>
              <button onClick={() => open('tentang')} className="text-sm text-white/60 transition hover:text-white">
                Tentang Kami
              </button>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Legal</h4>
          <ul className="mt-4 space-y-2.5">
            <li>
              <button onClick={() => open('kebijakan')} className="text-sm text-white/60 transition hover:text-white">
                Kebijakan Privasi
              </button>
            </li>
            <li>
              <button onClick={() => open('syarat')} className="text-sm text-white/60 transition hover:text-white">
                Syarat & Ketentuan
              </button>
            </li>
            <li>
              <button onClick={() => open('tentang')} className="text-sm text-white/60 transition hover:text-white">
                Tentang TravWin
              </button>
            </li>
          </ul>

          <div className="mt-6 space-y-2">
            {CONTACT.map(({ icon: Icon, label, value }) => (
              <p key={label} className="flex items-center gap-2.5 text-xs text-white/50">
                <Icon size={14} className="text-travel-300" />
                <span>
                  {label}: <span className="text-white/70">{value}</span>
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row">
          <p className="text-xs text-white/50">
            © 2026 TravWin. Dibuat dengan <Heart size={12} className="inline text-red-400" /> untuk para traveler.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-white/60">
            <span>Indonesia</span>
            <span>·</span>
            <span>Bahasa Indonesia</span>
            <span>·</span>
            <Star size={13} className="text-amber-300" />
            <span>4.8/5</span>
          </div>
        </div>
      </div>

      <InfoModal info={active ? INFO[active] : null} contact={CONTACT} onClose={close} />
    </footer>
  )
}

function InfoModal({ info, contact, onClose }) {
  if (!info) return null
  const Icon = info.icon
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-travel-600 text-white">
              <Icon size={22} />
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">{info.title}</h3>
              <p className="text-xs text-slate-500">
                Berlaku untuk pengguna TravWin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {info.contact && (
          <div className="mb-6 space-y-2.5 rounded-2xl bg-travel-50 p-5 ring-1 ring-travel-100">
            {contact.map(({ icon: C, label, value }) => (
              <p key={label} className="flex items-center gap-3 text-sm text-slate-700">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-travel-600 shadow-sm">
                  <C size={15} />
                </span>
                <span>
                  <span className="font-semibold">{label}:</span> {value}
                </span>
              </p>
            ))}
          </div>
        )}

        <div className="space-y-5">
          {info.sections.map((s) => (
            <div key={s.h}>
              <h4 className="text-sm font-extrabold text-travel-800">{s.h}</h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.p}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}