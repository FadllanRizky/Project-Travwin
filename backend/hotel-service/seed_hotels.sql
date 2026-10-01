-- Seed data untuk hotel-service (mcr_hotel_service)
-- Destinasi wisata lokal Indonesia + properti + tipe kamar.
-- Aman dijalankan ulang (ON CONFLICT DO NOTHING).

-- ============ HOTELS ============
INSERT INTO hotels
  (slug, name, description, address, city, province, area, property_type, rating, review_count, facilities, palette, scene_type, popularity)
VALUES
  -- Bali · Ubud
  ('saranam-ubud', 'Saranam Ubud Resort', 'Resort tepi sungai di tengah sawah Ubud dengan nuansa bali tradisional.', 'Jl. Raya Sanggingan, Campuhan', 'Gianyar', 'Bali', 'Ubud', 'RESORT', 4.8, 812, 'Pool, Spa, Restoran, Yoga, WiFi', 'emerald', 'mountain', 95),
  ('ublog-villa', 'Ublog Boutique Villa', 'Villa butik dikelilingi pepohonan dengan kolam pribadi di Ubud.', 'Banjar Kumbuh, Mas', 'Gianyar', 'Bali', 'Ubud', 'VILLA', 4.9, 341, 'Kolam Pribadi, Sarapan, WiFi, Shuttle', 'jungle', 'mountain', 88),

  -- Bali · Kuta
  ('legian-sunset-inn', 'Legian Sunset Inn', 'Penginapan nyaman 5 menit dari Pantai Legian, cocok untuk keluarga.', 'Jl. Legian No. 88', 'Badung', 'Bali', 'Kuta', 'INN', 4.4, 1203, 'Sarapan, AC, WiFi, Parkir', 'sunset', 'beach', 75),
  ('kuta-paradiso-hotel', 'Kuta Paradiso Hotel', 'Hotel bintang 4 dekat pantai dengan kolam renang luas.', 'Jl. Kartika Plaza', 'Badung', 'Bali', 'Kuta', 'HOTEL', 4.6, 2100, 'Pool, Gym, Restoran, Beach Club, WiFi', 'sunset', 'beach', 90),

  -- Labuan Bajo
  ('komodo-seaview', 'Komodo Seaview Boutique', 'Boutique hotel menghadap Laut Flores, batu loncatan ke Taman Komodo.', 'Jl. Soekarno Hatta, Labuan Bajo', 'Manggarai Barat', 'Nusa Tenggara Timur', 'Labuan Bajo', 'BOUTIQUE_HOTEL', 4.7, 654, 'Sea View, Sarapan, Diving Center, WiFi', 'ocean', 'island', 92),
  ('flores-sunset-cottage', 'Flores Sunset Cottage', 'Cottage tepi bukit dengan pemandangan sunset Pulau Komodo.', 'Air Bakung', 'Manggarai Barat', 'Nusa Tenggara Timur', 'Labuan Bajo', 'LODGE', 4.5, 288, 'Sunset View, Sarapan, Snorkeling, WiFi', 'ocean', 'island', 84),

  -- Danau Toba
  ('taman-simalem-resort', 'Taman Simalem Resort', 'Resort pegunungan di atas Danau Toba dengan udara sejuk Bukit Tinggi.', 'Merek, Karo', 'Karo', 'Sumatera Utara', 'Danau Toba', 'RESORT', 4.6, 976, 'Golf, Horse Riding, Restoran, WiFi', 'lake', 'mountain', 80),
  ('samosir-lakehouse', 'Samosir Lakehouse', 'Penginapan tepi danau di Pulau Samosir dengan danau di depan mata.', 'Tuk Tuk, Samosir', 'Samosir', 'Sumatera Utara', 'Danau Toba', 'INN', 4.3, 452, 'Sarapan, Sewa Motor, Perapian, WiFi', 'lake', 'beach', 72),

  -- Bromo
  ('cemara-indah-bromo', 'Cemara Indah Hotel Bromo', 'Hotel hangat di Cemoro Lawang, jalur menuju sunrise Gunung Bromo.', 'Cemoro Lawang, Ngadisari', 'Probolinggo', 'Jawa Timur', 'Bromo', 'INN', 4.2, 1890, 'Sarapan, Pemandu Sunrise, WiFi', 'dawn', 'mountain', 78),
  ('lava-view-bromo', 'Lava View Lodge', 'Lodge dengan teras langsung menghadap Lautan Pasir Bromo.', 'Jl. Raya Bromo, Wonokitri', 'Pasuruan', 'Jawa Timur', 'Bromo', 'LODGE', 4.4, 766, 'Mountain View, Sarapan, Jeep Tour, WiFi', 'dawn', 'mountain', 82),

  -- Lombok · Kuta
  ('kila-senggigi-villa', 'Kila Senggigi Villa', 'Villa eksklusif dengan akses swift ke pantai Kuta Lombok.', 'Jl. Raya Kuta, Kuta Lombok', 'Lombok Tengah', 'Nusa Tenggara Barat', 'Kuta Lombok', 'VILLA', 4.5, 389, 'Kolam Pribadi, Sarapan, WiFi, Shuttle Pantai', 'teal', 'beach', 79),
  ('gili-green-bungalow', 'Gili Green Bungalow', 'Bungalow asri dekat ekonomi pantai dengan vibe santai Lombok.', 'Mandalika, Kuta', 'Lombok Tengah', 'Nusa Tenggara Barat', 'Kuta Lombok', 'LODGE', 4.2, 577, 'Sarapan, Sewa Sepeda, WiFi', 'teal', 'beach', 68),

  -- Bintan
  ('bintan-trikora-lodge', 'Bintan Trikora Beach Lodge', 'Pantai Trikora yang tenang, pasir putih dan air toska.', 'Pantai Trikora, Teluk Sebong', 'Bintan', 'Kepulauan Riau', 'Bintan', 'LODGE', 4.4, 320, 'Pantai, Kayak, Sarapan, WiFi', 'coral', 'beach', 74),
  ('the-sebong-waterfall', 'The Sebong Waterfall Villa', 'Villa alam di utara Bintan dekat air terjun dan mangrove.', 'Jl. Lintas Utara Bintan', 'Bintan', 'Kepulauan Riau', 'Bintan', 'VILLA', 4.3, 198, 'Kolam, Sarapan, Mangrove Tour, WiFi', 'coral', 'beach', 70),

  -- Raja Ampat
  ('amber-raj-ampat', 'Amber Exclusive Homestay', 'Homestay di Pulau Waigeo, snorkeling di Dermaga Amber langsung.', 'Kampung Sawinggrai, Waigeo', 'Raja Ampat', 'Papua Barat Daya', 'Raja Ampat', 'HOMESTAY', 4.9, 214, 'Snorkeling, Diving, Makanan Laut, WiFi', 'lagoon', 'island', 96),
  ('yenggari-kri-stay', 'Yenggari Kri Island Stay', 'Bungalow di Kri, kawasan penyelaman kelas dunia.', 'Pulau Kri, Kepulauan Raja Ampat', 'Raja Ampat', 'Papua Barat Daya', 'Raja Ampat', 'HOMESTAY', 4.8, 156, 'Diving Center, Snorkeling, Meja Makan, WiFi', 'lagoon', 'island', 91),

  -- Yogyakarta
  ('malioboro-heritage', 'Malioboro Heritage Inn', 'Penginapan bergaya heritage 5 menit dari Malioboro.', 'Jl. Sosrowijayan No. 12', 'Yogyakarta', 'DI Yogyakarta', 'Yogyakarta', 'INN', 4.3, 1450, 'Sarapan, AC, WiFi, Ruang Rapat', 'brick', 'city', 81),
  ('voidland-garden', 'The Garden Budaya Hotel', 'Hotel bernuansa seni di kawasan Prawirotaman.', 'Jl. Prawirotaman MG III', 'Yogyakarta', 'DI Yogyakarta', 'Yogyakarta', 'HOTEL', 4.5, 802, 'Kolam, Restoran, Galeri Seni, WiFi', 'brick', 'city', 85),

  -- Lembang
  ('floating-market-lembang', 'Floating Market Resort Lembang', 'Resort sejuk dengan pemandangan bukit dan kebun teh Lembang.', 'Jl. Raya Tangkuban Perahu', 'Bandung Barat', 'Jawa Barat', 'Lembang', 'RESORT', 4.4, 1150, 'Kolam, Sarapan, Spot Foto, WiFi', 'pines', 'mountain', 77),
  ('kota-bunga-villa', 'Kota Bunga Garden Villa', 'Villa taman bunga di kawasan Kota Bunga, Cipanas Lembang.', 'Jl. Raya KPC, Cipanas', 'Bandung Barat', 'Jawa Barat', 'Lembang', 'VILLA', 4.6, 634, 'Taman Bunga, Kolam, BBQ, WiFi', 'pines', 'mountain', 83),

  -- Belitung
  ('kelayang-villa', 'Tanjung Kelayang Villa', 'Villa menghadap formasi granit Tanjung Kelayang.', 'Tanjung Kelayang, Sijuk', 'Belitung', 'Kepulauan Bangka Belitung', 'Belitung', 'VILLA', 4.5, 276, 'Pantai, Restoran Laut, Kayak, WiFi', 'sand', 'beach', 76),
  ('ili-mara-boutique', 'Ili Mara Boutique Hotel', 'Boutique hotel di tengah kota Tanjungpandan.', 'Jl. Jend. Sudirman', 'Belitung', 'Kepulauan Bangka Belitung', 'Belitung', 'BOUTIQUE_HOTEL', 4.4, 410, 'Sarapan, Kolam, WiFi', 'sand', 'beach', 69),

  -- Bunaken
  ('bunaken-dive-stay', 'Bunaken Dive & Stay', 'Resort penyelaman di depan Taman Laut Bunaken.', 'Pulau Bunaken', 'Manado', 'Sulawesi Utara', 'Bunaken', 'RESORT', 4.6, 388, 'Diving, Snorkeling, Restoran, WiFi', 'coral', 'beach', 87),
  ('fleur-de-la-mer', 'Fleur de la Mer Resort', 'Resort pantai di Malalayang dengan pemandangan pulau.', 'Jl. Wolter Monginsidi, Malalayang', 'Manado', 'Sulawesi Utara', 'Bunaken', 'RESORT', 4.5, 244, 'Pantai, Kolam, Restoran, Spa, WiFi', 'coral', 'beach', 78),

  -- Derawan
  ('derawan-sunset', 'Derawan Sunset Homestay', 'Homestay di Pulau Derawan, ubur-ubur danau & penyu.', 'Pulau Derawan, Kepulauan Derawan', 'Berau', 'Kalimantan Timur', 'Derawan', 'HOMESTAY', 4.6, 321, 'Makanan Laut, Snorkeling, Sewa Perahu, WiFi', 'green', 'island', 86),
  ('nunukan-marina', 'Maratua Atoll Dive Lodge', 'Lodge di atol Maratua, spot diving kelas dunia.', 'Pulau Maratua', 'Berau', 'Kalimantan Timur', 'Derawan', 'LODGE', 4.7, 172, 'Diving, Snorkeling, Makanan Laut, WiFi', 'green', 'island', 89),

  -- Wakatobi
  ('wangi-marina-inn', 'Wangi-Wangi Marina Inn', 'Penginapan ramah di Wakatobi, gerbang ke taman laut.', 'Wangi-Wangi, Kapota', 'Wakatobi', 'Sulawesi Tenggara', 'Wakatobi', 'INN', 4.2, 198, 'Sarapan, Snorkeling, WiFi', 'aqua', 'island', 64),
  ('wana-wakatobi-resort', 'Wana Wakatobi Resort', 'Resort all-inclusive dengan house reef menakjubkan.', 'Tomia, Wakatobi', 'Wakatobi', 'Sulawesi Tenggara', 'Wakatobi', 'RESORT', 4.7, 267, 'Diving Unlimited, Restoran, Spa, WiFi', 'aqua', 'island', 90)
ON CONFLICT (slug) DO NOTHING;

-- ============ ROOM TYPES ============
-- Ubud
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Deluxe Garden', 'STANDARD', 'King', 2, 30, 8, 8, 950000, 'AC, TV, WiFi, Minibar, Bidet Danau'
FROM hotels WHERE slug = 'saranam-ubud'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Suite River View', 'SUITE', 'King', 3, 52, 3, 3, 1900000, 'AC, TV, Jacuzzi, WiFi, Balkon Sungai'
FROM hotels WHERE slug = 'saranam-ubud'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Room with Private Pool', 'SUPERIOR', 'Queen', 2, 38, 5, 5, 1450000, 'AC, Kolam Pribadi, Sarapan, WiFi'
FROM hotels WHERE slug = 'ublog-villa'
ON CONFLICT (hotel_id, name) DO NOTHING;

-- Kuta
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Standard Room', 'STANDARD', 'Twin', 2, 22, 12, 12, 580000, 'AC, TV, WiFi, Bidikan Pantai'
FROM hotels WHERE slug = 'legian-sunset-inn'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Deluxe Pool View', 'DELUXE', 'Queen', 2, 28, 6, 6, 850000, 'AC, TV, WiFi, Kolam Renang, Sarapan'
FROM hotels WHERE slug = 'legian-sunset-inn'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Family Room', 'FAMILY', '2 Double', 5, 42, 4, 4, 1150000, 'AC, TV, WiFi, Playground, Sarapan 4'
FROM hotels WHERE slug = 'legian-sunset-inn'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Deluxe Sea View', 'DELUXE', 'King', 2, 33, 10, 10, 1250000, 'AC, TV, WiFi, Sarapan, Balkon Laut'
FROM hotels WHERE slug = 'kuta-paradiso-hotel'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Executive Suite', 'SUITE', 'King', 3, 60, 5, 5, 2200000, 'AC, TV, Lounge Access, WiFi, Balkon Ocean'
FROM hotels WHERE slug = 'kuta-paradiso-hotel'
ON CONFLICT (hotel_id, name) DO NOTHING;

-- Labuan Bajo
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Standard Harbour', 'STANDARD', 'Queen', 2, 26, 8, 8, 1450000, 'AC, TV, WiFi, Sarapan, Pemandangan Pelabuhan'
FROM hotels WHERE slug = 'komodo-seaview'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Deluxe Ocean', 'DELUXE', 'King', 2, 34, 6, 6, 1950000, 'AC, TV, WiFi, Sarapan, Balkon Laut Flores'
FROM hotels WHERE slug = 'komodo-seaview'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Suite Cliff', 'SUITE', 'King', 3, 48, 3, 3, 2850000, 'AC, TV, Jacuzzi, WiFi, Sunset View'
FROM hotels WHERE slug = 'komodo-seaview'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Hillside Bungalow', 'SUPERIOR', 'Queen', 2, 30, 7, 7, 1250000, 'AC, WiFi, Sarapan, Hammock'
FROM hotels WHERE slug = 'flores-sunset-cottage'
ON CONFLICT (hotel_id, name) DO NOTHING;

-- Danau Toba
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Standard Lake View', 'STANDARD', 'Double', 2, 24, 10, 10, 750000, 'AC, TV, WiFi, Sarapan, Danau View'
FROM hotels WHERE slug = 'taman-simalem-resort'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Deluxe Chalet', 'DELUXE', 'King', 2, 36, 6, 6, 1150000, 'AC, TV, Fireplace, WiFi, Balkon'
FROM hotels WHERE slug = 'taman-simalem-resort'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Lakeside Room', 'STANDARD', 'Twin', 2, 22, 9, 9, 650000, 'Sarapan, WiFi, Danau Depan'
FROM hotels WHERE slug = 'samosir-lakehouse'
ON CONFLICT (hotel_id, name) DO NOTHING;

-- Bromo
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Standard Room', 'STANDARD', 'Twin', 2, 20, 15, 15, 700000, 'Sarapan, Heater, WiFi, Pemanas Air'
FROM hotels WHERE slug = 'cemara-indah-bromo'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Deluxe Mountain View', 'DELUXE', 'Queen', 2, 28, 7, 7, 950000, 'Sarapan, Heater, TV, WiFi, Gunung View'
FROM hotels WHERE slug = 'cemara-indah-bromo'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Family Cabin', 'FAMILY', 'Double + Twin', 4, 40, 5, 5, 1200000, 'Sarapan, Heater, TV, WiFi, Sea of Sand'
FROM hotels WHERE slug = 'cemara-indah-bromo'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Panorama Lodge', 'SUPERIOR', 'King', 2, 32, 6, 6, 1050000, 'Sarapan, Fireplace, WiFi, Sunrise Teras'
FROM hotels WHERE slug = 'lava-view-bromo'
ON CONFLICT (hotel_id, name) DO NOTHING;

-- Lombok · Kuta
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Superior Garden', 'SUPERIOR', 'Queen', 2, 30, 6, 6, 900000, 'AC, TV, WiFi, Sarapan, Taman'
FROM hotels WHERE slug = 'kila-senggigi-villa'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Suite Pool Access', 'SUITE', 'King', 3, 45, 4, 4, 1650000, 'AC, TV, WiFi, Akses Kolam, Sarapan'
FROM hotels WHERE slug = 'kila-senggigi-villa'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Bungalow', 'STANDARD', 'Queen', 2, 24, 8, 8, 600000, 'Sarapan, WiFi, Hammock, Sewa Sepeda'
FROM hotels WHERE slug = 'gili-green-bungalow'
ON CONFLICT (hotel_id, name) DO NOTHING;

-- Bintan
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Beachfront Cottage', 'SUPERIOR', 'King', 2, 35, 6, 6, 1250000, 'AC, TV, WiFi, Kayak, Pantai'
FROM hotels WHERE slug = 'bintan-trikora-lodge'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Deluxe Garden', 'DELUXE', 'Queen', 2, 28, 8, 8, 820000, 'AC, TV, WiFi, Sarapan'
FROM hotels WHERE slug = 'bintan-trikora-lodge'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Villa Waterfall', 'SUITE', 'King', 3, 50, 3, 3, 1850000, 'AC, Kolam, TV, WiFi, Sarapan'
FROM hotels WHERE slug = 'the-sebong-waterfall'
ON CONFLICT (hotel_id, name) DO NOTHING;

-- Raja Ampat
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Standard Bungalow', 'STANDARD', 'Queen', 2, 20, 6, 6, 1150000, 'All Meals, Snorkeling, WiFi, Dermaga'
FROM hotels WHERE slug = 'amber-raj-ampat'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Waterfront Suite', 'SUITE', 'King', 3, 36, 2, 2, 2250000, 'All Meals, Snorkeling, Dermaga Pribadi, WiFi'
FROM hotels WHERE slug = 'amber-raj-ampat'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Kri Island Bungalow', 'STANDARD', 'Twin', 2, 22, 5, 5, 1450000, 'All Meals, Diving, Snorkeling, WiFi'
FROM hotels WHERE slug = 'yenggari-kri-stay'
ON CONFLICT (hotel_id, name) DO NOTHING;

-- Yogyakarta
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Standard Room', 'STANDARD', 'Twin', 2, 20, 14, 14, 550000, 'AC, TV, WiFi, Sarapan, Bidikan Malioboro'
FROM hotels WHERE slug = 'malioboro-heritage'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Deluxe Room', 'DELUXE', 'Queen', 2, 27, 8, 8, 750000, 'AC, TV, WiFi, Sarapan, Minibar'
FROM hotels WHERE slug = 'malioboro-heritage'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Ensuite Heritage Suite', 'SUITE', 'King', 3, 45, 4, 4, 1050000, 'AC, TV, WiFi, Sarapan, Ruang Tamu'
FROM hotels WHERE slug = 'malioboro-heritage'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Garden View', 'SUPERIOR', 'Queen', 2, 30, 10, 10, 850000, 'AC, TV, WiFi, Kolam, Sarapan, Galeri Seni'
FROM hotels WHERE slug = 'voidland-garden'
ON CONFLICT (hotel_id, name) DO NOTHING;

-- Lembang
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Garden Room', 'STANDARD', 'Twin', 2, 24, 12, 12, 650000, 'AC, TV, WiFi, Kolam, Sarapan, Kebun Teh'
FROM hotels WHERE slug = 'floating-market-lembang'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Deluxe Mountain View', 'DELUXE', 'Queen', 2, 32, 8, 8, 900000, 'AC, TV, WiFi, Balkon, Sarapan, Bukit'
FROM hotels WHERE slug = 'floating-market-lembang'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Villa Taman Bunga', 'FAMILY', '2 Double', 5, 60, 3, 3, 1600000, 'AC, TV, WiFi, BBQ, Kolam, Kebun Bunga'
FROM hotels WHERE slug = 'kota-bunga-villa'
ON CONFLICT (hotel_id, name) DO NOTHING;

-- Belitung
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Standard Room', 'STANDARD', 'Queen', 2, 24, 8, 8, 700000, 'AC, TV, WiFi, Sarapan, Bidikan Granit'
FROM hotels WHERE slug = 'kelayang-villa'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Deluxe Beachfront', 'DELUXE', 'King', 2, 36, 5, 5, 1050000, 'AC, TV, WiFi, Kayak, Sarapan, Pantai'
FROM hotels WHERE slug = 'kelayang-villa'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'City Deluxe', 'DELUXE', 'Queen', 2, 28, 9, 9, 780000, 'AC, TV, WiFi, Kolam, Sarapan'
FROM hotels WHERE slug = 'ili-mara-boutique'
ON CONFLICT (hotel_id, name) DO NOTHING;

-- Bunaken
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Standard Room', 'STANDARD', 'Twin', 2, 22, 8, 8, 850000, 'All Meals, Diving Gear, WiFi, Reef View'
FROM hotels WHERE slug = 'bunaken-dive-stay'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Sea View Bungalow', 'SUPERIOR', 'Queen', 2, 30, 5, 5, 1300000, 'All Meals, Balkon Laut, WiFi, Snorkeling'
FROM hotels WHERE slug = 'bunaken-dive-stay'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Garden Deluxe', 'DELUXE', 'King', 2, 34, 7, 7, 1100000, 'AC, TV, WiFi, Kolam, Sarapan, Pantai'
FROM hotels WHERE slug = 'fleur-de-la-mer'
ON CONFLICT (hotel_id, name) DO NOTHING;

-- Derawan
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Standard Room', 'STANDARD', 'Twin', 2, 20, 6, 6, 600000, 'Makanan Laut, Snorkeling, WiFi'
FROM hotels WHERE slug = 'derawan-sunset'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Water Bungalow', 'SUPERIOR', 'Queen', 2, 32, 3, 3, 1400000, 'Makanan Laut, Dermaga, Sunbed, WiFi, Nudibranch'
FROM hotels WHERE slug = 'derawan-sunset'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Overwater Lodge', 'SUITE', 'King', 3, 40, 4, 4, 1750000, 'All Meals, Diving, WiFi, Overwater Deck'
FROM hotels WHERE slug = 'nunukan-marina'
ON CONFLICT (hotel_id, name) DO NOTHING;

-- Wakatobi
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Standard Room', 'STANDARD', 'Twin', 2, 22, 8, 8, 650000, 'Sarapan, Snorkeling, WiFi, Sea Breeze'
FROM hotels WHERE slug = 'wangi-marina-inn'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'Deluxe Sea Room', 'DELUXE', 'Queen', 2, 30, 5, 5, 1000000, 'Sarapan, Balkon Laut, WiFi'
FROM hotels WHERE slug = 'wangi-marina-inn'
ON CONFLICT (hotel_id, name) DO NOTHING;
INSERT INTO room_types (hotel_id, name, category, bed_type, max_guests, size_sqm, room_count, available_rooms, base_price_per_night, amenities)
SELECT id, 'House Reef Suite', 'SUITE', 'King', 3, 46, 3, 3, 2100000, 'All Meals, Unlimited Diving, WiFi, House Reef'
FROM hotels WHERE slug = 'wana-wakatobi-resort'
ON CONFLICT (hotel_id, name) DO NOTHING;