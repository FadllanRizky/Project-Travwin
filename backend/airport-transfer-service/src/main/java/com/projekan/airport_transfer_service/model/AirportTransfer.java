package com.projekan.airport_transfer_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "airport_transfers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AirportTransfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "airport_name", nullable = false)
    private String airportName; // Soekarno-Hatta, Juanda, Ngurah Rai, dll.

    @Column(name = "pickup_location", nullable = false)
    private String pickupLocation;

    @Column(name = "dropoff_location", nullable = false)
    private String dropoffLocation;

    @Column(name = "vehicle_type", nullable = false)
    private String vehicleType; // SEDAN, MPV, MINIVAN

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "available_at", nullable = false)
    private LocalDateTime availableAt;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;
}