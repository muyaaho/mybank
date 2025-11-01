package com.mybank.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private String paymentId;
    private String status;
    private BigDecimal amount;
    private String currency;
    private String recipientName;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private String message;
}
