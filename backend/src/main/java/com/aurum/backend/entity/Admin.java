package com.aurum.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String email;
    private String password;

    // --- GETTERS (The Controller needs these) ---
    
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // --- SETTERS (The Database needs these) ---

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }
}