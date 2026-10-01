package com.projekan.pesawat_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "flight_schedules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FlightSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "flight_number", nullable = false)
    private String flightNumber;

    // Denormalized airline info
    @Column(name = "airline_code")
    private String airlineCode;

    @Column(name = "airline_name")
    private String airlineName;

    // Denormalized airplane info
    @Column(name = "airplane_model")
    private String airplaneModel;

    @Column(name = "seat_class")
    private String seatClass;

    @Column(name = "available_seats")
    private Integer availableSeats;

    // Denormalized origin airport
    @Column(name = "origin_airport_id")
    private Integer originAirportId;

    @Column(name = "origin_airport_code")
    private String originAirportCode;

    @Column(name = "origin_airport_name")
    private String originAirportName;

    @Column(name = "origin_city")
    private String originCity;

    // Denormalized destination airport
    @Column(name = "destination_airport_id")
    private Integer destinationAirportId;

    @Column(name = "destination_airport_code")
    private String destinationAirportCode;

    @Column(name = "destination_airport_name")
    private String destinationAirportName;

    @Column(name = "destination_city")
    private String destinationCity;

    // Schedule
    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departureTime;

    @Column(name = "arrival_time", nullable = false)
    private LocalDateTime arrivalTime;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Builder.Default
    private String status = "SCHEDULED";
}
