package com.projekan.pesawat_service.repository;

import com.projekan.pesawat_service.model.FlightSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FlightScheduleRepository extends JpaRepository<FlightSchedule, Long> {

    List<FlightSchedule> findByOriginAirportIdAndDestinationAirportId(Integer origin, Integer destination);

    List<FlightSchedule> findByOriginAirportCodeAndDestinationAirportCode(String origin, String destination);

    @Query("SELECT f FROM FlightSchedule f WHERE " +
            "(:origin IS NULL OR LOWER(f.originAirportCode) = LOWER(:origin) OR LOWER(f.originCity) = LOWER(:origin) OR LOWER(f.originAirportName) = LOWER(:origin)) AND " +
            "(:destination IS NULL OR LOWER(f.destinationAirportCode) = LOWER(:destination) OR LOWER(f.destinationCity) = LOWER(:destination) OR LOWER(f.destinationAirportName) = LOWER(:destination))")
    List<FlightSchedule> searchByText(@Param("origin") String origin, @Param("destination") String destination);
}