package com.projekan.user_service.controller;

import com.projekan.user_service.model.User;
import com.projekan.user_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private static final Pattern NAME_CHARS_PATTERN = Pattern.compile("^[a-zA-Z\\s]{3,}$");
    private static final Pattern VOWEL_PATTERN = Pattern.compile("[aiueoAIUEO]");
    private static final Pattern EMAIL_DOMAIN_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9._%+-]+@(gmail\\.com|yahoo\\.com|yahoo\\.co\\.id|outlook\\.com)$",
            Pattern.CASE_INSENSITIVE
    );

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        String fullName = user.getFullName() != null ? user.getFullName().trim() : "";
        if (fullName.length() < 3) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "NAME_TOO_SHORT",
                    "field", "fullName",
                    "message", "Nama lengkap minimal 3 huruf."
            ));
        }
        if (!NAME_CHARS_PATTERN.matcher(fullName).matches()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "NAME_INVALID_CHARS",
                    "field", "fullName",
                    "message", "Nama lengkap hanya boleh berisi huruf alfabet (tanpa angka atau simbol)."
            ));
        }
        if (!VOWEL_PATTERN.matcher(fullName).find()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "NAME_NO_VOWELS",
                    "field", "fullName",
                    "message", "Nama lengkap harus mengandung huruf vokal (a, i, u, e, o)."
            ));
        }

        String email = user.getEmail() != null ? user.getEmail().trim().toLowerCase() : "";
        if (!EMAIL_DOMAIN_PATTERN.matcher(email).matches()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "EMAIL_DOMAIN_INVALID",
                    "field", "email",
                    "message", "Email wajib menggunakan domain Gmail, Yahoo, atau Outlook (cth: @gmail.com, @yahoo.com, @outlook.com)."
            ));
        }

        String phone = user.getPhoneNumber() != null ? user.getPhoneNumber().trim() : "";
        String phoneDigits = phone.replaceAll("\\D", "");
        if (phoneDigits.length() < 8 || phoneDigits.length() > 13) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "PHONE_INVALID_LENGTH",
                    "field", "phoneNumber",
                    "message", "Nomor telepon harus antara 8 hingga 13 digit angka."
            ));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "EMAIL_EXISTS",
                    "field", "email",
                    "message", "Email ini sudah terdaftar di sistem TravWin. Data email bersifat sensitif dan tidak boleh duplikat."
            ));
        }

        if (userRepository.existsByPhoneNumber(phone)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "PHONE_EXISTS",
                    "field", "phoneNumber",
                    "message", "Nomor telepon ini sudah terdaftar di sistem TravWin. Data nomor telepon bersifat sensitif dan tidak boleh duplikat."
            ));
        }

        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhoneNumber(phone);
        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}