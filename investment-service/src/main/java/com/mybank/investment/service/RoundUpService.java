package com.mybank.investment.service;

import com.mybank.common.event.PaymentCompletedEvent;
import com.mybank.investment.model.Investment;
import com.mybank.investment.model.InvestmentAccount;
import com.mybank.investment.model.RoundUpConfig;
import com.mybank.investment.repository.InvestmentAccountRepository;
import com.mybank.investment.repository.InvestmentRepository;
import com.mybank.investment.repository.RoundUpConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Round-up investing service implementing EDA pattern
 * Automatically invests spare change from payments
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RoundUpService {

    private final RoundUpConfigRepository roundUpConfigRepository;
    private final InvestmentRepository investmentRepository;
    private final InvestmentAccountRepository investmentAccountRepository;

    @Transactional
    public void processRoundUp(PaymentCompletedEvent event) {
        log.info("Processing round-up for payment: {}", event.getPaymentId());

        // Find user's round-up configuration
        Optional<RoundUpConfig> configOpt = roundUpConfigRepository
                .findByUserIdAndSourceAccountId(event.getUserId(), event.getAccountId());

        if (configOpt.isEmpty() || !configOpt.get().isEnabled()) {
            log.info("Round-up not enabled for user: {}", event.getUserId());
            return;
        }

        RoundUpConfig config = configOpt.get();

        // Calculate round-up amount
        BigDecimal roundUpAmount = calculateRoundUp(event.getAmount(), config.getRoundUpUnit());

        if (roundUpAmount.compareTo(BigDecimal.ZERO) <= 0) {
            log.info("No round-up needed for amount: {}", event.getAmount());
            return;
        }

        log.info("Round-up calculated: {} from payment amount: {}", roundUpAmount, event.getAmount());

        // Get target investment account
        InvestmentAccount investmentAccount = investmentAccountRepository
                .findById(config.getTargetInvestmentAccountId())
                .orElseThrow(() -> new RuntimeException("Investment account not found"));

        // Create investment record
        Investment investment = Investment.builder()
                .userId(event.getUserId())
                .accountId(investmentAccount.getId())
                .productId("ROUNDUP-PRODUCT-001") // Default round-up product
                .productName("Round-up Investment")
                .investmentType(Investment.InvestmentType.ROUNDUP)
                .amount(roundUpAmount)
                .currency(event.getCurrency())
                .relatedPaymentId(event.getPaymentId())
                .investedAt(LocalDateTime.now())
                .build();

        investmentRepository.save(investment);

        // Update investment account balance
        investmentAccount.setBalance(
                investmentAccount.getBalance().add(roundUpAmount)
        );
        investmentAccountRepository.save(investmentAccount);

        // Update round-up config statistics
        config.setTotalRoundedUp(
                config.getTotalRoundedUp().add(roundUpAmount)
        );
        config.setTotalTransactions(config.getTotalTransactions() + 1);
        config.setUpdatedAt(LocalDateTime.now());
        roundUpConfigRepository.save(config);

        log.info("Round-up investment completed: {} KRW", roundUpAmount);
    }

    /**
     * Calculate round-up amount
     * Example: payment 3,450 KRW with unit 1,000 -> round up to 4,000, invest 550 KRW
     */
    private BigDecimal calculateRoundUp(BigDecimal paymentAmount, BigDecimal roundUpUnit) {
        BigDecimal remainder = paymentAmount.remainder(roundUpUnit);

        if (remainder.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO; // Already rounded
        }

        return roundUpUnit.subtract(remainder);
    }
}
