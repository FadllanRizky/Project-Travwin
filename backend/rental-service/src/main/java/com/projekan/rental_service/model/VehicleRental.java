package com.projekan.rental_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vehicle_rentals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleRental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_type", nullable = false)
    private String vehicleType; // CAR, MOTORCYCLE

    @Column(name = "brand_and_model", nullable = false)
    private String brandAndModel; // Contoh: Toyota Avanza, Honda Vario 160

    @Column(nullable = false)
    private String transmission; // MANUAL, AUTOMATIC

    @Column(name = "passenger_capacity", nullable = false)
    private Integer passengerCapacity;

    @Column(nullable = false)
    private String city;

    @Column(name = "price_per_day", nullable = false)
    private BigDecimal pricePerDay;

    @Column(name = "with_driver", nullable = false)
    private Boolean withDriver;

    @Builder.Default
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @Column(name = "image_url")
    private String imageUrl;

    private BigDecimal rating;
}
