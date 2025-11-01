package com.mybank.investment.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Round-up configuration for automatic investing
 */
@Document(collection = "roundup_configs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoundUpConfig {

    @Id
    private String id;

    private String userId;

    private String sourceAccountId; // Payment account

    private String targetInvestmentAccountId; // Investment account for round-up

    private BigDecimal roundUpUnit; // 100, 1000, etc. (KRW)

    private boolean enabled;

    private BigDecimal totalRoundedUp;

    private int totalTransactions;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
