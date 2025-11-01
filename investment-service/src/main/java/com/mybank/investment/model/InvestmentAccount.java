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
 * Investment account entity
 */
@Document(collection = "investment_accounts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentAccount {

    @Id
    private String id;

    private String userId;

    private String accountNumber;

    private String accountName;

    private BigDecimal balance;

    private String currency;

    private AccountType accountType; // STOCKS, ETF, ROUNDUP

    private boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public enum AccountType {
        STOCKS, ETF, ROUNDUP, FUND
    }
}
