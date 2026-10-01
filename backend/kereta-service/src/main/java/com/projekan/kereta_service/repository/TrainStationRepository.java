package com.projekan.kereta_service.repository;

import com.projekan.kereta_service.model.TrainStation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrainStationRepository extends JpaRepository<TrainStation, Long> {
    List<TrainStation> findAllByOrderByCityAscNameAsc();
}