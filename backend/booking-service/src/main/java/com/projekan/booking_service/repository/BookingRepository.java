package com.projekan.booking_service.repository;

import com.projekan.booking_service.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByBookingDateDesc(Long userId);
    Optional<Booking> findByBookingCode(String bookingCode);
}