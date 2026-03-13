package com.aurum.backend.repository;

import com.aurum.backend.entity.User;
import com.aurum.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletResponse response) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        try {
            Optional<User> user = userRepository.findByEmail(email);

            if (user.isPresent()) {
                String dbPassword = user.get().getPassword();
                
                if (dbPassword != null && dbPassword.trim().equals(password.trim())) {
                    // 1. Generate a dummy token for now
                    String token = "AURUM_SESSION_" + UUID.randomUUID().toString();

                    // 2. Set the HttpOnly Cookie
                    ResponseCookie cookie = ResponseCookie.from("auth_token", token)
                        .httpOnly(true)
                        .secure(false) // Set to true in production
                        .path("/")
                        .maxAge(3600)
                        .sameSite("Lax")
                        .build();

                    return ResponseEntity.ok()
                        .header(HttpHeaders.SET_COOKIE, cookie.toString())
                        .body(Map.of(
                            "name", user.get().getFullName(),
                            "email", user.get().getEmail()
                        ));
                }
            }
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Database Error"));
        }
    }
}