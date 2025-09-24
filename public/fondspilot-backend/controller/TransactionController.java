package com.fondspilot.controller;

import com.fondspilot.model.Account;
import com.fondspilot.model.Transaction;
import com.fondspilot.repository.AccountRepository;
import com.fondspilot.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepo;

    @Autowired
    private AccountRepository accountRepo;

    // Lister toutes les transactions d'un user
    @GetMapping("/{userId}")
    public List<Transaction> getTransactions(@PathVariable Long userId){
        return transactionRepo.findByAccountUserId(userId);
    }

    // Ajouter une transaction : deposit, withdraw, save
    @PostMapping("/add")
    public Transaction addTransaction(@RequestBody Transaction tx) {
        Account acc = accountRepo.findByUserId(tx.getAccount().getUser().getId());
        if(acc == null) throw new RuntimeException("Compte non trouvé");

        BigDecimal amt = tx.getAmount();
        if(tx.getType().equalsIgnoreCase("withdraw") && acc.getBalance().compareTo(amt) < 0) {
            throw new RuntimeException("Solde insuffisant");
        }

        // Ajuster le solde
        switch(tx.getType().toLowerCase()){
            case "deposit":
            case "save":
                acc.setBalance(acc.getBalance().add(amt));
                break;
            case "withdraw":
                acc.setBalance(acc.getBalance().subtract(amt));
                break;
            default:
                throw new RuntimeException("Type de transaction inconnu");
        }

        accountRepo.save(acc);
        tx.setCreatedAt(LocalDateTime.now());
        return transactionRepo.save(tx);
    }
}
