package com.mybank.investment.repository;

import com.mybank.investment.model.RoundUpConfig;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Round-up configuration repository
 */
@Repository
public interface RoundUpConfigRepository extends MongoRepository<RoundUpConfig, String> {

    Optional<RoundUpConfig> findByUserIdAndEnabled(String userId, boolean enabled);

    Optional<RoundUpConfig> findByUserIdAndSourceAccountId(String userId, String sourceAccountId);
}
