package com.projekan.payment_service.controller;

import com.projekan.payment_service.model.Payment;
import com.projekan.payment_service.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    private static final Map<String, String> BANK_PREFIXES = Map.of(
            "BCA", "BCA",
            "MANDIRI", "MDR",
            "BNI", "BNI",
            "BRI", "BRI",
            "BTN", "BTN",
            "PERMATA", "PMT",
            "CIMB", "CMB",
            "DANAMON", "DBN",
            "MAYBANK", "MYB"
    );

    @PostMapping("/pay")
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        if (payment.getCreatedAt() == null) {
            payment.setCreatedAt(LocalDateTime.now());
        }
        String prefix = methodPrefix(payment.getPaymentMethod());
        String code = prefix + "-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmm"))
                + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        payment.setPaymentCode(code);
        return ResponseEntity.ok(paymentRepository.save(payment));
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<Payment> confirmPayment(@PathVariable Long id) {
        return paymentRepository.findById(id)
                .map(payment -> {
                    payment.setStatus("SUCCESS");
                    payment.setPaidAt(LocalDateTime.now());
                    return ResponseEntity.ok(paymentRepository.save(payment));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Payment>> getPaymentsByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentRepository.findByBookingId(bookingId));
    }

    @GetMapping("/{code}")
    public ResponseEntity<Payment> getPaymentByCode(@PathVariable String code) {
        return paymentRepository.findByPaymentCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    private String methodPrefix(String method) {
        if (method == null) return "PAY";
        String upper = method.toUpperCase();
        if (upper.contains("QRIS")) return "QRIS";
        if (upper.contains("CARD") || upper.contains("CREDIT")) return "CC";
        String bankKey = BANK_PREFIXES.keySet().stream()
                .filter(upper::contains)
                .findFirst()
                .orElse(null);
        return bankKey != null ? BANK_PREFIXES.get(bankKey) : "BANK";
    }
}