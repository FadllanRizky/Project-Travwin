package com.projekan.airport_transfer_service.controller;

import com.projekan.airport_transfer_service.model.AirportTransfer;
import com.projekan.airport_transfer_service.repository.AirportTransferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/airport-transfers")
public class AirportTransferController {

    @Autowired
    private AirportTransferRepository transferRepository;

    @GetMapping("/search")
    public ResponseEntity<List<AirportTransfer>> searchTransfers(
            @RequestParam String airport,
            @RequestParam(required = false) String vehicleType) {
        if (vehicleType != null && !vehicleType.trim().isEmpty()) {
            return ResponseEntity.ok(
                    transferRepository.findByAirportNameIgnoreCaseAndVehicleTypeIgnoreCase(airport, vehicleType)
            );
        }
        return ResponseEntity.ok(transferRepository.findByAirportNameIgnoreCase(airport));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AirportTransfer> getTransferById(@PathVariable Long id) {
        return transferRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<AirportTransfer>> getAllTransfers() {
        return ResponseEntity.ok(transferRepository.findAll());
    }

    @PostMapping("/vehicles")
    public ResponseEntity<AirportTransfer> createTransfer(@RequestBody AirportTransfer transfer) {
        return ResponseEntity.ok(transferRepository.save(transfer));
    }
}