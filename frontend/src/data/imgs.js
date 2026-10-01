// ============================================================================
// REGISTRY GAMBAR TRAVWIN
// ----------------------------------------------------------------------------
// Kamu cukup mengisi URL gambar di bawah (gambar online https://... atau
// file lokal /img/...). Slot yang dibiarkan kosong otomatis memakai gambar
// cadangan, jadi tampilan tidak akan pernah rusak.
//
// CARA ISI UNTUK BANDARA  : tulis dengan kode bandara, contoh:  DPS: 'https://...'
// CARA ISI UNTUK HOTEL    : tulis dengan slug hotel, contoh:    'saranam-ubud': 'https://...'
//   (slug juga boleh diganti dengan NAMA hotel, mis. 'Saranam Ubud Resort')
//
// ALTERNATIF TANPA EDIT FILE:
//   Drop file ke  frontend/public/img/uploads/  dengan nama kode/slug:
//   uploads/DPS.jpg  uploads/saranam-ubud.jpg  dst. → otomatis terpakai.
// ============================================================================

export const IMAGES = {
  // --------------------------------------------------------------------------
  // H O T E L  — isi URL foto tiap hotel berdasarkan slug (daftar di bawah).
  // --------------------------------------------------------------------------
  hotels: {
    'saranam-ubud': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa75Zw0YIcree0ehsSFJTQFh56RCgH5cBXBcg56aYHPIpXxmJITbJ90q5A&s=10',
    'ublog-villa': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx0K0kw9_KinVXwBAD-_Rm4IXh9Bc5PYLCcMEXNCLtfj2JE7BFofJ7164&s=10',
    'legian-sunset-inn': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKwFZ67U8k-FzDreimmmfNfhinbm-gVlC4OWMl3ghNp_jZIfaoUMWNX-I&s=10',
    'kuta-paradiso-hotel': 'https://kutaparadisohotel.com/wp-content/uploads/2025/02/IMG_0933-scaled.jpg',
    'komodo-seaview': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/918075561.jpg?k=c4870a94d35789df2f6669f3945192ead4d8e7cbc43c805abab4efb47726766f&o=',
    'flores-sunset-cottage': 'https://media.craiyon.com/2025-04-07/YCqYrZDeTIGykFyuN4g4jw.webp',
    'taman-simalem-resort': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/9e/0c/0a/tongging-point-hotel.jpg?w=900&h=-1&s=1',
    'samosir-lakehouse': 'https://media.tripcanvas.co/id/sites/2/2018/12/lake-toba-hotels-lakeview-feature.jpg',
    'cemara-indah-bromo': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/4f/5c/5a/cemara-indah-hotel.jpg?w=500&h=-1&s=1',
    'lava-view-bromo': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/f0/de/55/20181003-162116-largejpg.jpg?w=900&h=500&s=1',
    'kila-senggigi-villa': 'https://media-cdn.tripadvisor.com/media/photo-s/07/91/28/a6/kila-senggigi-beach-lombok.jpg',
    'gili-green-bungalow': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/702732983.jpg?k=7330816e63cd538e502123eb6f350ea981f7bf8c114ed7c29f8366ef3887b3b0&o=',
    'bintan-trikora-lodge': 'https://images.trvl-media.com/lodging/80000000/79340000/79332900/79332832/6a73027a.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill',
    'the-sebong-waterfall': 'https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/t_htl-dskt/tix-hotel/images-web/2026/02/26/0d15be44-f3a5-425a-858f-da13980a05e5-1772067072026-074083168a172c50f85e90ee1c64f440.jpg',
    'amber-raj-ampat': 'https://i0.wp.com/jnewsonline.com/wp-content/uploads/2023/10/penginapan-di-raja-ampat-2.jpg?resize=1000%2C600&ssl=1',
    'yenggari-kri-stay': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdC5H1oddxWjoaBd2YlL090jM8xoCuLNyrR0YKWIYwFLQbp0lRV373zBeK&s=10',
    'malioboro-heritage': 'https://tamansariroyalheritagespa.com/wp-content/uploads/2018/07/t1.jpg',
    'voidland-garden': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/427286323.jpg?k=0c109de22e1e80f7228ef3ccd113ac842042e1c24dae0d236704593048772892&o=',
    'floating-market-lembang': 'https://asset.kompas.com/crops/qQOI61Q3ivsWPxUj4_Jv6HhkKEM=/19x0:775x504/1200x800/data/photo/2019/10/15/5da57133d3be7.jpg',
    'kota-bunga-villa': 'https://pix10.agoda.net/hotelImages/162/1620622/1620622_17011319470050311112.jpg?ca=6&ce=1&s=1024x768',
    'kelayang-villa': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZSJK3_H5kdV-1-wxUGnA47y-K3Shr5OpE4w2gs1udc6vqprlkCjvgnEJq&s=10',
    'ili-mara-boutique': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb2Il4V9JWJuF3Ljh0Nq_iiYT7s41S0eAulOa1iH-6hfu-_MxdHSuKOzQ&s=10',
    'bunaken-dive-stay': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjZ2zuAcUm8sLPp-XTbLQidDRiTbQXNL4EgKkFgL4Iqx9WKxvs7ci_M7en&s=10',
    'fleur-de-la-mer': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-xkoG2kNF9AF_wsMTIqwBn9klpPl2xsGPIV0aixeO3jV4O3ec8U6gc9z-&s=10',
    'derawan-sunset': 'https://i.pinimg.com/736x/f4/d5/a5/f4d5a556fc4e9ed70f8f2bf288d33008.jpg',
    'nunukan-marina': 'https://img.cnt.traveloka.com/tvlk/apr-asset/Ixf4aptF5N2Qdfmh4fGGYhTN274kJXuNMkUAzpL5HuD9jzSxIGG5kZNhhHY-p7nw/hotel/asset/20067706-5c556fe4725cf6a5bd677f5d1718e32f.jpeg?tr=q-80,c-at_max,w-740,h-500&_src=imagekit',
    'wangi-marina-inn': 'https://img.cnt.traveloka.com/tvlk/apr-asset/dgXfoyh24ryQLRcGq00cIdKHRmotrWLNlvG-TxlcLxGkiDwaUSggleJNPRgIHCX6/hotel/asset/20045169-d113d643bd71e59e6a1223cdef549a84.jpeg?tr=q-80,c-at_max,w-740,h-500&_src=imagekit',
    'wana-wakatobi-resort': 'https://media-cdn.tripadvisor.com/media/photo-s/29/c9/a4/ad/sunset-at-wakatobi-resort.jpg',
  },

  // --------------------------------------------------------------------------
  // B A N D A R A  — isi URL foto tiap bandara berdasarkan kode.
  // --------------------------------------------------------------------------
  airports: {
    CGK: 'https://awsimages.detik.net.id/community/media/visual/2019/02/11/732ed6c2-6f68-42e4-87fe-992e6b31693c_169.jpeg?w=600&q=90', // Jakarta - Soekarno-Hatta
    KNO: 'https://asset.kompas.com/crops/OzZ5Z2PUGN5VqeK_ZQq800UcEQA=/67x86:867x619/1200x800/data/photo/2023/01/18/63c7f0633d948.jpg', // Medan - Kualanamu
    BDO: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZW_A2z78ybb9FMoUC6yaM318j5PPdb4AcsC3Em7YLeY2jhUHGdr5FFxqp&s=10', // Bandung - Husein Sastranegara
    DPS: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Ngurah_Rai_Internasional_Airport_Welcome_Sign.jpg?utm_source=id.wikipedia.org&utm_campaign=index&utm_content=original', // Denpasar - Ngurah Rai
    SUB: 'https://hubud.kemenhub.go.id/assets/file/bandara/4c9500dec0f9240953e07a5679031aa9.jpg', // Surabaya - Juanda
    YIA: 'https://asset.kompas.com/crops/SHE6_EB-tFsn6fUkF9cbtLuFpzQ=/0x270:1077x988/1200x800/data/photo/2023/01/12/63bef660f26c2.jpg', // Yogyakarta - Kulon Progo
    UPG: 'https://www.marketeers.com/_next/image/?url=https%3A%2F%2Froom.marketeers.com%2Fwp-content%2Fuploads%2F2016%2F06%2FpeM7xG_sultan20hasanuddin.jpg&w=1920&q=75', // Makassar - Hasanuddin
    PLM: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/SMB2IA.jpg?utm_source=id.wikipedia.org&utm_campaign=index&utm_content=original', // Palembang - SMB II
  },

  // Fallback otomatis per tipe pemandangan (file lokal yang sudah dibundel).
  scenes: {
    beach: ['/img/beach-a.jpg', '/img/beach-b.jpg'],
    island: ['/img/island-a.jpg', '/img/island-b.jpg'],
    mountain: ['/img/mountain-a.jpg', '/img/mountain-b.jpg'],
    city: ['/img/city-a.jpg', '/img/city-b.jpg'],
    default: ['/img/beach-a.jpg'],
  },

  // Gambar hero halaman pesawat bila tidak ada foto bandara yang diisi.
  flightHero: '/img/flight-hero.jpg',
}

export const flightHero = IMAGES.flightHero

// Format nama file pada folder uploads (frontend/public/img/uploads/).
const uploadPath = (key) => `/img/uploads/${key}.jpg`

// Mencocokkan nama hotel ke key yang diisi user (case-insensitive).
function hotelKeyMatch(map, name) {
  if (!name) return null
  const n = String(name).trim().toLowerCase()
  for (const key of Object.keys(map)) {
    if (String(key).trim().toLowerCase() === n) return key
  }
  return null
}

function variantIndex(seed) {
  let h = 0
  if (seed) {
    for (let i = 0; i < seed.length; i += 1) {
      h = (h * 31 + seed.charCodeAt(i)) >>> 0
    }
  }
  return h & 1
}

// Resolver generik: cek registry → folder uploads → fallback. Dipakai juga
// oleh service lain nanti (trains, travel, rentals, transfer).
export function resolveImage(category, key, fallbacks) {
  const map = IMAGES[category]
  if (map && typeof map === 'object') {
    const direct = map[key]
    if (direct) return direct
    const matched = category === 'hotels' ? hotelKeyMatch(map, key) : null
    const match = map[matched]
    if (match) return match
  }
  if (key) return uploadPath(key)
  return fallbacks
}

// Fallback otomatis per scene untuk hotel (file lokal yang sudah dibundel).
export function hotelImageFallback(hotel) {
  const scenePool =
    (IMAGES.scenes && IMAGES.scenes[hotel?.sceneType]) || IMAGES.scenes.default
  return scenePool[variantIndex(hotel?.slug || hotel?.name) % scenePool.length]
}

// Foto tampilan hotel: isi config (slug/nama) → folder uploads → scene → default.
export function hotelImage(hotel) {
  return resolveImage('hotels', hotel?.slug || hotel?.name, hotelImageFallback(hotel))
}

// Foto bandara: isi config → folder uploads → null (SmartImage memakai placeholder).
export function airportImage(code) {
  return resolveImage('airports', code, null)
}

// Foto hero rute pesawat: foto bandara tujuan → bandara asal → hero bawaan.
export function flightHeroImage(origin, destination) {
  return airportImage(destination) || airportImage(origin) || IMAGES.flightHero
}