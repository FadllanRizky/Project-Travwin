package com.projekan.whoosh_service.controller;

import com.projekan.whoosh_service.model.WhooshSchedule;
import com.projekan.whoosh_service.repository.WhooshScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/whoosh")
public class WhooshController {

    @Autowired
    private WhooshScheduleRepository scheduleRepository;

    @GetMapping("/search")
    public ResponseEntity<List<WhooshSchedule>> searchWhoosh(
            @RequestParam String origin,
            @RequestParam String destination) {
        return ResponseEntity.ok(
                scheduleRepository.findByOriginStationIgnoreCaseAndDestinationStationIgnoreCase(origin, destination)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<WhooshSchedule> getScheduleById(@PathVariable Long id) {
        return scheduleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<WhooshSchedule>> getAllWhoosh() {
        return ResponseEntity.ok(scheduleRepository.findAll());
    }

    @PostMapping("/schedules")
    public ResponseEntity<WhooshSchedule> createSchedule(@RequestBody WhooshSchedule schedule) {
        return ResponseEntity.ok(scheduleRepository.save(schedule));
    }
}
