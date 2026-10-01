-- Seed data untuk kereta-service (mcr_kereta_service)
-- KA Lokal/Komuter (KRL & KA Lokal regional) + KA Antarkota di Pulau Jawa.
-- Aman dijalankan ulang (ON CONFLICT DO NOTHING).

-- Buang satu-satunya baris contoh bawaan awal agar skema baru bersih.
DELETE FROM train_schedules WHERE train_number = 'KA 7' AND departure_time = '2026-10-01 08:00:00' AND origin_station = 'Gambir';

-- ============ STASIUN ============
INSERT INTO train_stations (code, name, city, province, region) VALUES
  ('JAKK', 'Jakarta Kota', 'Jakarta', 'DKI Jakarta', 'Jabodetabek'),
  ('KPB', 'Kampung Bandan', 'Jakarta', 'DKI Jakarta', 'Jabodetabek'),
  ('JNG', 'Jatinegara', 'Jakarta', 'DKI Jakarta', 'Jabodetabek'),
  ('GMR', 'Gambir', 'Jakarta', 'DKI Jakarta', 'Antarkota'),
  ('PSE', 'Pasar Senen', 'Jakarta', 'DKI Jakarta', 'Antarkota'),
  ('DRI', 'Duri', 'Jakarta', 'DKI Jakarta', 'Jabodetabek'),
  ('THB', 'Tanah Abang', 'Jakarta', 'DKI Jakarta', 'Jabodetabek'),
  ('BKS', 'Bekasi', 'Kota Bekasi', 'Jawa Barat', 'Jabodetabek'),
  ('TB', 'Tambun', 'Bekasi', 'Jawa Barat', 'Jabodetabek'),
  ('CKR', 'Cikarang', 'Bekasi', 'Jawa Barat', 'Jabodetabek'),
  ('BOO', 'Bogor', 'Kota Bogor', 'Jawa Barat', 'Jabodetabek'),
  ('CTM', 'Citayam', 'Depok', 'Jawa Barat', 'Jabodetabek'),
  ('DPO', 'Depok', 'Kota Depok', 'Jawa Barat', 'Jabodetabek'),
  ('TNG', 'Tangerang', 'Kota Tangerang', 'Banten', 'Jabodetabek'),
  ('RK', 'Rangkasbitung', 'Lebak', 'Banten', 'Jabodetabek'),
  ('MER', 'Merak', 'Cilegon', 'Banten', 'Merak'),
  ('PDL', 'Padalarang', 'Bandung Barat', 'Jawa Barat', 'Bandung Raya'),
  ('CMI', 'Cimahi', 'Kota Cimahi', 'Jawa Barat', 'Bandung Raya'),
  ('BD', 'Bandung Hall', 'Kota Bandung', 'Jawa Barat', 'Bandung Raya'),
  ('KAC', 'Kiaracondong', 'Kota Bandung', 'Jawa Barat', 'Bandung Raya'),
  ('CCL', 'Cicalengka', 'Bandung', 'Jawa Barat', 'Bandung Raya'),
  ('CN', 'Cirebon', 'Kota Cirebon', 'Jawa Barat', 'Antarkota'),
  ('TSM', 'Tasikmalaya', 'Kota Tasikmalaya', 'Jawa Barat', 'Antarkota'),
  ('PWT', 'Purwokerto', 'Banyumas', 'Jawa Tengah', 'Antarkota'),
  ('KTA', 'Kutoarjo', 'Purworejo', 'Jawa Tengah', 'Antarkota'),
  ('YK', 'Yogyakarta', 'Kota Yogyakarta', 'DI Yogyakarta', 'Antarkota'),
  ('LPN', 'Lempuyangan', 'Kota Yogyakarta', 'DI Yogyakarta', 'Solo-Yogya'),
  ('SLO', 'Solo Balapan', 'Surakarta', 'Jawa Tengah', 'Antarkota'),
  ('SMT', 'Semarang Tawang', 'Kota Semarang', 'Jawa Tengah', 'Antarkota'),
  ('PK', 'Pekalongan', 'Kota Pekalongan', 'Jawa Tengah', 'Antarkota'),
  ('SGU', 'Surabaya Gubeng', 'Surabaya', 'Jawa Timur', 'Antarkota'),
  ('SBI', 'Surabaya Pasar Turi', 'Surabaya', 'Jawa Timur', 'Antarkota'),
  ('WO', 'Wonokromo', 'Surabaya', 'Jawa Timur', 'Surabaya-Kertosono'),
  ('KTS', 'Kertosono', 'Nganjuk', 'Jawa Timur', 'Surabaya-Kertosono'),
  ('KD', 'Kediri', 'Kota Kediri', 'Jawa Timur', 'Antarkota'),
  ('BL', 'Blitar', 'Kota Blitar', 'Jawa Timur', 'Antarkota'),
  ('ML', 'Malang', 'Kota Malang', 'Jawa Timur', 'Antarkota'),
  ('MN', 'Madiun', 'Kota Madiun', 'Jawa Timur', 'Antarkota')
ON CONFLICT (code) DO NOTHING;

-- ============ JADWAL KA LOKAL / KOMUTER ============
-- KRL & KA Lokal: kelas EKONOMI, harga flat/rendah, banyak jadwal per hari.
-- Jadwal digenerate 7 hari ke depan dari CURRENT_DATE.
INSERT INTO train_schedules
  (train_name, train_number, train_class, origin_station, origin_station_code, origin_city,
   destination_station, destination_station_code, destination_city, train_category,
   departure_time, arrival_time, duration_minutes, price, available_seats, status)
SELECT
  v.train_name, v.train_number, v.train_class, v.origin_station, v.origin_code, v.origin_city,
  v.dest_station, v.dest_code, v.dest_city, 'LOKAL',
  (CURRENT_DATE + d.days) + (v.dep_h * INTERVAL '1 hour') + (v.dep_m * INTERVAL '1 minute'),
  (CURRENT_DATE + d.days) + (v.arr_h * INTERVAL '1 hour') + (v.arr_m * INTERVAL '1 minute'),
  v.duration, v.price, 1384, 'AVAILABLE'
FROM (VALUES
  -- KRL Bogor <-> Jakarta Kota
  ('KRL Commuter Line Bogor', 'KA 8', 'EKONOMI', 'Bogor', 'BOO', 'Bogor', 'Jakarta Kota', 'JAKK', 'Jakarta', 5, 15, 6, 40, 85, 8000),
  ('KRL Commuter Line Bogor', 'KA 12', 'EKONOMI', 'Bogor', 'BOO', 'Bogor', 'Jakarta Kota', 'JAKK', 'Jakarta', 5, 45, 7, 10, 85, 8000),
  ('KRL Commuter Line Bogor', 'KA 16', 'EKONOMI', 'Bogor', 'BOO', 'Bogor', 'Jakarta Kota', 'JAKK', 'Jakarta', 6, 15, 7, 40, 85, 8000),
  ('KRL Commuter Line Bogor', 'KA 20', 'EKONOMI', 'Bogor', 'BOO', 'Bogor', 'Jakarta Kota', 'JAKK', 'Jakarta', 6, 45, 8, 10, 85, 8000),
  ('KRL Commuter Line Bogor', 'KA 24', 'EKONOMI', 'Bogor', 'BOO', 'Bogor', 'Jakarta Kota', 'JAKK', 'Jakarta', 7, 15, 8, 40, 85, 8000),
  ('KRL Commuter Line Bogor', 'KA 28', 'EKONOMI', 'Bogor', 'BOO', 'Bogor', 'Jakarta Kota', 'JAKK', 'Jakarta', 7, 45, 9, 10, 85, 8000),
  ('KRL Commuter Line Bogor', 'KA 9', 'EKONOMI', 'Jakarta Kota', 'JAKK', 'Jakarta', 'Bogor', 'BOO', 'Bogor', 5, 30, 6, 55, 85, 8000),
  ('KRL Commuter Line Bogor', 'KA 13', 'EKONOMI', 'Jakarta Kota', 'JAKK', 'Jakarta', 'Bogor', 'BOO', 'Bogor', 6, 0, 7, 25, 85, 8000),
  ('KRL Commuter Line Bogor', 'KA 17', 'EKONOMI', 'Jakarta Kota', 'JAKK', 'Jakarta', 'Bogor', 'BOO', 'Bogor', 6, 30, 7, 55, 85, 8000),
  ('KRL Commuter Line Bogor', 'KA 21', 'EKONOMI', 'Jakarta Kota', 'JAKK', 'Jakarta', 'Bogor', 'BOO', 'Bogor', 7, 0, 8, 25, 85, 8000),
  ('KRL Commuter Line Bogor', 'KA 25', 'EKONOMI', 'Jakarta Kota', 'JAKK', 'Jakarta', 'Bogor', 'BOO', 'Bogor', 7, 30, 8, 55, 85, 8000),
  ('KRL Commuter Line Bogor', 'KA 29', 'EKONOMI', 'Jakarta Kota', 'JAKK', 'Jakarta', 'Bogor', 'BOO', 'Bogor', 8, 0, 9, 25, 85, 8000),
  -- KRL Bekasi <-> Jakarta Kota
  ('KRL Commuter Line Bekasi', 'KA 201', 'EKONOMI', 'Bekasi', 'BKS', 'Kota Bekasi', 'Jakarta Kota', 'JAKK', 'Jakarta', 5, 0, 5, 55, 55, 6000),
  ('KRL Commuter Line Bekasi', 'KA 203', 'EKONOMI', 'Bekasi', 'BKS', 'Kota Bekasi', 'Jakarta Kota', 'JAKK', 'Jakarta', 5, 40, 6, 35, 55, 6000),
  ('KRL Commuter Line Bekasi', 'KA 205', 'EKONOMI', 'Bekasi', 'BKS', 'Kota Bekasi', 'Jakarta Kota', 'JAKK', 'Jakarta', 6, 20, 7, 15, 55, 6000),
  ('KRL Commuter Line Bekasi', 'KA 207', 'EKONOMI', 'Bekasi', 'BKS', 'Kota Bekasi', 'Jakarta Kota', 'JAKK', 'Jakarta', 7, 0, 7, 55, 55, 6000),
  ('KRL Commuter Line Bekasi', 'KA 209', 'EKONOMI', 'Bekasi', 'BKS', 'Kota Bekasi', 'Jakarta Kota', 'JAKK', 'Jakarta', 7, 40, 8, 35, 55, 6000),
  ('KRL Commuter Line Bekasi', 'KA 211', 'EKONOMI', 'Bekasi', 'BKS', 'Kota Bekasi', 'Jakarta Kota', 'JAKK', 'Jakarta', 8, 20, 9, 15, 55, 6000),
  ('KRL Commuter Line Bekasi', 'KA 202', 'EKONOMI', 'Jakarta Kota', 'JAKK', 'Jakarta', 'Bekasi', 'BKS', 'Kota Bekasi', 5, 15, 6, 10, 55, 6000),
  ('KRL Commuter Line Bekasi', 'KA 204', 'EKONOMI', 'Jakarta Kota', 'JAKK', 'Jakarta', 'Bekasi', 'BKS', 'Kota Bekasi', 5, 55, 6, 50, 55, 6000),
  ('KRL Commuter Line Bekasi', 'KA 206', 'EKONOMI', 'Jakarta Kota', 'JAKK', 'Jakarta', 'Bekasi', 'BKS', 'Kota Bekasi', 6, 35, 7, 30, 55, 6000),
  ('KRL Commuter Line Bekasi', 'KA 208', 'EKONOMI', 'Jakarta Kota', 'JAKK', 'Jakarta', 'Bekasi', 'BKS', 'Kota Bekasi', 7, 15, 8, 10, 55, 6000),
  ('KRL Commuter Line Bekasi', 'KA 210', 'EKONOMI', 'Jakarta Kota', 'JAKK', 'Jakarta', 'Bekasi', 'BKS', 'Kota Bekasi', 7, 55, 8, 50, 55, 6000),
  ('KRL Commuter Line Bekasi', 'KA 212', 'EKONOMI', 'Jakarta Kota', 'JAKK', 'Jakarta', 'Bekasi', 'BKS', 'Kota Bekasi', 8, 35, 9, 30, 55, 6000),
  -- KRL Tangerang <-> Duri
  ('KRL Commuter Line Tangerang', 'KA 301', 'EKONOMI', 'Tangerang', 'TNG', 'Kota Tangerang', 'Duri', 'DRI', 'Jakarta', 5, 0, 5, 45, 45, 5000),
  ('KRL Commuter Line Tangerang', 'KA 303', 'EKONOMI', 'Tangerang', 'TNG', 'Kota Tangerang', 'Duri', 'DRI', 'Jakarta', 5, 45, 6, 30, 45, 5000),
  ('KRL Commuter Line Tangerang', 'KA 305', 'EKONOMI', 'Tangerang', 'TNG', 'Kota Tangerang', 'Duri', 'DRI', 'Jakarta', 6, 30, 7, 15, 45, 5000),
  ('KRL Commuter Line Tangerang', 'KA 307', 'EKONOMI', 'Tangerang', 'TNG', 'Kota Tangerang', 'Duri', 'DRI', 'Jakarta', 7, 15, 8, 0, 45, 5000),
  ('KRL Commuter Line Tangerang', 'KA 309', 'EKONOMI', 'Tangerang', 'TNG', 'Kota Tangerang', 'Duri', 'DRI', 'Jakarta', 8, 0, 8, 45, 45, 5000),
  ('KRL Commuter Line Tangerang', 'KA 311', 'EKONOMI', 'Tangerang', 'TNG', 'Kota Tangerang', 'Duri', 'DRI', 'Jakarta', 8, 45, 9, 30, 45, 5000),
  ('KRL Commuter Line Tangerang', 'KA 302', 'EKONOMI', 'Duri', 'DRI', 'Jakarta', 'Tangerang', 'TNG', 'Kota Tangerang', 5, 15, 6, 0, 45, 5000),
  ('KRL Commuter Line Tangerang', 'KA 304', 'EKONOMI', 'Duri', 'DRI', 'Jakarta', 'Tangerang', 'TNG', 'Kota Tangerang', 6, 0, 6, 45, 45, 5000),
  ('KRL Commuter Line Tangerang', 'KA 306', 'EKONOMI', 'Duri', 'DRI', 'Jakarta', 'Tangerang', 'TNG', 'Kota Tangerang', 6, 45, 7, 30, 45, 5000),
  ('KRL Commuter Line Tangerang', 'KA 308', 'EKONOMI', 'Duri', 'DRI', 'Jakarta', 'Tangerang', 'TNG', 'Kota Tangerang', 7, 30, 8, 15, 45, 5000),
  ('KRL Commuter Line Tangerang', 'KA 310', 'EKONOMI', 'Duri', 'DRI', 'Jakarta', 'Tangerang', 'TNG', 'Kota Tangerang', 8, 15, 9, 0, 45, 5000),
  ('KRL Commuter Line Tangerang', 'KA 312', 'EKONOMI', 'Duri', 'DRI', 'Jakarta', 'Tangerang', 'TNG', 'Kota Tangerang', 9, 0, 9, 45, 45, 5000),
  -- KRL Rangkasbitung <-> Tanah Abang
  ('KRL Commuter Line Rangkasbitung', 'KA 401', 'EKONOMI', 'Rangkasbitung', 'RK', 'Lebak', 'Tanah Abang', 'THB', 'Jakarta', 4, 45, 6, 40, 115, 10000),
  ('KRL Commuter Line Rangkasbitung', 'KA 403', 'EKONOMI', 'Rangkasbitung', 'RK', 'Lebak', 'Tanah Abang', 'THB', 'Jakarta', 5, 45, 7, 40, 115, 10000),
  ('KRL Commuter Line Rangkasbitung', 'KA 405', 'EKONOMI', 'Rangkasbitung', 'RK', 'Lebak', 'Tanah Abang', 'THB', 'Jakarta', 6, 45, 8, 40, 115, 10000),
  ('KRL Commuter Line Rangkasbitung', 'KA 407', 'EKONOMI', 'Rangkasbitung', 'RK', 'Lebak', 'Tanah Abang', 'THB', 'Jakarta', 7, 45, 9, 40, 115, 10000),
  ('KRL Commuter Line Rangkasbitung', 'KA 402', 'EKONOMI', 'Tanah Abang', 'THB', 'Jakarta', 'Rangkasbitung', 'RK', 'Lebak', 5, 0, 6, 55, 115, 10000),
  ('KRL Commuter Line Rangkasbitung', 'KA 404', 'EKONOMI', 'Tanah Abang', 'THB', 'Jakarta', 'Rangkasbitung', 'RK', 'Lebak', 6, 0, 7, 55, 115, 10000),
  ('KRL Commuter Line Rangkasbitung', 'KA 406', 'EKONOMI', 'Tanah Abang', 'THB', 'Jakarta', 'Rangkasbitung', 'RK', 'Lebak', 7, 0, 8, 55, 115, 10000),
  ('KRL Commuter Line Rangkasbitung', 'KA 408', 'EKONOMI', 'Tanah Abang', 'THB', 'Jakarta', 'Rangkasbitung', 'RK', 'Lebak', 8, 0, 9, 55, 115, 10000),
  -- KA Lokal Bandung Raya (Padalarang <-> Cicalengka via Bandung)
  ('KA Lokal Bandung Raya', 'KA 501', 'EKONOMI', 'Padalarang', 'PDL', 'Bandung Barat', 'Cicalengka', 'CCL', 'Bandung', 5, 0, 7, 0, 120, 30000),
  ('KA Lokal Bandung Raya', 'KA 503', 'EKONOMI', 'Padalarang', 'PDL', 'Bandung Barat', 'Cicalengka', 'CCL', 'Bandung', 6, 0, 8, 0, 120, 30000),
  ('KA Lokal Bandung Raya', 'KA 505', 'EKONOMI', 'Padalarang', 'PDL', 'Bandung Barat', 'Cicalengka', 'CCL', 'Bandung', 7, 0, 9, 0, 120, 30000),
  ('KA Lokal Bandung Raya', 'KA 507', 'EKONOMI', 'Padalarang', 'PDL', 'Bandung Barat', 'Cicalengka', 'CCL', 'Bandung', 8, 0, 10, 0, 120, 30000),
  ('KA Lokal Bandung Raya', 'KA 509', 'EKONOMI', 'Padalarang', 'PDL', 'Bandung Barat', 'Cicalengka', 'CCL', 'Bandung', 9, 0, 11, 0, 120, 30000),
  ('KA Lokal Bandung Raya', 'KA 511', 'EKONOMI', 'Padalarang', 'PDL', 'Bandung Barat', 'Cicalengka', 'CCL', 'Bandung', 10, 0, 12, 0, 120, 30000),
  ('KA Lokal Bandung Raya', 'KA 502', 'EKONOMI', 'Cicalengka', 'CCL', 'Bandung', 'Padalarang', 'PDL', 'Bandung Barat', 5, 30, 7, 30, 120, 30000),
  ('KA Lokal Bandung Raya', 'KA 504', 'EKONOMI', 'Cicalengka', 'CCL', 'Bandung', 'Padalarang', 'PDL', 'Bandung Barat', 6, 30, 8, 30, 120, 30000),
  ('KA Lokal Bandung Raya', 'KA 506', 'EKONOMI', 'Cicalengka', 'CCL', 'Bandung', 'Padalarang', 'PDL', 'Bandung Barat', 7, 30, 9, 30, 120, 30000),
  ('KA Lokal Bandung Raya', 'KA 508', 'EKONOMI', 'Cicalengka', 'CCL', 'Bandung', 'Padalarang', 'PDL', 'Bandung Barat', 8, 30, 10, 30, 120, 30000),
  ('KA Lokal Bandung Raya', 'KA 510', 'EKONOMI', 'Cicalengka', 'CCL', 'Bandung', 'Padalarang', 'PDL', 'Bandung Barat', 9, 30, 11, 30, 120, 30000),
  ('KA Lokal Bandung Raya', 'KA 512', 'EKONOMI', 'Cicalengka', 'CCL', 'Bandung', 'Padalarang', 'PDL', 'Bandung Barat', 10, 30, 12, 30, 120, 30000),
  -- KA Lokal Merak <-> Rangkasbitung
  ('KA Lokal Merak', 'KA 601', 'EKONOMI', 'Merak', 'MER', 'Cilegon', 'Rangkasbitung', 'RK', 'Lebak', 5, 0, 7, 5, 125, 40000),
  ('KA Lokal Merak', 'KA 603', 'EKONOMI', 'Merak', 'MER', 'Cilegon', 'Rangkasbitung', 'RK', 'Lebak', 7, 0, 9, 5, 125, 40000),
  ('KA Lokal Merak', 'KA 605', 'EKONOMI', 'Merak', 'MER', 'Cilegon', 'Rangkasbitung', 'RK', 'Lebak', 9, 0, 11, 5, 125, 40000),
  ('KA Lokal Merak', 'KA 607', 'EKONOMI', 'Merak', 'MER', 'Cilegon', 'Rangkasbitung', 'RK', 'Lebak', 15, 0, 17, 5, 125, 40000),
  ('KA Lokal Merak', 'KA 602', 'EKONOMI', 'Rangkasbitung', 'RK', 'Lebak', 'Merak', 'MER', 'Cilegon', 6, 0, 8, 5, 125, 40000),
  ('KA Lokal Merak', 'KA 604', 'EKONOMI', 'Rangkasbitung', 'RK', 'Lebak', 'Merak', 'MER', 'Cilegon', 8, 0, 10, 5, 125, 40000),
  ('KA Lokal Merak', 'KA 606', 'EKONOMI', 'Rangkasbitung', 'RK', 'Lebak', 'Merak', 'MER', 'Cilegon', 12, 0, 14, 5, 125, 40000),
  ('KA Lokal Merak', 'KA 608', 'EKONOMI', 'Rangkasbitung', 'RK', 'Lebak', 'Merak', 'MER', 'Cilegon', 17, 0, 19, 5, 125, 40000),
  -- KA Lokal Solo-Yogyakarta
  ('KA Lokal Solo-Yogyakarta', 'KA 701', 'EKONOMI', 'Solo Balapan', 'SLO', 'Surakarta', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 5, 0, 6, 15, 75, 35000),
  ('KA Lokal Solo-Yogyakarta', 'KA 703', 'EKONOMI', 'Solo Balapan', 'SLO', 'Surakarta', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 6, 0, 7, 15, 75, 35000),
  ('KA Lokal Solo-Yogyakarta', 'KA 705', 'EKONOMI', 'Solo Balapan', 'SLO', 'Surakarta', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 7, 0, 8, 15, 75, 35000),
  ('KA Lokal Solo-Yogyakarta', 'KA 707', 'EKONOMI', 'Solo Balapan', 'SLO', 'Surakarta', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 8, 0, 9, 15, 75, 35000),
  ('KA Lokal Solo-Yogyakarta', 'KA 709', 'EKONOMI', 'Solo Balapan', 'SLO', 'Surakarta', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 16, 0, 17, 15, 75, 35000),
  ('KA Lokal Solo-Yogyakarta', 'KA 711', 'EKONOMI', 'Solo Balapan', 'SLO', 'Surakarta', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 17, 0, 18, 15, 75, 35000),
  ('KA Lokal Solo-Yogyakarta', 'KA 702', 'EKONOMI', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 'Solo Balapan', 'SLO', 'Surakarta', 5, 30, 6, 45, 75, 35000),
  ('KA Lokal Solo-Yogyakarta', 'KA 704', 'EKONOMI', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 'Solo Balapan', 'SLO', 'Surakarta', 6, 30, 7, 45, 75, 35000),
  ('KA Lokal Solo-Yogyakarta', 'KA 706', 'EKONOMI', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 'Solo Balapan', 'SLO', 'Surakarta', 7, 30, 8, 45, 75, 35000),
  ('KA Lokal Solo-Yogyakarta', 'KA 708', 'EKONOMI', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 'Solo Balapan', 'SLO', 'Surakarta', 8, 30, 9, 45, 75, 35000),
  ('KA Lokal Solo-Yogyakarta', 'KA 710', 'EKONOMI', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 'Solo Balapan', 'SLO', 'Surakarta', 15, 30, 16, 45, 75, 35000),
  ('KA Lokal Solo-Yogyakarta', 'KA 712', 'EKONOMI', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 'Solo Balapan', 'SLO', 'Surakarta', 16, 30, 17, 45, 75, 35000),
  -- KA Lokal Surabaya-Kertosono
  ('KA Lokal Surabaya-Kertosono', 'KA 801', 'EKONOMI', 'Surabaya Gubeng', 'SGU', 'Surabaya', 'Kertosono', 'KTS', 'Nganjuk', 5, 0, 6, 20, 80, 40000),
  ('KA Lokal Surabaya-Kertosono', 'KA 803', 'EKONOMI', 'Surabaya Gubeng', 'SGU', 'Surabaya', 'Kertosono', 'KTS', 'Nganjuk', 7, 0, 8, 20, 80, 40000),
  ('KA Lokal Surabaya-Kertosono', 'KA 805', 'EKONOMI', 'Surabaya Gubeng', 'SGU', 'Surabaya', 'Kertosono', 'KTS', 'Nganjuk', 15, 0, 16, 20, 80, 40000),
  ('KA Lokal Surabaya-Kertosono', 'KA 807', 'EKONOMI', 'Surabaya Gubeng', 'SGU', 'Surabaya', 'Kertosono', 'KTS', 'Nganjuk', 17, 0, 18, 20, 80, 40000),
  ('KA Lokal Surabaya-Kertosono', 'KA 802', 'EKONOMI', 'Kertosono', 'KTS', 'Nganjuk', 'Surabaya Gubeng', 'SGU', 'Surabaya', 6, 0, 7, 20, 80, 40000),
  ('KA Lokal Surabaya-Kertosono', 'KA 804', 'EKONOMI', 'Kertosono', 'KTS', 'Nganjuk', 'Surabaya Gubeng', 'SGU', 'Surabaya', 8, 0, 9, 20, 80, 40000),
  ('KA Lokal Surabaya-Kertosono', 'KA 806', 'EKONOMI', 'Kertosono', 'KTS', 'Nganjuk', 'Surabaya Gubeng', 'SGU', 'Surabaya', 16, 0, 17, 20, 80, 40000),
  ('KA Lokal Surabaya-Kertosono', 'KA 808', 'EKONOMI', 'Kertosono', 'KTS', 'Nganjuk', 'Surabaya Gubeng', 'SGU', 'Surabaya', 18, 0, 19, 20, 80, 40000)
) v(train_name, train_number, train_class, origin_station, origin_code, origin_city, dest_station, dest_code, dest_city, dep_h, dep_m, arr_h, arr_m, duration, price)
CROSS JOIN (VALUES (0), (1), (2), (3), (4), (5), (6)) d(days)
ON CONFLICT (train_number, departure_time) DO NOTHING;

-- ============ JADWAL KA ANTARKOTA ============
INSERT INTO train_schedules
  (train_name, train_number, train_class, origin_station, origin_station_code, origin_city,
   destination_station, destination_station_code, destination_city, train_category,
   departure_time, arrival_time, duration_minutes, price, available_seats, status)
SELECT
  v.train_name, v.train_number, v.train_class, v.origin_station, v.origin_code, v.origin_city,
  v.dest_station, v.dest_code, v.dest_city, 'ANTARKOTA',
  (CURRENT_DATE + d.days) + (v.dep_h * INTERVAL '1 hour') + (v.dep_m * INTERVAL '1 minute'),
  (CURRENT_DATE + d.days) + (v.arr_h * INTERVAL '1 hour') + (v.arr_m * INTERVAL '1 minute'),
  v.duration, v.price, v.seats, 'AVAILABLE'
FROM (VALUES
  -- Argo Parahyangan (Gambir <-> Bandung)
  ('Argo Parahyangan', 'KA 43', 'EKSEKUTIF', 'Gambir', 'GMR', 'Jakarta', 'Bandung Hall', 'BD', 'Kota Bandung', 6, 0, 9, 25, 205, 300000, 384),
  ('Argo Parahyangan', 'KA 47', 'EKSEKUTIF', 'Gambir', 'GMR', 'Jakarta', 'Bandung Hall', 'BD', 'Kota Bandung', 14, 0, 17, 25, 205, 300000, 384),
  ('Argo Parahyangan', 'KA 44', 'EKSEKUTIF', 'Bandung Hall', 'BD', 'Kota Bandung', 'Gambir', 'GMR', 'Jakarta', 9, 30, 12, 55, 205, 300000, 384),
  ('Argo Parahyangan', 'KA 48', 'EKSEKUTIF', 'Bandung Hall', 'BD', 'Kota Bandung', 'Gambir', 'GMR', 'Jakarta', 17, 30, 20, 55, 205, 300000, 384),
  -- Argo Bromo Anggrek (Gambir <-> Surabaya Pasar Turi)
  ('Argo Bromo Anggrek', 'KA 2', 'EKSEKUTIF', 'Gambir', 'GMR', 'Jakarta', 'Surabaya Pasar Turi', 'SBI', 'Surabaya', 8, 0, 18, 0, 600, 700000, 480),
  ('Argo Bromo Anggrek', 'KA 1', 'EKSEKUTIF', 'Surabaya Pasar Turi', 'SBI', 'Surabaya', 'Gambir', 'GMR', 'Jakarta', 8, 0, 18, 0, 600, 700000, 480),
  -- Taksaka (Gambir <-> Yogyakarta)
  ('Taksaka', 'KA 5', 'EKSEKUTIF', 'Gambir', 'GMR', 'Jakarta', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 6, 0, 13, 0, 420, 580000, 378),
  ('Taksaka', 'KA 6', 'EKSEKUTIF', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 'Gambir', 'GMR', 'Jakarta', 6, 0, 13, 0, 420, 580000, 378),
  -- Gajayana (Gambir <-> Malang)
  ('Gajayana', 'KA 4', 'EKSEKUTIF', 'Gambir', 'GMR', 'Jakarta', 'Malang', 'ML', 'Kota Malang', 5, 30, 17, 30, 720, 690000, 336),
  ('Gajayana', 'KA 3', 'EKSEKUTIF', 'Malang', 'ML', 'Kota Malang', 'Gambir', 'GMR', 'Jakarta', 5, 30, 17, 30, 720, 690000, 336),
  -- Bangunkarta (Pasar Senen <-> Surabaya Gubeng)
  ('Bangunkarta', 'KA 212', 'EKSEKUTIF', 'Pasar Senen', 'PSE', 'Jakarta', 'Surabaya Gubeng', 'SGU', 'Surabaya', 7, 0, 18, 0, 660, 450000, 384),
  ('Bangunkarta', 'KA 211', 'EKSEKUTIF', 'Surabaya Gubeng', 'SGU', 'Surabaya', 'Pasar Senen', 'PSE', 'Jakarta', 7, 0, 18, 0, 660, 450000, 384),
  -- Sancaka (Yogyakarta <-> Surabaya Gubeng)
  ('Sancaka', 'KA 152', 'EKSEKUTIF', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 'Surabaya Gubeng', 'SGU', 'Surabaya', 6, 0, 11, 30, 330, 400000, 320),
  ('Sancaka', 'KA 151', 'EKSEKUTIF', 'Surabaya Gubeng', 'SGU', 'Surabaya', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 6, 0, 11, 30, 330, 400000, 320),
  -- Turangga (Surabaya Gubeng <-> Bandung)
  ('Turangga', 'KA 148', 'EKSEKUTIF', 'Surabaya Gubeng', 'SGU', 'Surabaya', 'Bandung Hall', 'BD', 'Kota Bandung', 7, 0, 18, 0, 660, 520000, 320),
  ('Turangga', 'KA 147', 'EKSEKUTIF', 'Bandung Hall', 'BD', 'Kota Bandung', 'Surabaya Gubeng', 'SGU', 'Surabaya', 7, 0, 18, 0, 660, 520000, 320),
  -- Mutiara Timur (Pasar Senen <-> Surabaya Pasar Turi)
  ('Mutiara Timur', 'KA 110', 'EKONOMI', 'Pasar Senen', 'PSE', 'Jakarta', 'Surabaya Pasar Turi', 'SBI', 'Surabaya', 9, 0, 19, 0, 600, 210000, 420),
  ('Mutiara Timur', 'KA 109', 'EKONOMI', 'Surabaya Pasar Turi', 'SBI', 'Surabaya', 'Pasar Senen', 'PSE', 'Jakarta', 9, 0, 19, 0, 600, 210000, 420),
  -- Gaya Baru Malam Selatan (Pasar Senen <-> Surabaya Gubeng)
  ('Gaya Baru Malam Selatan', 'KA 180', 'EKONOMI', 'Pasar Senen', 'PSE', 'Jakarta', 'Surabaya Gubeng', 'SGU', 'Surabaya', 10, 0, 20, 0, 600, 190000, 420),
  ('Gaya Baru Malam Selatan', 'KA 179', 'EKONOMI', 'Surabaya Gubeng', 'SGU', 'Surabaya', 'Pasar Senen', 'PSE', 'Jakarta', 10, 0, 20, 0, 600, 190000, 420),
  -- Sancaka Utara (Yogyakarta <-> Surabaya Gubeng) kelas BISNIS
  ('Sancaka Utara', 'KA 230', 'BISNIS', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 'Surabaya Gubeng', 'SGU', 'Surabaya', 8, 0, 13, 30, 330, 260000, 320),
  ('Sancaka Utara', 'KA 229', 'BISNIS', 'Surabaya Gubeng', 'SGU', 'Surabaya', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 8, 0, 13, 30, 330, 260000, 320),
  -- Kamandaka (Semarang Tawang <-> Yogyakarta) kelas EKSEKUTIF & EKONOMI
  ('Kamandaka', 'KA 340', 'EKSEKUTIF', 'Semarang Tawang', 'SMT', 'Kota Semarang', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 6, 0, 11, 0, 300, 250000, 320),
  ('Kamandaka', 'KA 339', 'EKSEKUTIF', 'Yogyakarta', 'YK', 'Kota Yogyakarta', 'Semarang Tawang', 'SMT', 'Kota Semarang', 6, 0, 11, 0, 300, 250000, 320)
) v(train_name, train_number, train_class, origin_station, origin_code, origin_city, dest_station, dest_code, dest_city, dep_h, dep_m, arr_h, arr_m, duration, price, seats)
CROSS JOIN (VALUES (0), (1), (2), (3), (4), (5), (6)) d(days)
ON CONFLICT (train_number, departure_time) DO NOTHING;