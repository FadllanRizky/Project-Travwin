package com.projekan.hotel_service.repository;

import com.projekan.hotel_service.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {

    List<RoomType> findByHotelIdOrderByBasePricePerNightAsc(Long hotelId);

    List<RoomType> findByHotelIdAndMaxGuestsGreaterThanEqualOrderByBasePricePerNightAsc(Long hotelId, Integer maxGuests);
}