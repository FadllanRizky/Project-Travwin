package com.projekan.booking_service.controller;

import com.projekan.booking_service.model.Booking;
import com.projekan.booking_service.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    private static final String[] SERVICE_PREFIX = {
            "HOTEL", "FLIGHT", "TRAIN", "WHOOSH", "TRAVEL", "RENTAL", "AIRPORT"
    };

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        if (booking.getBookingDate() == null) {
            booking.setBookingDate(java.time.LocalDateTime.now());
        }
        String prefix = servicePrefix(booking.getServiceType());
        String code = prefix + "-" + booking.getBookingDate().format(DateTimeFormatter.ofPattern("yyMMdd"))
                + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        booking.setBookingCode(code);
        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingRepository.findByUserIdOrderByBookingDateDesc(userId));
    }

    @GetMapping("/{code}")
    public ResponseEntity<Booking> getBookingByCode(@PathVariable String code) {
        return bookingRepository.findByBookingCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody Booking updated) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    updated.setId(id);
                    updated.setBookingCode(booking.getBookingCode());
                    if (updated.getBookingDate() == null) {
                        updated.setBookingDate(booking.getBookingDate());
                    }
                    return ResponseEntity.ok(bookingRepository.save(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private String servicePrefix(String serviceType) {
        if (serviceType == null) return "BOOK";
        String upper = serviceType.toUpperCase();
        if (upper.startsWith("HOTEL")) return SERVICE_PREFIX[0];
        if (upper.startsWith("FLIGHT") || upper.startsWith("PESA")) return SERVICE_PREFIX[1];
        if (upper.startsWith("TRAIN") || upper.startsWith("KER")) return SERVICE_PREFIX[2];
        if (upper.startsWith("WHOOSH")) return SERVICE_PREFIX[3];
        if (upper.startsWith("TRAVEL")) return SERVICE_PREFIX[4];
        if (upper.startsWith("RENTAL")) return SERVICE_PREFIX[5];
        if (upper.startsWith("AIRPORT")) return SERVICE_PREFIX[6];
        return "BOOK";
    }
}