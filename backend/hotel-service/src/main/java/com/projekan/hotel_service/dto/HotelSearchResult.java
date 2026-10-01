package com.projekan.hotel_service.dto;

import com.projekan.hotel_service.model.Hotel;
import com.projekan.hotel_service.model.RoomType;

import java.math.BigDecimal;
import java.util.List;

public record HotelSearchResult(
        Long id,
        String slug,
        String name,
        String description,
        String address,
        String city,
        String province,
        String area,
        String propertyType,
        BigDecimal rating,
        Integer reviewCount,
        String facilities,
        String palette,
        String sceneType,
        Integer popularity,
        List<RoomType> rooms,
        BigDecimal minPricePerNight,
        Integer totalAvailableRooms
) {
    public static HotelSearchResult from(Hotel h, List<RoomType> rooms, BigDecimal minPrice, Integer totalAvailable) {
        return new HotelSearchResult(
                h.getId(), h.getSlug(), h.getName(), h.getDescription(), h.getAddress(),
                h.getCity(), h.getProvince(), h.getArea(), h.getPropertyType(),
                h.getRating(), h.getReviewCount(), h.getFacilities(),
                h.getPalette(), h.getSceneType(), h.getPopularity(),
                rooms, minPrice, totalAvailable
        );
    }
}