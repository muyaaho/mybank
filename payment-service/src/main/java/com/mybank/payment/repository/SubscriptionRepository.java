package com.mybank.payment.repository;

import com.mybank.payment.model.Subscription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Subscription repository
 */
@Repository
public interface SubscriptionRepository extends MongoRepository<Subscription, String> {

    List<Subscription> findByUserIdAndIsActive(String userId, boolean isActive);

    List<Subscription> findByNextBillingDateAndAutoPayEnabled(LocalDate nextBillingDate, boolean autoPayEnabled);
}
