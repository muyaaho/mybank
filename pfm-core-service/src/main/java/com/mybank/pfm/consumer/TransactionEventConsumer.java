package com.mybank.pfm.consumer;

import com.mybank.common.event.TransactionEvent;
import com.mybank.pfm.analyzer.SpendingAnalyzer;
import com.mybank.pfm.model.ConsumptionAnalysis;
import com.mybank.pfm.repository.ConsumptionAnalysisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

/**
 * Kafka consumer for transaction events
 * Implements EDA pattern for asynchronous consumption analysis
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionEventConsumer {

    private final SpendingAnalyzer spendingAnalyzer;
    private final ConsumptionAnalysisRepository consumptionAnalysisRepository;

    @KafkaListener(
            topics = "transaction-events",
            groupId = "pfm-core-service",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeTransactionEvent(
            @Payload TransactionEvent event,
            Acknowledgment acknowledgment) {

        try {
            log.info("Received transaction event: {}", event.getEventId());

            // Analyze transaction
            ConsumptionAnalysis analysis = spendingAnalyzer.analyze(event);

            // Save analysis result
            consumptionAnalysisRepository.save(analysis);

            log.info("Transaction analysis completed: {}", analysis.getId());

            // Acknowledge message
            acknowledgment.acknowledge();

        } catch (Exception e) {
            log.error("Error processing transaction event: {}", event.getEventId(), e);
            // Don't acknowledge - message will be reprocessed
        }
    }
}
