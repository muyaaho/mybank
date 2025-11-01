package com.mybank.payment.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Subscription entity for recurring payments
 */
@Document(collection = "subscriptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    @Id
    private String id;

    private String userId;

    private String accountId;

    private String serviceName; // Netflix, Spotify, etc.

    private String serviceType; // OTT, TELECOM, TRANSPORTATION, etc.

    private BigDecimal amount;

    private String currency;

    private int billingDayOfMonth;

    private LocalDate nextBillingDate;

    private LocalDate lastBillingDate;

    private boolean isActive;

    private boolean autoPayEnabled;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
