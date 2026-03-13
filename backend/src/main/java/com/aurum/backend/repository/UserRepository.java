package com.aurum.backend.repository;

import com.aurum.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID; // Import UUID here too

// Change the second parameter from Integer to UUID
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
}