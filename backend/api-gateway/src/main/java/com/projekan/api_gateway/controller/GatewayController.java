package com.projekan.api_gateway.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class GatewayController {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gateway.hosts:}")
    private String gatewayHosts;

    private final Map<String, String> hosts = new HashMap<>();

    @PostConstruct
    void parseHosts() {
        for (String entry : gatewayHosts.split(",")) {
            if (entry.isEmpty()) {
                continue;
            }
            String[] parts = entry.split("=");
            if (parts.length == 2) {
                hosts.put(parts[0].trim(), parts[1].trim());
            }
        }
    }

    private static final Map<String, Integer> SERVICE_PORTS = Map.ofEntries(
            Map.entry("auth", 8082),
            Map.entry("users", 8083),
            Map.entry("hotels", 8084),
            Map.entry("flights", 8085),
            Map.entry("trains", 8086),
            Map.entry("whoosh", 8087),
            Map.entry("travel", 8088),
            Map.entry("rentals", 8089),
            Map.entry("airport-transfers", 8090),
            Map.entry("bookings", 8091),
            Map.entry("payments", 8092)
    );

    private static final Map<String, String> SERVICE_SEGMENTS = Map.ofEntries(
            Map.entry("auth", "auth"),
            Map.entry("users", "users"),
            Map.entry("hotels", "hotels"),
            Map.entry("flights", "flights"),
            Map.entry("trains", "trains"),
            Map.entry("whoosh", "whoosh"),
            Map.entry("travel", "travel"),
            Map.entry("rentals", "rentals"),
            Map.entry("airport-transfers", "airport-transfers"),
            Map.entry("bookings", "bookings"),
            Map.entry("payments", "payments")
    );

    @RequestMapping("/api/v1/{service}/**")
    public ResponseEntity<byte[]> forward(HttpServletRequest request) {
        String path = request.getRequestURI();
        String[] parts = path.split("/");
        if (parts.length < 4) {
            return ResponseEntity.badRequest().body("Invalid gateway path".getBytes());
        }
        String service = parts[3];
        Integer port = SERVICE_PORTS.get(service);
        if (port == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(("Unknown service: " + service).getBytes());
        }

        String apiPrefix = "/api/v1/" + SERVICE_SEGMENTS.get(service);
        int idx = path.indexOf(apiPrefix);
        String remainder = idx >= 0 ? path.substring(idx + apiPrefix.length()) : "";

        String target = "http://" + hosts.getOrDefault(service, "localhost") + ":" + port + apiPrefix + remainder;
        String query = request.getQueryString();
        if (query != null && !query.isEmpty()) {
            target = target + "?" + query;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            if (request.getContentType() != null) {
                headers.setContentType(MediaType.parseMediaType(request.getContentType()));
            }
            byte[] body;
            try {
                body = request.getInputStream().readAllBytes();
            } catch (java.io.IOException e) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body(("Gateway error reading request: " + e.getMessage()).getBytes());
            }
            HttpMethod method = HttpMethod.valueOf(request.getMethod().toUpperCase());
            HttpEntity<byte[]> entity = new HttpEntity<>(body, headers);

            java.net.URI uri = java.net.URI.create(target);
            ResponseEntity<byte[]> response = restTemplate.exchange(uri, method, entity, byte[].class);
            HttpHeaders responseHeaders = new HttpHeaders();
            if (response.getHeaders().getContentType() != null) {
                responseHeaders.setContentType(response.getHeaders().getContentType());
            }
            return new ResponseEntity<>(response.getBody(), responseHeaders, response.getStatusCode());
        } catch (HttpStatusCodeException e) {
            HttpHeaders responseHeaders = new HttpHeaders();
            MediaType contentType = e.getResponseHeaders() != null ? e.getResponseHeaders().getContentType() : null;
            if (contentType != null) {
                responseHeaders.setContentType(contentType);
            }
            return new ResponseEntity<>(e.getResponseBodyAsByteArray(), responseHeaders,
                    HttpStatusCode.valueOf(e.getStatusCode().value()));
        } catch (RestClientException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(("Gateway error: " + e.getMessage()).getBytes());
        }
    }
}