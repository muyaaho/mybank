package com.mybank.investment.service;

import com.mybank.investment.dto.InvestmentSummaryResponse;
import com.mybank.investment.model.Investment;
import com.mybank.investment.model.RoundUpConfig;
import com.mybank.investment.repository.InvestmentRepository;
import com.mybank.investment.repository.RoundUpConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Investment service
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentRepository investmentRepository;
    private final RoundUpConfigRepository roundUpConfigRepository;

    public InvestmentSummaryResponse getInvestmentSummary(String userId) {
        log.info("Fetching investment summary for user: {}", userId);

        List<Investment> investments = investmentRepository.findByUserIdOrderByInvestedAtDesc(userId);

        BigDecimal totalInvested = investments.stream()
                .map(Investment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Optional<RoundUpConfig> configOpt = roundUpConfigRepository.findByUserIdAndEnabled(userId, true);

        BigDecimal totalRoundedUp = configOpt.map(RoundUpConfig::getTotalRoundedUp).orElse(BigDecimal.ZERO);
        int totalRoundUpTransactions = configOpt.map(RoundUpConfig::getTotalTransactions).orElse(0);

        List<InvestmentSummaryResponse.InvestmentDetail> recentInvestments = investments.stream()
                .limit(10)
                .map(investment -> InvestmentSummaryResponse.InvestmentDetail.builder()
                        .investmentId(investment.getId())
                        .productName(investment.getProductName())
                        .investmentType(investment.getInvestmentType().name())
                        .amount(investment.getAmount())
                        .investedAt(investment.getInvestedAt().toString())
                        .build())
                .collect(Collectors.toList());

        return InvestmentSummaryResponse.builder()
                .totalInvested(totalInvested)
                .totalRoundedUp(totalRoundedUp)
                .totalRoundUpTransactions(totalRoundUpTransactions)
                .recentInvestments(recentInvestments)
                .build();
    }
}
