package com.projekan.rental_service.repository;

import com.projekan.rental_service.model.VehicleRental;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehicleRentalRepository extends JpaRepository<VehicleRental, Long> {
    List<VehicleRental> findByCityIgnoreCase(String city);
    List<VehicleRental> findByCityIgnoreCaseAndVehicleTypeIgnoreCase(String city, String vehicleType);
}
