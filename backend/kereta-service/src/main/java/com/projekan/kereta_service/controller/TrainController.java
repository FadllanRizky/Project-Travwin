package com.projekan.kereta_service.controller;

import com.projekan.kereta_service.model.TrainSchedule;
import com.projekan.kereta_service.model.TrainStation;
import com.projekan.kereta_service.repository.TrainScheduleRepository;
import com.projekan.kereta_service.repository.TrainStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/trains")
public class TrainController {

    @Autowired
    private TrainScheduleRepository scheduleRepository;

    @Autowired
    private TrainStationRepository stationRepository;

    private static final Set<String> VALID_CLASSES = Set.of("EKSEKUTIF", "BISNIS", "EKONOMI");

    @GetMapping("/search")
    public ResponseEntity<?> searchTrains(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String trainClass) {

        LocalDate travelDate = null;
        if (date != null && !date.isBlank()) {
            try {
                travelDate = LocalDate.parse(date.trim());
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "INVALID_DATE",
                        "message", "Format tanggal tidak valid (gunakan YYYY-MM-DD).",
                        "field", "date"));
            }
            if (travelDate.isBefore(LocalDate.now(ZoneId.of("Asia/Jakarta")))) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "DATE_PAST",
                        "message", "Tanggal keberangkatan tidak boleh di masa lalu.",
                        "field", "date"));
            }
        }

        String cls = trainClass != null && !trainClass.isBlank() ? trainClass.trim().toUpperCase() : null;
        if (cls != null && !VALID_CLASSES.contains(cls)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "INVALID_CLASS",
                    "message", "Kelas kereta harus EKSEKUTIF, BISNIS, atau EKONOMI.",
                    "field", "trainClass"));
        }

        LocalDateTime start = LocalDateTime.of(1900, 1, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(9999, 12, 31, 23, 59, 59);
        if (travelDate != null) {
            start = travelDate.atStartOfDay();
            end = travelDate.plusDays(1).atStartOfDay();
        }

        String originQ = origin != null && !origin.isBlank() ? origin.trim() : "";
        String destQ = destination != null && !destination.isBlank() ? destination.trim() : "";
        String clsQ = cls != null ? cls : "";

        List<TrainSchedule> results = scheduleRepository.searchTrains(originQ, destQ, clsQ, start, end);
        results.sort(Comparator
                .comparing(TrainSchedule::getPrice)
                .thenComparing(TrainSchedule::getDepartureTime)
                .thenComparing(TrainSchedule::getTrainNumber));

        return ResponseEntity.ok(results);
    }

    @GetMapping("/stations")
    public ResponseEntity<List<TrainStation>> getStations() {
        return ResponseEntity.ok(stationRepository.findAllByOrderByCityAscNameAsc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainSchedule> getScheduleById(@PathVariable Long id) {
        return scheduleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<TrainSchedule>> getAllTrains() {
        return ResponseEntity.ok(scheduleRepository.findAll());
    }

    @PostMapping("/schedules")
    public ResponseEntity<TrainSchedule> createSchedule(@RequestBody TrainSchedule schedule) {
        if (schedule.getStatus() == null) schedule.setStatus("AVAILABLE");
        return ResponseEntity.ok(scheduleRepository.save(schedule));
    }
}