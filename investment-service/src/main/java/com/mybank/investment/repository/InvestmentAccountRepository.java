package com.mybank.investment.repository;

import com.mybank.investment.model.InvestmentAccount;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Investment account repository
 */
@Repository
public interface InvestmentAccountRepository extends MongoRepository<InvestmentAccount, String> {

    List<InvestmentAccount> findByUserIdAndIsActive(String userId, boolean isActive);
}
