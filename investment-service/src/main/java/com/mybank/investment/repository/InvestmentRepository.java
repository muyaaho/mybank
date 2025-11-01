package com.mybank.investment.repository;

import com.mybank.investment.model.Investment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Investment repository
 */
@Repository
public interface InvestmentRepository extends MongoRepository<Investment, String> {

    List<Investment> findByUserIdOrderByInvestedAtDesc(String userId);

    List<Investment> findByUserIdAndInvestmentType(String userId, Investment.InvestmentType investmentType);
}
