package com.mybank.pfm.analyzer;

import com.mybank.common.event.TransactionEvent;
import com.mybank.pfm.model.ConsumptionAnalysis;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * AI-based spending analyzer for categorization and anomaly detection
 */
@Slf4j
@Component
public class SpendingAnalyzer {

    private static final BigDecimal ANOMALY_THRESHOLD = new BigDecimal("100000"); // 100,000 KRW

    public ConsumptionAnalysis analyze(TransactionEvent event) {
        log.info("Analyzing transaction: {}", event.getTransactionId());

        String category = categorizeTransaction(event);
        boolean isAnomalous = detectAnomaly(event);
        String anomalyReason = isAnomalous ? "Unusually large transaction" : null;

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("originalCategory", event.getCategory());
        metadata.put("merchantType", detectMerchantType(event.getMerchantName()));

        return ConsumptionAnalysis.builder()
                .userId(event.getUserId())
                .transactionId(event.getTransactionId())
                .category(category)
                .amount(event.getAmount())
                .merchantName(event.getMerchantName())
                .transactionDate(event.getTimestamp())
                .metadata(metadata)
                .isAnomalous(isAnomalous)
                .anomalyReason(anomalyReason)
                .analyzedAt(LocalDateTime.now())
                .build();
    }

    private String categorizeTransaction(TransactionEvent event) {
        // Simplified categorization logic
        // In production, this would use ML model
        String merchantName = event.getMerchantName().toLowerCase();

        if (merchantName.contains("restaurant") || merchantName.contains("cafe")) {
            return "FOOD";
        } else if (merchantName.contains("gas") || merchantName.contains("transport")) {
            return "TRANSPORT";
        } else if (merchantName.contains("mart") || merchantName.contains("shop")) {
            return "SHOPPING";
        } else if (merchantName.contains("movie") || merchantName.contains("game")) {
            return "ENTERTAINMENT";
        } else {
            return event.getCategory() != null ? event.getCategory() : "OTHER";
        }
    }

    private boolean detectAnomaly(TransactionEvent event) {
        // Simple threshold-based anomaly detection
        // In production, this would use statistical models or ML
        return event.getAmount().compareTo(ANOMALY_THRESHOLD) > 0;
    }

    private String detectMerchantType(String merchantName) {
        // Placeholder for merchant type detection
        return "RETAIL";
    }
}
