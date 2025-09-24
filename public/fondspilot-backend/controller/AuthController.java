package com.fondspilot.controller;

import com.fondspilot.model.User;
import com.fondspilot.repository.UserRepository;
import com.fondspilot.repository.AccountRepository;
import com.fondspilot.model.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class AuthController {
 
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private AccountRepository accountRepo;

    // Auth avec email/password
    @PostMapping("/login")
    public User login(@RequestBody User request) {
        Optional<User> userOpt = userRepo.findByEmail(request.getEmail());
        if(userOpt.isPresent()) {
            User user = userOpt.get();
            if(user.getPassword().equals(request.getPassword())) {
                return user;
            }
        }
        throw new RuntimeException("Email ou mot de passe invalide");
    }

    // Auth Google
    @PostMapping("/google")
    public User googleLogin(@RequestBody User request) {
        Optional<User> userOpt = userRepo.findByGoogleId(request.getGoogleId());
        if(userOpt.isPresent()) {
            return userOpt.get();
        } else {
            // Nouveau user
            User newUser = new User();
            newUser.setName(request.getName());
            newUser.setEmail(request.getEmail());
            newUser.setGoogleId(request.getGoogleId());
            newUser.setPicture(request.getPicture());
            userRepo.save(newUser);

            // Création compte associé
            Account acc = new Account();
            acc.setUser(newUser);
            acc.setBalance(java.math.BigDecimal.ZERO);
            accountRepo.save(acc);

            return newUser;
        }
    }

    // Inscription classique
    @PostMapping("/signup")
    public User signup(@RequestBody User request) {
        if(userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }
        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(request.getPassword());
        userRepo.save(newUser);

        // Création compte
        Account acc = new Account();
        acc.setUser(newUser);
        acc.setBalance(java.math.BigDecimal.ZERO);
        accountRepo.save(acc);

        return newUser;
    }
}
