package com.projekan.whoosh_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "whoosh_schedules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WhooshSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "train_number", nullable = false)
    private String trainNumber; // contoh: G1122

    @Column(name = "origin_station", nullable = false)
    private String originStation; // Halim, Karawang, Padalarang, Tegalluar

    @Column(name = "destination_station", nullable = false)
    private String destinationStation;

    @Column(name = "seat_class", nullable = false)
    private String seatClass; // FIRST_CLASS, BUSINESS_CLASS, PREMIUM_ECONOMY

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
