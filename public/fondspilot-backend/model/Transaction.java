package com.fondspilot.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="transactions")
public class Transaction {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="account_id")
    private Account account;

    private String type; // deposit, withdraw, save

    private BigDecimal amount;

    private String origin;

    private String reference;

    private LocalDateTime createdAt = LocalDateTime.now();

    // getters & setters
}
