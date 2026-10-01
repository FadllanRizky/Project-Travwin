package com.projekan.hotel_service.repository;

import com.projekan.hotel_service.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    Optional<Hotel> findBySlug(String slug);

    List<Hotel> findByCityIgnoreCase(String city);

    @Query("SELECT h FROM Hotel h WHERE " +
            "(:dest IS NULL OR LOWER(h.name) LIKE LOWER(CONCAT('%', :dest, '%')) " +
            "OR LOWER(h.slug) = LOWER(:dest) " +
            "OR LOWER(h.city) LIKE LOWER(CONCAT('%', :dest, '%')) " +
            "OR LOWER(h.area) LIKE LOWER(CONCAT('%', :dest, '%')) " +
            "OR LOWER(h.province) LIKE LOWER(CONCAT('%', :dest, '%')))")
    List<Hotel> searchByDestination(@Param("dest") String dest);
}