package com.mybank.pfm.repository;

import com.mybank.pfm.model.ConsumptionAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Consumption analysis repository
 */
@Repository
public interface ConsumptionAnalysisRepository extends MongoRepository<ConsumptionAnalysis, String> {

    List<ConsumptionAnalysis> findByUserIdAndTransactionDateBetween(
            String userId, LocalDateTime startDate, LocalDateTime endDate);

    List<ConsumptionAnalysis> findByUserIdAndIsAnomalous(String userId, boolean isAnomalous);

    List<ConsumptionAnalysis> findByUserIdAndCategory(String userId, String category);
}
