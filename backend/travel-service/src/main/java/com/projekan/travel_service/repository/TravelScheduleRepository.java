package com.projekan.travel_service.repository;

import com.projekan.travel_service.model.TravelSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TravelScheduleRepository extends JpaRepository<TravelSchedule, Long> {
    List<TravelSchedule> findByOriginCityIgnoreCaseAndDestinationCityIgnoreCase(String originCity, String destinationCity);
}
