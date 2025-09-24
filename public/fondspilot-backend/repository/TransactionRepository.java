package com.fondspilot.repositories;

import com.fondspilot.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountUserIdOrderByCreatedAtDesc(Long userId);
}
