package com.fondspilot.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="users")
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique=true)
    private String email;

    private String password;

    @Column(name="google_id")
    private String googleId;

    private String picture;

    @Column(name="created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // getters & setters
}
