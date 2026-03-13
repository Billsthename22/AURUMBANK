package com.aurum.backend;

import com.aurum.backend.entity.Admin;
import com.aurum.backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin") // Note the different path: /api/admin
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<Admin> admin = adminRepository.findByEmail(email);

        if (admin.isPresent() && admin.get().getPassword().equals(password)) {
            return ResponseEntity.ok(admin.get());
        }

        return ResponseEntity.status(401).body(Map.of("error", "Invalid admin credentials"));
    }
}