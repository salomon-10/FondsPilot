package com.fondspilot.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name="accounts")
public class Account {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name="user_id")
    private User user;

    private BigDecimal balance = BigDecimal.ZERO;

    // getters & setters
}
