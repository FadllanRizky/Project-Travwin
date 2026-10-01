import {
  Plane,
  Hotel,
  TrainFront,
  Zap,
  Bus,
  Car,
  Van,
} from 'lucide-react'

export const PRODUCTS = [
  {
    key: 'flights',
    label: 'Tiket Pesawat',
    icon: Plane,
    endpoint: '/api/v1/flights/search',
    fields: [
      {
        key: 'origin',
        label: 'Dari Bandara',
        type: 'select',
        options: [
          { value: '', label: 'Pilih Bandara Asal' },
          { value: 'CGK', label: 'Jakarta (CGK) - Soekarno-Hatta' },
          { value: 'KNO', label: 'Medan (KNO) - Kualanamu' },
          { value: 'BDO', label: 'Bandung (BDO) - Husein Sastranegara' },
          { value: 'DPS', label: 'Denpasar (DPS) - Ngurah Rai' },
          { value: 'SUB', label: 'Surabaya (SUB) - Juanda' },
          { value: 'YIA', label: 'Yogyakarta (YIA) - Kulon Progo' },
          { value: 'UPG', label: 'Makassar (UPG) - Hasanuddin' },
          { value: 'PLM', label: 'Palembang (PLM) - SMB II' },
        ],
      },
      {
        key: 'destination',
        label: 'Ke Bandara',
        type: 'select',
        options: [
          { value: '', label: 'Pilih Bandara Tujuan' },
          { value: 'CGK', label: 'Jakarta (CGK) - Soekarno-Hatta' },
          { value: 'KNO', label: 'Medan (KNO) - Kualanamu' },
          { value: 'BDO', label: 'Bandung (BDO) - Husein Sastranegara' },
          { value: 'DPS', label: 'Denpasar (DPS) - Ngurah Rai' },
          { value: 'SUB', label: 'Surabaya (SUB) - Juanda' },
          { value: 'YIA', label: 'Yogyakarta (YIA) - Kulon Progo' },
          { value: 'UPG', label: 'Makassar (UPG) - Hasanuddin' },
          { value: 'PLM', label: 'Palembang (PLM) - SMB II' },
        ],
      },
      { key: 'date', label: 'Tanggal Berangkat', type: 'date' },
    ],
    cardTitle: 'airlineName',
    cardSubtitle: [
      (it) => `${it?.originCity ?? '-'} (${it?.originAirportCode ?? '-'}) → ${it?.destinationCity ?? '-'} (${it?.destinationAirportCode ?? '-'})`,
    ],
    cardPrice: 'basePrice',
    cardMeta: [
      { label: 'Penerbangan', field: 'flightNumber' },
      { label: 'Pesawat', field: 'airplaneModel' },
      { label: 'Kelas', field: 'seatClass' },
      { label: 'Berangkat', field: 'departureTime' },
      { label: 'Tiba', field: 'arrivalTime' },
      { label: 'Kursi', field: 'availableSeats' },
    ],
    cardBadge: 'status',
    serviceType: 'FLIGHT',
    unit: '/ penumpang',
  },
  {
    key: 'hotels',
    label: 'Hotel',
    icon: Hotel,
    endpoint: '/api/v1/hotels/search',
    fields: [
      {
        key: 'destination',
        label: 'Destinasi Wisata',
        type: 'select',
        options: [
          { value: '', label: 'Pilih Destinasi' },
          { value: 'Ubud', label: 'Bali · Ubud' },
          { value: 'Kuta', label: 'Bali · Kuta' },
          { value: 'Labuan Bajo', label: 'Labuan Bajo · NTT' },
          { value: 'Danau Toba', label: 'Danau Toba · Sumatera Utara' },
          { value: 'Bromo', label: 'Bromo · Jawa Timur' },
          { value: 'Kuta Lombok', label: 'Lombok · Kuta, Mandalika' },
          { value: 'Bintan', label: 'Bintan · Kepulauan Riau' },
          { value: 'Raja Ampat', label: 'Raja Ampat · Papua Barat Daya' },
          { value: 'Yogyakarta', label: 'Yogyakarta' },
          { value: 'Lembang', label: 'Lembang · Bandung Barat' },
          { value: 'Belitung', label: 'Belitung · Tanjung Kelayang' },
          { value: 'Bunaken', label: 'Bunaken · Manado' },
          { value: 'Derawan', label: 'Derawan · Berau' },
          { value: 'Wakatobi', label: 'Wakatobi · Sultra' },
        ],
      },
      { key: 'checkIn', label: 'Check-in', type: 'date' },
      { key: 'checkOut', label: 'Check-out', type: 'date' },
      {
        key: 'guests',
        label: 'Jumlah Tamu',
        type: 'select',
        options: [
          { value: '1', label: '1 tamu' },
          { value: '2', label: '2 tamu' },
          { value: '3', label: '3 tamu' },
          { value: '4', label: '4 tamu' },
          { value: '5', label: '5 tamu' },
          { value: '6', label: '6 tamu' },
          { value: '7', label: '7 tamu' },
          { value: '8', label: '8 tamu' },
        ],
      },
    ],
    cardTitle: 'name',
    cardSubtitle: [
      (it) => `${it?.area ?? ''} · ${it?.city ?? ''}${it?.province ? ', ' + it.province : ''}`,
    ],
    cardPrice: 'minPricePerNight',
    cardMeta: [
      { label: 'Rating', field: 'rating' },
      { label: 'Tipe', field: 'propertyType' },
      { label: 'Kamar Tersedia', field: 'totalAvailableRooms' },
    ],
    cardBadge: null,
    serviceType: 'HOTEL',
    unit: '/ malam',
    note: 'Harga mulai dari kamar termurah per malam.',
  },
  {
    key: 'trains',
    label: 'Tiket Kereta Api',
    icon: TrainFront,
    endpoint: '/api/v1/trains/search',
    fields: [
      {
        key: 'origin',
        label: 'Dari Stasiun',
        type: 'select',
        asyncOptions: {
          url: '/api/v1/trains/stations',
          label: (s) => `${s.name} (${s.city})`,
          value: (s) => s.name,
        },
      },
      {
        key: 'destination',
        label: 'Ke Stasiun',
        type: 'select',
        asyncOptions: {
          url: '/api/v1/trains/stations',
          label: (s) => `${s.name} (${s.city})`,
          value: (s) => s.name,
        },
      },
      { key: 'date', label: 'Tanggal Berangkat', type: 'date' },
      {
        key: 'trainClass',
        label: 'Kelas Kereta',
        type: 'select',
        options: [
          { value: '', label: 'Semua Kelas' },
          { value: 'EKSEKUTIF', label: 'Eksekutif' },
          { value: 'BISNIS', label: 'Bisnis' },
          { value: 'EKONOMI', label: 'Ekonomi' },
        ],
      },
    ],
    cardTitle: 'trainName',
    cardSubtitle: [
      (it) =>
        `${it?.originStation ?? '-'} (${it?.originStationCode ?? '-'}) → ${it?.destinationStation ?? '-'} (${it?.destinationStationCode ?? '-'})`,
      (it) => `${it?.trainNumber ?? '-'} · ${it?.trainClass ?? '-'}`,
    ],
    cardPrice: 'price',
    cardMeta: [
      { label: 'Kelas', field: 'trainClass' },
      { label: 'Berangkat', field: 'departureTime' },
      { label: 'Tiba', field: 'arrivalTime' },
      { label: 'Durasi', field: 'durationMinutes', unit: ' mnt' },
      { label: 'Kursi', field: 'availableSeats' },
    ],
    cardBadge: 'status',
    serviceType: 'TRAIN',
    unit: '/ penumpang',
  },
  {
    key: 'whoosh',
    label: 'Whoosh',
    icon: Zap,
    endpoint: '/api/v1/whoosh/search',
    fields: [
      { key: 'origin', label: 'Stasiun Asal', type: 'text', placeholder: 'Halim' },
      { key: 'destination', label: 'Stasiun Tujuan', type: 'text', placeholder: 'Padalarang' },
    ],
    cardTitle: 'trainNumber',
    cardSubtitle: ['originStation', 'destinationStation'],
    cardPrice: 'price',
    cardMeta: [
      { label: 'Kelas', field: 'seatClass' },
      { label: 'Berangkat', field: 'departureTime' },
      { label: 'Tiba', field: 'arrivalTime' },
    ],
    cardBadge: 'status',
    serviceType: 'WHOOSH',
  },
  {
    key: 'travel',
    label: 'Bus & Travel',
    icon: Bus,
    endpoint: '/api/v1/travel/search',
    fields: [
      { key: 'origin', label: 'Kota Asal', type: 'text', placeholder: 'Jakarta' },
      { key: 'destination', label: 'Kota Tujuan', type: 'text', placeholder: 'Bandung' },
    ],
    cardTitle: 'operatorName',
    cardSubtitle: ['departurePoint', 'dropPoint'],
    cardPrice: 'price',
    cardMeta: [
      { label: 'Armada', field: 'vehicleType' },
      { label: 'Berangkat', field: 'departureTime' },
      { label: 'Kursi', field: 'availableSeats' },
    ],
    cardBadge: 'status',
    serviceType: 'TRAVEL',
  },
  {
    key: 'rentals',
    label: 'Rental Mobil & Motor',
    icon: Car,
    endpoint: '/api/v1/rentals/search',
    fields: [
      { key: 'city', label: 'Kota Penyewaan', type: 'text', placeholder: 'Jakarta' },
      {
        key: 'vehicleType',
        label: 'Tipe',
        type: 'select',
        options: [
          { value: '', label: 'Semua' },
          { value: 'CAR', label: 'Mobil' },
          { value: 'MOTORCYCLE', label: 'Motor' },
        ],
      },
    ],
    cardTitle: 'brandAndModel',
    cardSubtitle: ['vehicleType', 'transmission'],
    cardPrice: 'pricePerDay',
    cardMeta: [
      { label: 'Kota', field: 'city' },
      { label: 'Kapasitas', field: 'passengerCapacity' },
      { label: 'Rating', field: 'rating' },
    ],
    cardBadge: 'isAvailable',
    unit: '/ hari',
    serviceType: 'RENTAL',
  },
  {
    key: 'airport-transfers',
    label: 'Antar Jemput Bandara',
    icon: Van,
    endpoint: '/api/v1/airport-transfers/search',
    fields: [
      { key: 'airport', label: 'Bandara', type: 'text', placeholder: 'Soekarno-Hatta' },
      {
        key: 'vehicleType',
        label: 'Armada',
        type: 'select',
        options: [
          { value: '', label: 'Semua' },
          { value: 'SEDAN', label: 'Sedan' },
          { value: 'MPV', label: 'MPV' },
          { value: 'MINIVAN', label: 'Minivan' },
        ],
      },
    ],
    cardTitle: 'airportName',
    cardSubtitle: ['pickupLocation', 'dropoffLocation'],
    cardPrice: 'price',
    cardMeta: [{ label: 'Armada', field: 'vehicleType' }],
    cardBadge: 'isAvailable',
    unit: '/ armada',
    serviceType: 'AIRPORT_TRANSFER',
  },
]

export function getProduct(key) {
  return PRODUCTS.find((p) => p.key === key)
}

export const formattedOptions = {
  vehicleType: {
    CAR: 'Mobil',
    MOTORCYCLE: 'Motor',
  },
  transmission: {
    MANUAL: 'Manual',
    AUTOMATIC: 'Matic',
  },
}

export function translateBadge(productKey, value) {
  if (value === true) return { text: 'Tersedia', ok: true }
  if (value === false) return { text: 'Tidak Tersedia', ok: false }
  if (value == null) return null
  if (String(value).toUpperCase() === 'AVAILABLE') return { text: 'Tersedia', ok: true }
  if (String(value).toUpperCase() === 'DELAYED') return { text: 'Delay', ok: false }
  return { text: String(value), ok: true }
}