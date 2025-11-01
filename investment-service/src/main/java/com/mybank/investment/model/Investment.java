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
 * Investment transaction entity
 */
@Document(collection = "investments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Investment {

    @Id
    private String id;

    private String userId;

    private String accountId;

    private String productId;

    private String productName;

    private InvestmentType investmentType; // ROUNDUP, MANUAL, AUTO

    private BigDecimal amount;

    private String currency;

    private String relatedPaymentId; // For round-up investments

    private LocalDateTime investedAt;

    public enum InvestmentType {
        ROUNDUP, MANUAL, AUTO
    }
}
