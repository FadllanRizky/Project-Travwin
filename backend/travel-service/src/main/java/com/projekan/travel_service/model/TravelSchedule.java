package com.projekan.travel_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "travel_schedules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TravelSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "operator_name", nullable = false)
    private String operatorName; // DayTrans, CitiTrans, Baraya, dll.

    @Column(name = "origin_city", nullable = false)
    private String originCity; // Jakarta, Bandung, Semarang, dll.

    @Column(name = "departure_point", nullable = false)
    private String departurePoint; // Pool Blora, Pool Central Park, dll.

    @Column(name = "destination_city", nullable = false)
    private String destinationCity;

    @Column(name = "drop_point", nullable = false)
    private String dropPoint; // Pool Dipatiukur, Pool Pasteur, dll.

    @Column(name = "vehicle_type", nullable = false)
    private String vehicleType; // Toyota HiAce Premio, Isuzu Elf Executive

    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departureTime;

    @Column(name = "arrival_time", nullable = false)
    private LocalDateTime arrivalTime;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    private String status;
}
