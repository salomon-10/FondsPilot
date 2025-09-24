package com.fondspilot.controller;

import com.fondspilot.model.Account;
import com.fondspilot.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/account")
@CrossOrigin
public class AccountController {

    @Autowired
    private AccountRepository accountRepo;

    // Récupérer le solde
    @GetMapping("/{userId}/balance")
    public BigDecimal getBalance(@PathVariable Long userId) {
        Account acc = accountRepo.findByUserId(userId);
        if(acc != null) return acc.getBalance();
        throw new RuntimeException("Compte non trouvé");
    }
}
