package com.mybank.investment.consumer;

import com.mybank.common.event.PaymentCompletedEvent;
import com.mybank.investment.service.RoundUpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

/**
 * Kafka consumer for payment completed events
 * Implements EDA pattern for automatic round-up investing
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentCompletedEventConsumer {

    private final RoundUpService roundUpService;

    @KafkaListener(
            topics = "payment-completed",
            groupId = "investment-service",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumePaymentCompletedEvent(
            @Payload PaymentCompletedEvent event,
            Acknowledgment acknowledgment) {

        try {
            log.info("Received payment completed event: {}", event.getEventId());

            // Process round-up investment
            roundUpService.processRoundUp(event);

            // Acknowledge message
            acknowledgment.acknowledge();

        } catch (Exception e) {
            log.error("Error processing payment completed event: {}", event.getEventId(), e);
            // Don't acknowledge - message will be reprocessed
        }
    }
}
