package com.projekan.kereta_service.repository;

import com.projekan.kereta_service.model.TrainSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TrainScheduleRepository extends JpaRepository<TrainSchedule, Long> {

    @Query("SELECT t FROM TrainSchedule t WHERE " +
            "(:origin = '' OR LOWER(t.originStation) LIKE LOWER(CONCAT('%', :origin, '%')) " +
            "OR LOWER(t.originCity) LIKE LOWER(CONCAT('%', :origin, '%')) " +
            "OR LOWER(t.originStationCode) = LOWER(:origin)) " +
            "AND (:destination = '' OR LOWER(t.destinationStation) LIKE LOWER(CONCAT('%', :destination, '%')) " +
            "OR LOWER(t.destinationCity) LIKE LOWER(CONCAT('%', :destination, '%')) " +
            "OR LOWER(t.destinationStationCode) = LOWER(:destination)) " +
            "AND (:trainClass = '' OR t.trainClass = :trainClass) " +
            "AND t.departureTime >= :start AND t.departureTime < :end")
    List<TrainSchedule> searchTrains(
            @Param("origin") String origin,
            @Param("destination") String destination,
            @Param("trainClass") String trainClass,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}