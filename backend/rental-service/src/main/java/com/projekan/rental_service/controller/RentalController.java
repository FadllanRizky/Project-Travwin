package com.projekan.rental_service.controller;

import com.projekan.rental_service.model.VehicleRental;
import com.projekan.rental_service.repository.VehicleRentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rentals")
public class RentalController {

    @Autowired
    private VehicleRentalRepository rentalRepository;

    @GetMapping("/search")
    public ResponseEntity<List<VehicleRental>> searchVehicles(
            @RequestParam String city,
            @RequestParam(required = false) String vehicleType) {
        if (vehicleType != null && !vehicleType.trim().isEmpty()) {
            return ResponseEntity.ok(
                    rentalRepository.findByCityIgnoreCaseAndVehicleTypeIgnoreCase(city, vehicleType)
            );
        }
        return ResponseEntity.ok(rentalRepository.findByCityIgnoreCase(city));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleRental> getVehicleById(@PathVariable Long id) {
        return rentalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<VehicleRental>> getAllVehicles() {
        return ResponseEntity.ok(rentalRepository.findAll());
    }

    @PostMapping("/vehicles")
    public ResponseEntity<VehicleRental> createVehicle(@RequestBody VehicleRental vehicle) {
        return ResponseEntity.ok(rentalRepository.save(vehicle));
    }
}
