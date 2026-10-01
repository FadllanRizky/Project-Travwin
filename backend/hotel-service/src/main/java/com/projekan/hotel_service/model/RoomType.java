package com.projekan.hotel_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "room_types", uniqueConstraints = @UniqueConstraint(columnNames = {"hotel_id", "name"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hotel_id", nullable = false)
    private Long hotelId;

    @Column(nullable = false)
    private String name;

    private String category;

    private String bedType;

    private Integer maxGuests;

    private Integer sizeSqm;

    private Integer roomCount;

    private Integer availableRooms;

    @Column(nullable = false)
    private BigDecimal basePricePerNight;

    @Column(columnDefinition = "text")
    private String amenities;
}