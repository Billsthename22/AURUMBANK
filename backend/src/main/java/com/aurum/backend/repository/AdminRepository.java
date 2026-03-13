package com.aurum.backend.repository;

import com.aurum.backend.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
    
    // This allows your Login method to find the specific admin by their email
    // Spring Boot generates the SQL: "SELECT * FROM admins WHERE email = ?"
    Optional<Admin> findByEmail(String email);
}