package com.mybank.payment.repository;

import com.mybank.payment.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Payment repository
 */
@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {

    List<Payment> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Payment> findByUserIdAndCreatedAtBetween(String userId, LocalDateTime start, LocalDateTime end);

    List<Payment> findByUserIdAndStatus(String userId, Payment.PaymentStatus status);
}
