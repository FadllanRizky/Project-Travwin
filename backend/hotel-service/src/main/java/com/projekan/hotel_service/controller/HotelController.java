package com.projekan.hotel_service.controller;

import com.projekan.hotel_service.dto.HotelSearchResult;
import com.projekan.hotel_service.model.Hotel;
import com.projekan.hotel_service.model.RoomType;
import com.projekan.hotel_service.repository.HotelRepository;
import com.projekan.hotel_service.repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/hotels")
public class HotelController {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @GetMapping("/search")
    public ResponseEntity<?> searchHotels(
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String checkIn,
            @RequestParam(required = false) String checkOut,
            @RequestParam(required = false) Integer guests) {

        if (checkIn == null || checkOut == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "INVALID_DATE",
                    "message", "Tanggal check-in dan check-out wajib diisi.",
                    "field", "date"));
        }

        LocalDate in;
        LocalDate out;
        try {
            in = LocalDate.parse(checkIn);
            out = LocalDate.parse(checkOut);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "INVALID_DATE",
                    "message", "Format tanggal tidak valid (gunakan YYYY-MM-DD).",
                    "field", "date"));
        }

        LocalDate today = LocalDate.now(java.time.ZoneId.of("Asia/Jakarta"));
        if (in.isBefore(today)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "CHECKIN_PAST",
                    "message", "Tanggal check-in tidak boleh di masa lalu.",
                    "field", "checkIn"));
        }
        if (!out.isAfter(in)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "CHECKOUT_INVALID",
                    "message", "Tanggal check-out harus setelah tanggal check-in.",
                    "field", "checkOut"));
        }

        int guestCount = guests != null ? guests : 1;
        if (guestCount < 1 || guestCount > 8) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "GUESTS_INVALID",
                    "message", "Jumlah tamu harus antara 1 hingga 8 orang.",
                    "field", "guests"));
        }

        String dest = destination != null && !destination.isBlank() ? destination.trim() : city;

        List<Hotel> hotels = (dest == null || dest.isBlank())
                ? hotelRepository.findAll()
                : hotelRepository.searchByDestination(dest);

        List<HotelSearchResult> results = buildResults(hotels, guestCount);

        if (results.isEmpty() && guestCount > 1) {
            results = buildResults(hotels, 1);
        }

        results.sort(Comparator.comparing(HotelSearchResult::minPricePerNight)
                .thenComparing(Comparator.nullsLast(Comparator.comparing(
                        HotelSearchResult::popularity, Comparator.nullsLast(Comparator.reverseOrder())))));

        return ResponseEntity.ok(results);
    }

    private List<HotelSearchResult> buildResults(List<Hotel> hotels, int guests) {
        List<HotelSearchResult> results = new ArrayList<>();
        for (Hotel h : hotels) {
            List<RoomType> rooms = roomTypeRepository
                    .findByHotelIdAndMaxGuestsGreaterThanEqualOrderByBasePricePerNightAsc(h.getId(), guests);
            if (rooms.isEmpty()) continue;
            BigDecimal minPrice = rooms.get(0).getBasePricePerNight();
            int totalAvailable = rooms.stream()
                    .map(r -> r.getAvailableRooms() != null ? r.getAvailableRooms() : 0)
                    .reduce(0, Integer::sum);
            results.add(HotelSearchResult.from(h, rooms, minPrice, totalAvailable));
        }
        return results;
    }

    @GetMapping("/{id}/rooms")
    public ResponseEntity<List<RoomType>> getRooms(@PathVariable Long id) {
        return ResponseEntity.ok(roomTypeRepository.findByHotelIdOrderByBasePricePerNightAsc(id));
    }

    @PostMapping
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelRepository.save(hotel));
    }

    @PostMapping("/rooms")
    public ResponseEntity<RoomType> createRoom(@RequestBody RoomType room) {
        return ResponseEntity.ok(roomTypeRepository.save(room));
    }
}