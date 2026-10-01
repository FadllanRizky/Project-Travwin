package com.projekan.travel_service.controller;

import com.projekan.travel_service.model.TravelSchedule;
import com.projekan.travel_service.repository.TravelScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/travel")
public class TravelController {

    @Autowired
    private TravelScheduleRepository scheduleRepository;

    @GetMapping("/search")
    public ResponseEntity<List<TravelSchedule>> searchTravel(
            @RequestParam String origin,
            @RequestParam String destination) {
        return ResponseEntity.ok(
                scheduleRepository.findByOriginCityIgnoreCaseAndDestinationCityIgnoreCase(origin, destination)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TravelSchedule> getScheduleById(@PathVariable Long id) {
        return scheduleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<TravelSchedule>> getAllTravel() {
        return ResponseEntity.ok(scheduleRepository.findAll());
    }

    @PostMapping("/schedules")
    public ResponseEntity<TravelSchedule> createSchedule(@RequestBody TravelSchedule schedule) {
        return ResponseEntity.ok(scheduleRepository.save(schedule));
    }
}
