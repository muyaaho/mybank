package com.mybank.pfm.service;

import com.mybank.pfm.dto.SpendingAnalysisResponse;
import com.mybank.pfm.model.ConsumptionAnalysis;
import com.mybank.pfm.repository.ConsumptionAnalysisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Spending analysis service
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SpendingAnalysisService {

    private final ConsumptionAnalysisRepository consumptionAnalysisRepository;

    public SpendingAnalysisResponse getSpendingAnalysis(String userId, int daysBack) {
        log.info("Fetching spending analysis for user: {}, days back: {}", userId, daysBack);

        LocalDateTime startDate = LocalDateTime.now().minusDays(daysBack);
        LocalDateTime endDate = LocalDateTime.now();

        List<ConsumptionAnalysis> analyses = consumptionAnalysisRepository
                .findByUserIdAndTransactionDateBetween(userId, startDate, endDate);

        BigDecimal totalSpending = analyses.stream()
                .map(ConsumptionAnalysis::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Group by category
        Map<String, List<ConsumptionAnalysis>> byCategory = analyses.stream()
                .collect(Collectors.groupingBy(ConsumptionAnalysis::getCategory));

        List<SpendingAnalysisResponse.CategorySpending> categoryBreakdown = byCategory.entrySet().stream()
                .map(entry -> {
                    List<ConsumptionAnalysis> categoryAnalyses = entry.getValue();
                    BigDecimal categoryTotal = categoryAnalyses.stream()
                            .map(ConsumptionAnalysis::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal average = categoryTotal.divide(
                            BigDecimal.valueOf(categoryAnalyses.size()),
                            2,
                            RoundingMode.HALF_UP
                    );

                    return SpendingAnalysisResponse.CategorySpending.builder()
                            .category(entry.getKey())
                            .amount(categoryTotal)
                            .transactionCount(categoryAnalyses.size())
                            .averageAmount(average)
                            .build();
                })
                .collect(Collectors.toList());

        // Get anomalous transactions
        List<SpendingAnalysisResponse.AnomalousTransaction> anomalousTransactions = analyses.stream()
                .filter(ConsumptionAnalysis::isAnomalous)
                .map(analysis -> SpendingAnalysisResponse.AnomalousTransaction.builder()
                        .transactionId(analysis.getTransactionId())
                        .category(analysis.getCategory())
                        .amount(analysis.getAmount())
                        .merchantName(analysis.getMerchantName())
                        .reason(analysis.getAnomalyReason())
                        .build())
                .collect(Collectors.toList());

        return SpendingAnalysisResponse.builder()
                .totalSpending(totalSpending)
                .period(String.format("Last %d days", daysBack))
                .categoryBreakdown(categoryBreakdown)
                .anomalousTransactions(anomalousTransactions)
                .build();
    }
}
