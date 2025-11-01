package com.mybank.payment.service;

import com.mybank.common.event.PaymentCompletedEvent;
import com.mybank.common.event.TransactionEvent;
import com.mybank.common.exception.BusinessException;
import com.mybank.payment.dto.PaymentResponse;
import com.mybank.payment.dto.TransferRequest;
import com.mybank.payment.model.Payment;
import com.mybank.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

/**
 * Payment service implementing EDA pattern
 * Publishes events to Kafka for downstream processing
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String TRANSACTION_LOCK_PREFIX = "payment:lock:";

    @Transactional
    public PaymentResponse transfer(String userId, TransferRequest request) {
        log.info("Processing transfer for user: {}, amount: {}", userId, request.getAmount());

        // Acquire distributed lock to prevent duplicate payments
        String lockKey = TRANSACTION_LOCK_PREFIX + userId + ":" + request.getFromAccountId();
        Boolean lockAcquired = redisTemplate.opsForValue().setIfAbsent(lockKey, "locked", 30, TimeUnit.SECONDS);

        if (Boolean.FALSE.equals(lockAcquired)) {
            throw new BusinessException("PAYMENT_IN_PROGRESS", "Another payment is in progress");
        }

        try {
            // Create payment record
            Payment payment = Payment.builder()
                    .userId(userId)
                    .fromAccountId(request.getFromAccountId())
                    .toAccountId(request.getToAccountId())
                    .recipientName(request.getRecipientName())
                    .amount(request.getAmount())
                    .currency("KRW")
                    .paymentType(Payment.PaymentType.TRANSFER)
                    .status(Payment.PaymentStatus.PENDING)
                    .description(request.getDescription())
                    .createdAt(LocalDateTime.now())
                    .build();

            // TODO: Integrate with actual banking system
            // For now, simulate successful payment
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            payment.setCompletedAt(LocalDateTime.now());

            payment = paymentRepository.save(payment);

            // Publish payment completed event to Kafka
            publishPaymentCompletedEvent(payment);

            // Publish transaction event for PFM analysis
            publishTransactionEvent(payment);

            log.info("Payment completed: {}", payment.getId());

            return buildPaymentResponse(payment, "Payment completed successfully");

        } finally {
            // Release lock
            redisTemplate.delete(lockKey);
        }
    }

    public Payment getPaymentById(String paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BusinessException("PAYMENT_NOT_FOUND", "Payment not found"));
    }

    private void publishPaymentCompletedEvent(Payment payment) {
        PaymentCompletedEvent event = PaymentCompletedEvent.builder()
                .eventType("PAYMENT_COMPLETED")
                .userId(payment.getUserId())
                .paymentId(payment.getId())
                .accountId(payment.getFromAccountId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .merchantName(payment.getRecipientName())
                .build();

        kafkaTemplate.send("payment-completed", event.getPaymentId(), event);
        log.info("Published payment completed event: {}", event.getEventId());
    }

    private void publishTransactionEvent(Payment payment) {
        TransactionEvent event = TransactionEvent.builder()
                .eventType("TRANSACTION")
                .userId(payment.getUserId())
                .transactionId(payment.getId())
                .accountId(payment.getFromAccountId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .category("TRANSFER")
                .merchantName(payment.getRecipientName())
                .transactionType("DEBIT")
                .status(payment.getStatus().name())
                .build();

        kafkaTemplate.send("transaction-events", event.getTransactionId(), event);
        log.info("Published transaction event: {}", event.getEventId());
    }

    private PaymentResponse buildPaymentResponse(Payment payment, String message) {
        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .status(payment.getStatus().name())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .recipientName(payment.getRecipientName())
                .createdAt(payment.getCreatedAt())
                .completedAt(payment.getCompletedAt())
                .message(message)
                .build();
    }
}
