package com.projekan.airport_transfer_service.repository;

import com.projekan.airport_transfer_service.model.AirportTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AirportTransferRepository extends JpaRepository<AirportTransfer, Long> {
    List<AirportTransfer> findByAirportNameIgnoreCase(String airportName);
    List<AirportTransfer> findByAirportNameIgnoreCaseAndVehicleTypeIgnoreCase(String airportName, String vehicleType);
}