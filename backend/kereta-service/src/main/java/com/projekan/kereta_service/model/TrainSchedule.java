package com.projekan.kereta_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "train_schedules",
        uniqueConstraints = @UniqueConstraint(columnNames = {"train_number", "departure_time"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TrainSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "train_name", nullable = false)
    private String trainName;

    @Column(name = "train_number", nullable = false)
    private String trainNumber;

    @Column(name = "train_class", nullable = false)
    private String trainClass; // EKSEKUTIF, BISNIS, EKONOMI

    @Column(name = "origin_station", nullable = false)
    private String originStation;

    @Column(name = "origin_station_code", nullable = false)
    private String originStationCode;

    @Column(name = "origin_city", nullable = false)
    private String originCity;

    @Column(name = "destination_station", nullable = false)
    private String destinationStation;

    @Column(name = "destination_station_code", nullable = false)
    private String destinationStationCode;

    @Column(name = "destination_city", nullable = false)
    private String destinationCity;

    @Column(name = "train_category", nullable = false)
    private String trainCategory; // LOKAL, ANTARKOTA

    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departureTime;

    @Column(name = "arrival_time", nullable = false)
    private LocalDateTime arrivalTime;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Builder.Default
    @Column(nullable = false)
    private String status = "AVAILABLE";
}