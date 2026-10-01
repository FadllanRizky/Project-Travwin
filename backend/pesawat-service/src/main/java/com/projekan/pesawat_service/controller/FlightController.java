package com.projekan.pesawat_service.controller;

import com.projekan.pesawat_service.model.FlightSchedule;
import com.projekan.pesawat_service.repository.FlightScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/v1/flights")
public class FlightController {

    @Autowired
    private FlightScheduleRepository scheduleRepository;

    @GetMapping("/search")
    public ResponseEntity<List<FlightSchedule>> searchFlights(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String date) {

        String o = normalize(origin);
        String d = normalize(destination);

        List<FlightSchedule> results;

        if (o != null && d != null) {
            results = scheduleRepository.searchByText(o, d);
        } else if (o != null) {
            results = scheduleRepository.findAll().stream()
                    .filter(f -> matchesOrigin(f, o))
                    .toList();
        } else if (d != null) {
            results = scheduleRepository.findAll().stream()
                    .filter(f -> matchesDestination(f, d))
                    .toList();
        } else {
            results = scheduleRepository.findAll();
        }

        if (date != null && !date.isBlank()) {
            try {
                LocalDate departureDate = LocalDate.parse(date);
                List<FlightSchedule> sameDay = results.stream()
                        .filter(f -> f.getDepartureTime() != null
                                && f.getDepartureTime().toLocalDate().equals(departureDate))
                        .toList();
                if (!sameDay.isEmpty()) {
                    results = sameDay;
                } else {
                    results = results.stream()
                            .filter(f -> f.getDepartureTime() != null
                                    && !f.getDepartureTime().toLocalDate().isBefore(departureDate))
                            .toList();
                }
            } catch (DateTimeParseException ignored) {
            }
        }

        return ResponseEntity.ok(results);
    }

    @PostMapping("/schedules")
    public ResponseEntity<FlightSchedule> createSchedule(@RequestBody FlightSchedule schedule) {
        return ResponseEntity.ok(scheduleRepository.save(schedule));
    }

    private static String normalize(String value) {
        if (value == null) return null;
        String trimmed = value.trim().toUpperCase(Locale.ROOT);
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static boolean matchesOrigin(FlightSchedule f, String o) {
        return o.equals(f.getOriginAirportCode())
                || o.equalsIgnoreCase(f.getOriginCity())
                || o.equalsIgnoreCase(f.getOriginAirportName());
    }

    private static boolean matchesDestination(FlightSchedule f, String d) {
        return d.equals(f.getDestinationAirportCode())
                || d.equalsIgnoreCase(f.getDestinationCity())
                || d.equalsIgnoreCase(f.getDestinationAirportName());
    }
}