INSERT INTO airports (iata_code, name, city, country) VALUES
('CGK','Soekarno-Hatta International','Jakarta','Indonesia'),
('KNO','Kualanamu International','Medan','Indonesia'),
('BDO','Husein Sastranegara International','Bandung','Indonesia'),
('DPS','I Gusti Ngurah Rai International','Denpasar','Indonesia'),
('SUB','Juanda International','Surabaya','Indonesia'),
('YIA','Yogyakarta International','Yogyakarta','Indonesia'),
('UPG','Sultan Hasanuddin International','Makassar','Indonesia'),
('PLM','Sultan Mahmud Badaruddin II','Palembang','Indonesia')
ON CONFLICT (iata_code) DO NOTHING;

INSERT INTO airlines (code, name) VALUES
('GA','Garuda Indonesia'),
('ID','Batik Air'),
('QG','Citilink'),
('JT','Lion Air'),
('IU','Super Air Jet'),
('IP','Pelita Air')
ON CONFLICT (code) DO NOTHING;

INSERT INTO airplanes (airline_id, model, seat_capacity) VALUES
((SELECT id FROM airlines WHERE code='GA'),'Boeing 737-800',180),
((SELECT id FROM airlines WHERE code='GA'),'Boeing 737-900ER',225),
((SELECT id FROM airlines WHERE code='ID'),'Airbus A320-200',180),
((SELECT id FROM airlines WHERE code='QG'),'Airbus A320neo',186),
((SELECT id FROM airlines WHERE code='JT'),'Boeing 737-900ER',215),
((SELECT id FROM airlines WHERE code='IU'),'Airbus A320',180),
((SELECT id FROM airlines WHERE code='IP'),'Airbus A320',168);

INSERT INTO flight_schedules
 (flight_number, airline_id, airplane_id, origin_airport_id, destination_airport_id,
  departure_time, arrival_time, base_price, status,
  airline_code, airline_name, airplane_model, seat_class, available_seats,
  origin_airport_code, origin_airport_name, origin_city,
  destination_airport_code, destination_airport_name, destination_city)
SELECT
  v.code || '-' || LPAD((ROW_NUMBER() OVER (ORDER BY v.origin, v.dest, v.code, dd.days))::text, 3, '0'),
  a.id, ap.id, oa.id, da.id,
  d.base + (dd.days * INTERVAL '1 day') + (v.dep_h * INTERVAL '1 hour') + (v.dep_m * INTERVAL '1 minute'),
  d.base + (dd.days * INTERVAL '1 day') + (v.arr_h * INTERVAL '1 hour') + (v.arr_m * INTERVAL '1 minute'),
  CASE a.code
    WHEN 'GA' THEN 1650000
    WHEN 'ID' THEN 1250000
    WHEN 'QG' THEN 950000
    WHEN 'JT' THEN 780000
    WHEN 'IU' THEN 750000
    WHEN 'IP' THEN 890000
  END, 'SCHEDULED',
  a.code, a.name, ap.model, 'Ekonomi', ap.seat_capacity,
  oa.iata_code, oa.name, oa.city,
  da.iata_code, da.name, da.city
FROM (VALUES
  -- Jakarta (CGK) <-> Medan (KNO)
  ('CGK','KNO','GA', 6, 0, 8, 0),
  ('CGK','KNO','ID', 9,15,11,20),
  ('CGK','KNO','QG',13, 0,15, 5),
  ('CGK','KNO','JT',18,30,20,35),
  ('CGK','KNO','IU',21,10,23,10),
  ('KNO','CGK','GA', 6,30, 8,35),
  ('KNO','CGK','ID',11, 0,13, 5),
  ('KNO','CGK','QG',15, 0,17, 5),
  ('KNO','CGK','JT',19, 0,21, 5),
  -- Jakarta (CGK) <-> Bali / Denpasar (DPS)
  ('CGK','DPS','GA', 6,15, 7,55),
  ('CGK','DPS','ID',10, 0,11,40),
  ('CGK','DPS','QG',14,30,16,10),
  ('CGK','DPS','JT',18,45,20,25),
  ('CGK','DPS','IU',21,30,23,10),
  ('DPS','CGK','GA', 7,30, 9,10),
  ('DPS','CGK','ID',12, 0,13,40),
  ('DPS','CGK','QG',16,30,18,10),
  ('DPS','CGK','JT',20, 0,21,40)
) v(origin,dest,code,dep_h,dep_m,arr_h,arr_m)
JOIN (SELECT CURRENT_DATE + 0 AS base) d ON true
JOIN airlines a ON a.code = v.code
JOIN airports oa ON oa.iata_code = v.origin
JOIN airports da ON da.iata_code = v.dest
JOIN LATERAL (SELECT xp.* FROM airplanes xp WHERE xp.airline_id = a.id ORDER BY xp.id LIMIT 1) ap ON true
CROSS JOIN (VALUES (0),(1),(2),(3),(4)) dd(days);

INSERT INTO flight_schedules
 (flight_number, airline_id, airplane_id, origin_airport_id, destination_airport_id,
  departure_time, arrival_time, base_price, status,
  airline_code, airline_name, airplane_model, seat_class, available_seats,
  origin_airport_code, origin_airport_name, origin_city,
  destination_airport_code, destination_airport_name, destination_city)
SELECT
  v.code || '-' || LPAD((ROW_NUMBER() OVER (ORDER BY v.origin, v.dest, v.code, dd.days))::text, 3, '0'),
  a.id, ap.id, oa.id, da.id,
  d.base + (dd.days * INTERVAL '1 day') + (v.dep_h * INTERVAL '1 hour') + (v.dep_m * INTERVAL '1 minute'),
  d.base + (dd.days * INTERVAL '1 day') + (v.arr_h * INTERVAL '1 hour') + (v.arr_m * INTERVAL '1 minute'),
  CASE a.code
    WHEN 'GA' THEN 1650000
    WHEN 'ID' THEN 1250000
    WHEN 'QG' THEN 950000
    WHEN 'JT' THEN 780000
    WHEN 'IU' THEN 750000
    WHEN 'IP' THEN 890000
  END, 'SCHEDULED',
  a.code, a.name, ap.model, 'Ekonomi', ap.seat_capacity,
  oa.iata_code, oa.name, oa.city,
  da.iata_code, da.name, da.city
FROM (VALUES
  -- Bandung (BDO) <-> Bali (DPS)
  ('BDO','DPS','QG', 6,30, 8, 5),
  ('BDO','DPS','JT',10, 0,11,40),
  ('BDO','DPS','IU',16, 0,17,35),
  ('DPS','BDO','QG', 9, 0,10,35),
  ('DPS','BDO','JT',13, 0,14,40),
  ('DPS','BDO','IU',19, 0,20,35),
  -- Bandung (BDO) <-> Medan (KNO)
  ('BDO','KNO','QG', 8, 0,10,25),
  ('BDO','KNO','IP',14, 0,16,20),
  ('KNO','BDO','QG',11, 0,13,25),
  ('KNO','BDO','IP',17, 0,19,20)
) v(origin,dest,code,dep_h,dep_m,arr_h,arr_m)
JOIN (SELECT CURRENT_DATE + 0 AS base) d ON true
JOIN airlines a ON a.code = v.code
JOIN airports oa ON oa.iata_code = v.origin
JOIN airports da ON da.iata_code = v.dest
JOIN LATERAL (SELECT xp.* FROM airplanes xp WHERE xp.airline_id = a.id ORDER BY xp.id LIMIT 1) ap ON true
CROSS JOIN (VALUES (0),(1),(2),(3),(4)) dd(days);

INSERT INTO flight_schedules
 (flight_number, airline_id, airplane_id, origin_airport_id, destination_airport_id,
  departure_time, arrival_time, base_price, status,
  airline_code, airline_name, airplane_model, seat_class, available_seats,
  origin_airport_code, origin_airport_name, origin_city,
  destination_airport_code, destination_airport_name, destination_city)
SELECT
  v.code || '-' || LPAD((ROW_NUMBER() OVER (ORDER BY v.origin, v.dest, v.code, dd.days))::text, 3, '0'),
  a.id, ap.id, oa.id, da.id,
  d.base + (dd.days * INTERVAL '1 day') + (v.dep_h * INTERVAL '1 hour') + (v.dep_m * INTERVAL '1 minute'),
  d.base + (dd.days * INTERVAL '1 day') + (v.arr_h * INTERVAL '1 hour') + (v.arr_m * INTERVAL '1 minute'),
  CASE a.code
    WHEN 'GA' THEN 1650000
    WHEN 'ID' THEN 1250000
    WHEN 'QG' THEN 950000
    WHEN 'JT' THEN 780000
    WHEN 'IU' THEN 750000
    WHEN 'IP' THEN 890000
  END, 'SCHEDULED',
  a.code, a.name, ap.model, 'Ekonomi', ap.seat_capacity,
  oa.iata_code, oa.name, oa.city,
  da.iata_code, da.name, da.city
FROM (VALUES
  -- Jakarta (CGK) <-> Surabaya (SUB)
  ('CGK','SUB','GA', 6,45, 8,10),
  ('CGK','SUB','ID',11,30,12,55),
  ('CGK','SUB','QG',15,30,16,55),
  ('CGK','SUB','JT',19,30,20,55),
  ('SUB','CGK','GA', 7,30, 8,55),
  ('SUB','CGK','ID',13, 0,14,25),
  ('SUB','CGK','QG',17,30,18,55),
  ('SUB','CGK','JT',21, 0,22,25),
  -- Surabaya (SUB) <-> Bali (DPS)
  ('SUB','DPS','QG', 6, 0, 6,55),
  ('SUB','DPS','JT',12,30,13,25),
  ('DPS','SUB','QG', 8, 0, 8,55),
  ('DPS','SUB','JT',15, 0,15,55)
) v(origin,dest,code,dep_h,dep_m,arr_h,arr_m)
JOIN (SELECT CURRENT_DATE + 0 AS base) d ON true
JOIN airlines a ON a.code = v.code
JOIN airports oa ON oa.iata_code = v.origin
JOIN airports da ON da.iata_code = v.dest
JOIN LATERAL (SELECT xp.* FROM airplanes xp WHERE xp.airline_id = a.id ORDER BY xp.id LIMIT 1) ap ON true
CROSS JOIN (VALUES (0),(1),(2),(3),(4)) dd(days);

INSERT INTO flight_schedules
 (flight_number, airline_id, airplane_id, origin_airport_id, destination_airport_id,
  departure_time, arrival_time, base_price, status,
  airline_code, airline_name, airplane_model, seat_class, available_seats,
  origin_airport_code, origin_airport_name, origin_city,
  destination_airport_code, destination_airport_name, destination_city)
SELECT
  v.code || '-' || LPAD((ROW_NUMBER() OVER (ORDER BY v.origin, v.dest, v.code, dd.days))::text, 3, '0'),
  a.id, ap.id, oa.id, da.id,
  d.base + (dd.days * INTERVAL '1 day') + (v.dep_h * INTERVAL '1 hour') + (v.dep_m * INTERVAL '1 minute'),
  d.base + (dd.days * INTERVAL '1 day') + (v.arr_h * INTERVAL '1 hour') + (v.arr_m * INTERVAL '1 minute'),
  CASE a.code
    WHEN 'GA' THEN 1650000
    WHEN 'ID' THEN 1250000
    WHEN 'QG' THEN 950000
    WHEN 'JT' THEN 780000
    WHEN 'IU' THEN 750000
    WHEN 'IP' THEN 890000
  END, 'SCHEDULED',
  a.code, a.name, ap.model, 'Ekonomi', ap.seat_capacity,
  oa.iata_code, oa.name, oa.city,
  da.iata_code, da.name, da.city
FROM (VALUES
  -- Jakarta (CGK) <-> Yogyakarta (YIA)
  ('CGK','YIA','GA', 6,20, 7,25),
  ('CGK','YIA','ID', 9,45,10,50),
  ('CGK','YIA','QG',13,30,14,35),
  ('CGK','YIA','JT',17, 0,18, 5),
  ('CGK','YIA','IU',20, 0,21, 5),
  ('YIA','CGK','GA', 7, 0, 8, 5),
  ('YIA','CGK','ID',11, 0,12, 5),
  ('YIA','CGK','QG',15, 0,16, 5),
  ('YIA','CGK','JT',18,30,19,35),
  -- Jakarta (CGK) <-> Makassar (UPG)
  ('CGK','UPG','GA', 6,10, 8,30),
  ('CGK','UPG','JT',10,30,12,50),
  ('CGK','UPG','QG',16, 0,18,20),
  ('UPG','CGK','GA', 7, 0, 9,20),
  ('UPG','CGK','JT',13,30,15,50),
  ('UPG','CGK','QG',19, 0,21,20)
) v(origin,dest,code,dep_h,dep_m,arr_h,arr_m)
JOIN (SELECT CURRENT_DATE + 0 AS base) d ON true
JOIN airlines a ON a.code = v.code
JOIN airports oa ON oa.iata_code = v.origin
JOIN airports da ON da.iata_code = v.dest
JOIN LATERAL (SELECT xp.* FROM airplanes xp WHERE xp.airline_id = a.id ORDER BY xp.id LIMIT 1) ap ON true
CROSS JOIN (VALUES (0),(1),(2),(3),(4)) dd(days);

INSERT INTO flight_schedules
 (flight_number, airline_id, airplane_id, origin_airport_id, destination_airport_id,
  departure_time, arrival_time, base_price, status,
  airline_code, airline_name, airplane_model, seat_class, available_seats,
  origin_airport_code, origin_airport_name, origin_city,
  destination_airport_code, destination_airport_name, destination_city)
SELECT
  v.code || '-' || LPAD((ROW_NUMBER() OVER (ORDER BY v.origin, v.dest, v.code, dd.days))::text, 3, '0'),
  a.id, ap.id, oa.id, da.id,
  d.base + (dd.days * INTERVAL '1 day') + (v.dep_h * INTERVAL '1 hour') + (v.dep_m * INTERVAL '1 minute'),
  d.base + (dd.days * INTERVAL '1 day') + (v.arr_h * INTERVAL '1 hour') + (v.arr_m * INTERVAL '1 minute'),
  CASE a.code
    WHEN 'GA' THEN 1650000
    WHEN 'ID' THEN 1250000
    WHEN 'QG' THEN 950000
    WHEN 'JT' THEN 780000
    WHEN 'IU' THEN 750000
    WHEN 'IP' THEN 890000
  END, 'SCHEDULED',
  a.code, a.name, ap.model, 'Ekonomi', ap.seat_capacity,
  oa.iata_code, oa.name, oa.city,
  da.iata_code, da.name, da.city
FROM (VALUES
  -- Jakarta (CGK) <-> Palembang (PLM)
  ('CGK','PLM','GA', 6,50, 7,45),
  ('CGK','PLM','IU',14, 0,14,55),
  ('PLM','CGK','GA', 8,30, 9,25),
  ('PLM','CGK','IU',16, 0,16,55)
) v(origin,dest,code,dep_h,dep_m,arr_h,arr_m)
JOIN (SELECT CURRENT_DATE + 0 AS base) d ON true
JOIN airlines a ON a.code = v.code
JOIN airports oa ON oa.iata_code = v.origin
JOIN airports da ON da.iata_code = v.dest
JOIN LATERAL (SELECT xp.* FROM airplanes xp WHERE xp.airline_id = a.id ORDER BY xp.id LIMIT 1) ap ON true
CROSS JOIN (VALUES (0),(1),(2),(3),(4)) dd(days);