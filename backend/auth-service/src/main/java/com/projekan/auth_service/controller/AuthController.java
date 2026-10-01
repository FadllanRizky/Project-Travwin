package com.projekan.auth_service.controller;

import com.projekan.auth_service.model.UserCredential;
import com.projekan.auth_service.repository.UserCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserCredentialRepository repository;

    private static final Pattern EMAIL_DOMAIN_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9._%+-]+@(gmail\\.com|yahoo\\.com|yahoo\\.co\\.id|outlook\\.com)$",
            Pattern.CASE_INSENSITIVE
    );

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserCredential credential) {
        String username = credential.getUsername() != null ? credential.getUsername().trim() : "";
        if (username.length() < 3) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "USERNAME_TOO_SHORT",
                    "field", "username",
                    "message", "Username minimal 3 karakter."
            ));
        }

        if (repository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "USERNAME_EXISTS",
                    "field", "username",
                    "message", "Username sudah digunakan. Silakan pilih username lain."
            ));
        }

        String email = credential.getEmail() != null ? credential.getEmail().trim().toLowerCase() : "";
        if (!EMAIL_DOMAIN_PATTERN.matcher(email).matches()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "EMAIL_DOMAIN_INVALID",
                    "field", "email",
                    "message", "Email wajib menggunakan domain Gmail, Yahoo, atau Outlook."
            ));
        }

        if (repository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "EMAIL_EXISTS",
                    "field", "email",
                    "message", "Email ini sudah terdaftar di sistem TravWin. Data email bersifat sensitif dan tidak boleh duplikat."
            ));
        }

        String pw = credential.getPasswordHash() != null ? credential.getPasswordHash() : "";
        if (pw.length() < 7
                || !Pattern.compile("[A-Z]").matcher(pw).find()
                || !Pattern.compile("[a-z]").matcher(pw).find()
                || !Pattern.compile("[0-9]").matcher(pw).find()
                || !Pattern.compile("[^A-Za-z0-9]").matcher(pw).find()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "PASSWORD_REQUIREMENTS_NOT_MET",
                    "field", "password",
                    "message", "Password harus minimal 7 karakter, serta mengandung huruf kapital, huruf kecil, angka, dan simbol."
            ));
        }

        credential.setUsername(username);
        credential.setEmail(email);
        UserCredential saved = repository.save(credential);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return repository.findByUsername(request.getUsername())
                .filter(u -> u.getPasswordHash() != null && u.getPasswordHash().equals(request.getPassword())
                        && Boolean.TRUE.equals(u.getIsActive()))
                .map(u -> ResponseEntity.ok(wrapToken(u)))
                .orElseGet(() -> ResponseEntity.status(401).body(java.util.Map.of("error", "Invalid username or password")));
    }

    @GetMapping("/by-username/{username}")
    public ResponseEntity<?> getByUsername(@PathVariable String username) {
        return repository.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private java.util.Map<String, Object> wrapToken(UserCredential u) {
        return java.util.Map.of(
                "token", "JWT-" + u.getUsername() + "-" + u.getUserId(),
                "userId", u.getUserId(),
                "username", u.getUsername(),
                "email", u.getEmail()
        );
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}