package com.mybank.payment.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment entity
 */
@Document(collection = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    private String id;

    private String userId;

    private String fromAccountId;

    private String toAccountId;

    private String recipientName;

    private BigDecimal amount;

    private String currency;

    private PaymentType paymentType; // TRANSFER, BILL, SUBSCRIPTION

    private PaymentStatus status; // PENDING, COMPLETED, FAILED

    private String merchantName;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    private String failureReason;

    public enum PaymentType {
        TRANSFER, BILL, SUBSCRIPTION
    }

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, CANCELLED
    }
}
