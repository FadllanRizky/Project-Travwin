package com.projekan.whoosh_service.repository;

import com.projekan.whoosh_service.model.WhooshSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WhooshScheduleRepository extends JpaRepository<WhooshSchedule, Long> {
    List<WhooshSchedule> findByOriginStationIgnoreCaseAndDestinationStationIgnoreCase(String origin, String destination);
}
