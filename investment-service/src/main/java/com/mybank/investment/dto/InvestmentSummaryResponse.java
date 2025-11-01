package com.mybank.investment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Investment summary response DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentSummaryResponse {

    private BigDecimal totalInvested;
    private BigDecimal totalRoundedUp;
    private int totalRoundUpTransactions;
    private List<InvestmentDetail> recentInvestments;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvestmentDetail {
        private String investmentId;
        private String productName;
        private String investmentType;
        private BigDecimal amount;
        private String investedAt;
    }
}
